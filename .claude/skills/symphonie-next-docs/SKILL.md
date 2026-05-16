---
name: symphonie-next-docs
description: Before writing or modifying any Next.js code in la-symphonie-electrique, consult the local Next.js docs at node_modules/next/dist/docs/ because this version has breaking changes from upstream Next.js and training-data knowledge may be wrong.
---

# Symphonie Next.js docs guard

## When this applies

You are about to write, edit, refactor, or review Next.js code (anything touching `app/`, `pages/`, `next.config.*`, route handlers, server components, server actions, middleware, fetch / caching APIs, or `next/*` imports) inside `la-symphonie-electrique/`.

## The problem

This project's `AGENTS.md` states verbatim:

> This is NOT the Next.js you know. This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

If you write Next.js code from memory, you will likely produce code that targets the *wrong* Next.js. The authoritative reference is the local docs (421 files under that path).

## What to do

1. **Identify the topic** you need (routing, data fetching, caching, server actions, middleware, metadata, images, fonts, route handlers, deployment, etc.).
2. **Read the matching file** under `la-symphonie-electrique/node_modules/next/dist/docs/`:
   - `01-app/01-getting-started/*.md` — installation, project structure, layouts/pages, server vs client components, fetching, mutating, caching, revalidating, route handlers, etc.
   - `01-app/02-guides/*.md` — auth, CSP, AI agents, analytics, BFF, CDN caching, CI build caching, etc.
   - `01-app/04-glossary.md` — terminology used in this version.
   - `index.md` at each level — table of contents.
3. **Check for deprecation notices** in the doc you read. If the API you intended is deprecated, find the replacement before writing.
4. **Quote the relevant doc snippet** in your reply (file path + the 1-3 lines that justify the API choice). This proves you checked and helps the user verify.
5. **Then write the code** following the local doc, not training data.

## What not to do

- Don't write `getServerSideProps`, `getStaticProps`, or other pre-app-router APIs without confirming they still exist locally.
- Don't assume `fetch` caching, `revalidate` semantics, `"use client"` / `"use server"` directives match memory — check.
- Don't fall back to "this is how Next.js usually works" — that's exactly what AGENTS.md warned against.

## Quick lookup

If unsure which doc to read, start with `node_modules/next/dist/docs/index.md` or `01-app/index.md`.
