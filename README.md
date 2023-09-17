Barkle Embed

> An embedding solution for Barkle.
> 
> ![Preview](https://github.com/NarixHine/missbed/assets/127665924/1935d23f-e348-4b77-acf2-35de8b06706a)

## Features

Barkle uses *Incremental Site Generation* with `Next.js`. **Fast. Flexible. Free to deploy your own.**

The following note components are supported:
- MFM (the syntax used in Misskey notes, usernames, etc.)
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
- Renote
- Images (including NSFW Warning)
- Hide Content
- Enquête

## Usage

### Use `embed.barkle.chat`

Embed a note or a timeline of a user using `<iframe>`。

You can read your own UID in `Settings - Other`.

```html
<iframe src='https://embed.barkle.chat/timeline/{user_id}' />

<iframe src='https://embed.barkle.chat/timeboard/{user_id}' />

<iframe src='https://embed.barkle.chat/note/{note_id}' />
```
