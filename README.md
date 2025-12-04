Barkle Embed

> An embedding solution for Barkle.
> 
> ![Preview](https://github.com/NarixHine/missbed/assets/127665924/1935d23f-e348-4b77-acf2-35de8b06706a)

## Features

Barkle uses *Incremental Site Generation* with `Next.js`. **Fast. Flexible. Free to deploy your own.**

The following note components are supported:
  - Mention
  - Hashtag
  - URL & Link (with OpenGraph support & no CORS proxy needed)
  - Bold
  - Quote
  - Centre
  - Small
  - Italic
  - Strike
  - Code

## Usage

### Use `embed.barkle.chat`

Embed a note or a timeline of a user using `<iframe>`。

You can read your own UID in `Settings - Other`.

```html
<iframe src='https://embed.barkle.chat/timeline/{user_id}' />

<iframe src='https://embed.barkle.chat/timeboard/{user_id}' />

<iframe src='https://embed.barkle.chat/note/{note_id}' />

Updating to latest Barkle API
--------------------------------

This project now includes a small script and wrapper to help support Barkle's latest OpenAPI spec:

- The OpenAPI spec can be downloaded to `openapi/api.json` using:

```bash
npm run update-api-spec
```

Note: The project cannot always automatically fetch the OpenAPI due to Cloudflare protections — if `npm run update-api-spec` fails, try running it from an environment that can access https://barkle.chat/api.json, or fetch the file manually and save it at `openapi/api.json`.

- After grabbing the spec, you can generate TypeScript definitions with:

```bash
npm run generate-api-types
```

Changes in codebase
--------------------
- `lib/misskey.ts`: now respects the host parameter and defaults to `barkle.chat`.
- `lib/barkle.ts`: a new minimal Barkle API wrapper using `fetch` for direct calls to the Barkle API; used by pages to fetch notes and show endpoints.
- Pages that fetch Barkle data (`pages/note`, `pages/timeboard`, `pages/timeline`) now use `lib/barkle.ts` and gracefully fallback if the API is not reachable during build (useful for local builds or CI blocked by Cloudflare).

If you want to generate a full SDK from the OpenAPI spec (for example using `openapi-generator`), the project now has a script and integration point ready.
```
