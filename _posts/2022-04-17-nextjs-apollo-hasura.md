---
title: 'Next.js, Apollo.js, Hasura - a basic authenticated set up'
date: '2022-04-17'
category: ['Dev']
draft: true
type: 'note'
---

# Next.js, Apollo.js, Hasura - a basic authenticated set up

This triad is one that I've now used three times in deployed, live, money making projects for others. However, I've yet to be fully satisfied with the way it was rolled out.

It uses a by now common language/framework stack of: `React` and `GraphQL`.

## The ideal architecture

A modern website/app requires authentication. It has to be able to server side render (SSR), and it has to be able to client side render (CSR), it has to have self contained components that can be in charge of their own data fetching, and these have to be able to do so in a discriminatory manner with regards to access control (i.e: not load data that a specific user shouldn't be able to see).

The developer experience for this architecture should minimize the amount of possible errors, especially with regards to authorisation. So I shouldn't be able to _accidentally_ load write a query with full admin privileges and have it run from an end users session.

From a networking perspective, queries should not run twice either - specifically, if a page is server side rendered, then the data should be present and cached on the client as well; fully mutable by future GraphQL operations.

## Implementation

TOC:

1. Authentication
2. Apollo.js
3. Data Fetching

### 1. Authentication

I want to play to each layers strengths. Sure, i can send an authentication cookie to Hasura, but this requires Hasura to then relay that cookie back to my server to validation, before sending the data back to the client. This is a few too many network calls for my liking. So that means we need a JWT. However, if I'm loading a page using SSR, then the client cannot send a JWT yet since there's no document from which javascript can send requests... so we also need a cookie, and this cookie needs to be secure (not decodable by client). Yet, i also want to minimize CSURF attacks, as well as XSS attacks, so this is turning into quite the headache.

Ok, here's an architecture that can address this:

- Authenticate a user by:
  1. requiring some form of credentials
  2. responding with a JWT, and a session refresh token in a cookie
