---
title: 'Full text search with Hasura'
date: '2021-08-16'
category: ['Databases', 'Dev']
type: 'note'
---

# Full text search with Hasura

[Hasura](https://hasura.io) is an open source GraphQL layer on top of PostgreSQL that makes it easy to manage your data, and automatically exposes it through a GraphQL endpoint.

Having now tinkered with it on a few smaller personal projects, and two professional projects, I've started wanting to do things that don't neceessarily come naturally on Hasura. _Full text search_ is one of those.

---

## Scenario

Let's use a simple table as an example:

```sql
CREATE TABLE "articles" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "title" text,
    "content" text,
    "tags" text
)
```

Our goal is to run full text search over a document comprising `title` `content` `tags`.

## The simple way

The easiest way to integrate a form of search, would be to use some basic PostgreSQL [pattern matching](https://www.postgresql.org/docs/9.4/functions-matching.html) - Which Hasura exposes in it's searches.

```graphql
query Search($searchValue: String! = "%some search string%") {
  articles(
    where: {
      _or: [
        { title: { _ilike: $searchValue } }
        { content: { _ilike: $searchValue } }
        { tags: { _ilike: $searchValue } }
      ]
    }
  ) {
    id
    title
    content
    tags
  }
}
```

Simple. No frills. But there are some cons:

1. No fuzzy search
2. No ranking of results.
3. No way of weighting the results based on whether the match is in the title, content, or tags.
4. No dictionary - if you search for "amazingly" it won't match "amazing" or "amazed".
5. It's super verbose, clunky to write, and prone to human programmer error!

So this is fine for very simple, and restrictive search scenarios. But we can do better.

## Fuzzy Search via PostgreSQL Function

This example is taken directly from the [Hasura documentation](https://hasura.io/docs/latest/graphql/core/databases/postgres/schema/custom-functions.html#example-fuzzy-match-search-functions):

Open up the Hasura console, navigate to to `Data > SQL`, then do the following:

```sql
CREATE EXTENSION pg_trgm;
```

We need this extension for creating the GIN index bellow

```sql
CREATE INDEX articles_gin_idx ON articles
USING GIN ((title || ' ' || content || ' ' || tags) gin_trgm_ops);
```

As a non PostgreSQL expert, this felt like some hand wavey voodoo... _What on earth is a GIN index? What on earth is a `gin_trgm_ops`?_

Lets start with the `trgm` part:

> A trigram is a group of three consecutive characters taken from a string. We can measure the similarity of two strings by counting the number of trigrams they share. This simple idea turns out to be very effective for measuring the similarity of words in many natural languages.
>
> [PostgreSQL documentation - pg_trgm](https://www.postgresql.org/docs/current/pgtrgm.html)

So this function would break the word `test` into `t` `te` `tes` `est` `st` `t`

> GIN is designed for handling cases where the items to be indexed are composite values, and the queries to be handled by the index need to search for element values that appear within the composite items.
>
> [PostgreSQL documentation - GIN intro](https://www.postgresql.org/docs/9.5/gin-intro.html)

So in this case, we're creating a _composite_ item from `title`,`content` and`tags`, turning it into a _trigram_ and, for performance reasons, we want our PostgreSQL database to index this for faster retrieval.

Now create the actual function (make sure you check the box: "track this function")

```sql
CREATE FUNCTION search_articles(search text)
RETURNS SETOF articles AS $$
    SELECT *
    FROM articles
    WHERE
      search <% (title || ' ' || content || ' ' || tags)
    ORDER BY
      similarity(search, (title || ' ' || content || ' ' || tags)) DESC
    LIMIT 5;
$$ LANGUAGE sql STABLE;
```

The key thing here is the `similarity(arg1, arg2)` function. It's a function from the `pg_trgm` module that splits both arguments into trigrams, and compares them. This means our search is quite forgiving on typos and spelling mistakes!

Not bad, but we can do better.

## Full Text Search using a Dictionary

The issue with fuzzy search, is that it doesn't perform well on derivative words. eg: "adventure" versus "adventuring" or "adventured". What if the person running the search doesn't actually know the exact words to look for? Fuzzy search is forgiving of typos, but not of inprecise search terms.

Enter PostgreSQL Dictionaries.

> Dictionaries allow fine-grained control over how tokens are normalized. With appropriate dictionaries, you can:
>
> - Define stop words that should not be indexed.
> - Map synonyms to a single word using Ispell.
> - Map phrases to a single word using a thesaurus.
> - Map different variations of a word to a canonical form using an Ispell dictionary.
> - Map different variations of a word to a canonical form using Snowball stemmer rules.
>
> [PostgreSQL documentation - Text Search Introduction](https://www.postgresql.org/docs/13/textsearch-intro.html)

Nice. REALLY nice. Now let's make it happen.

First, let's create a function that can take all the columns we're interested in, and turn them into a document, and save that document into a new column called `ts_vector`:

```sql
CREATE OR REPLACE FUNCTION public.create_ts_vector()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
      BEGIN
          NEW.ts_vector =
            setweight(to_tsvector('simple', coalesce(NEW.title, '')), 'A') ||
            setweight(to_tsvector('simple', coalesce(NEW.content, '')), 'B') ||
            setweight(to_tsvector(coalesce(NEW.tags '')), 'C')
          RETURN NEW;
      END;
  $function$;
```

Quite a few things happening here.

1. the `coalesce(arg1, arg2)` function. This is a precaution, it returns the first non-null argument. We need to guarantee a string, so we use this.
2. the `to_tsvector(arg1)` function. According to the PostgreSQL docs:
   > A tsvector value is a sorted list of distinct lexemes, which are words that have been normalized to merge different variants of the same word... Sorting and duplicate-elimination are done automatically during input.
   >
   > [PostgreSQL documentation - Text Search Types](https://www.postgresql.org/docs/13/datatype-textsearch.html)
3. the `setweight(arg1, arg2)` function. Which ascribes a weight (denoted by capitalised letters: A, B, C etc in descending order of importance), to that specific vector. This is useful for ordering or prioritising parts of our document. In this case, we've decided that the `title` should be given the most weight when matched against search terms.

Ok, next step: a `trigger` that runs anytime a row is inserted or updated, so that this document column can be created/updated:

```sql
CREATE TRIGGER "add_trigger"
BEFORE INSERT OR UPDATE ON "public"."articles"
FOR EACH ROW EXECUTE FUNCTION create_ts_vector();
```

Pretty self explanatory.

Final Step: create an actual search function and expose it to hasura.

```sql
CREATE OR REPLACE FUNCTION public.search_articles(search text)
 RETURNS SETOF articles
 LANGUAGE sql
 STABLE
AS $function$
    SELECT *
    FROM articles
    WHERE
      articles.ts_vector @@ plainto_tsquery(search)
    ORDER BY ts_rank(articles.ts_vector, plainto_tsquery(search)) DESC
$function$;
```

Make sure to track this function from the Hasura console.

So, what's happening here?

1. This function takes in a search term as text.
2. It returns a set of articles.
3. It takes the search term and uses it as an argument in the `plainto_tsquery()` function, which does basically the same thing as the `to_tsvector()` function, but for the search query.
4. Compares and tries to match the vector to the query using the ["@@" operator](https://www.postgresql.org/docs/13/textsearch-intro.html#TEXTSEARCH-MATCHING).
5. Returns the articles ordered and ranked (remember how we set a weight to our search terms?) by `ts_rank()`

Now, we have a new hasura graphql query type which we can run using:

```graphql
query search($searchTerm: String) {
  search_articles($searchTerm) {
    id
    title
    content
    tags
  }
}
```
