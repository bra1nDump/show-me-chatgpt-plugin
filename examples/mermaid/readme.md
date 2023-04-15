<video src="https://user-images.githubusercontent.com/552829/230789960-e6c33215-fcb6-43b3-aa29-2d7a3ccd78dc.mp4" controls="controls">
</video>

# ChatGPT Plugin Example - Dexa Lex Fridman Podcast <!-- omit in toc -->

> Example ChatGPT Plugin to search across all of the [Lex Fridman Podcast](https://lexfridman.com/podcast/) episodes – powered by [Dexa](https://dexa.ai) 🔥

[![Build Status](https://github.com/transitive-bullshit/chatgpt-plugin-ts/actions/workflows/test.yml/badge.svg)](https://github.com/transitive-bullshit/chatgpt-plugin-ts/actions/workflows/test.yml) [![MIT License](https://img.shields.io/badge/license-MIT-blue)](https://github.com/transitive-bullshit/chatgpt-plugin-ts/blob/main/license) [![Prettier Code Formatting](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)

- [Intro](#intro)
- [Stack](#stack)
- [Dexa](#dexa)
  - [Lex Fridman Stats](#lex-fridman-stats)
- [Examples](#examples)
- [License](#license)

## Intro

This is a ChatGPT retrieval plugin which gives ChatGPT access to all of the transcriptions across 360+ episodes of the [Lex Fridman Podcast](https://lexfridman.com/podcast/).

It contains a single API route.

More details can be found in the [twitter launch thread](https://twitter.com/transitive_bs/status/1643990888417464332).

## Stack

- [Dexa API](https://dexa.ai/) (currently in private beta)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [@cloudflare/itty-router-openapi](https://github.com/cloudflare/itty-router-openapi)

Here's an example [live manifest file](https://chatgpt-plugin-dexa-lex-fridman.transitive-bullshit.workers.dev/.well-known/ai-plugin.json). API endpoints are protected so only OpenAI can access them.

## Dexa

[Dexa](https://dexa.ai) has already done all the hard work of aggregating, transcribing, processing, and indexing the Lex Fridman Podcast (and many other podcasts!).

Under the hood, they're doing **a lot** of really awesome, AI-powered data processing:

- Transcriptions with speaker labels (diarization) for attribution (using [Assembly](https://assemblyai.com))
- Automatic post-processing for common transcription errors
- Advanced chunking based on metadata, topic detection, and sentence structure
- Metadata extraction and enrichment with support for photos of speakers
- Heirarchical clustering and summarization

### Lex Fridman Stats

Lex Fridman Podcast stats from [Dexa](https://dexa.ai/) as of April 5, 2023:

- Total number of episodes: 364
- Total characters transcribed: 45,005,793
- Total audio length: ~36 days

## Examples

<p align="center">
  <img src="/media/advice-for-youth-opt.jpg" alt="What advice does Lex's podcast have for young people?" width="45%">
  &nbsp;&nbsp;&nbsp;

  <img src="/media/elon-musk-philosophy-on-life-opt.jpg" alt="What is Elon Musk's philosophy on life?" width="45%">
</p>

<p align="center">
  <img src="/media/poker-and-physics-opt.jpg" alt="What do poker and physics have in common?" width="45%">
  &nbsp;&nbsp;&nbsp;

  <img src="/media/love-opt.jpg" alt="What do Lex's guests think about love?" width="45%">
</p>

## License

MIT © [Travis Fischer](https://transitivebullsh.it)

If you found this project interesting, please consider [sponsoring me](https://github.com/sponsors/transitive-bullshit) or <a href="https://twitter.com/transitive_bs">following me on twitter <img src="https://storage.googleapis.com/saasify-assets/twitter-logo.svg" alt="twitter" height="24px" align="center"></a>
