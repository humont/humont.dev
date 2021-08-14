---
title: 'Full text search with Hasura'
date: '2021-03-26'
draft: true
---

# Full text search with Hasura

[Hasura](https://hasura.io) is an open source GraphQL layer on top of Postgres that makes it easy to manage your data, and automatically exposes through a GraphQL endpoint.

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

The easiest way to integrate a form of search, would be to use some basic Postgres [pattern matching](https://www.postgresql.org/docs/9.4/functions-matching.html) - Which Hasura exposes in it's searches.

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
2. No ranking based on well things match - after all: it's looking for a direct match.
3. No way of weighting the results based on whether the match is in the title, content, or tags.
4. No dictionary - if you search for "amazingly" it won't match "amazing" or "amazed".
5. Big issue: it's super verbose, clunky to write, and prone to human programmer error!

So this is fine for very simple, and restrictive search scenarios. But we can do better.

## Fuzzy Search via PostGres Function

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

As a non Postgres expert, this felt like some hand wavey voodoo... _What on earth is a GIN index?_

> GIN is designed for handling cases where the items to be indexed are composite values, and the queries to be handled by the index need to search for element values that appear within the composite items.
> [Postgres documentation - GIN intro](https://www.postgresql.org/docs/9.5/gin-intro.html)

So in this case, we're creating a _composite_ item from `title`,`content` and`tags`, and, for performance reasons, we want our Postgres database to index this for faster retrieval.

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
