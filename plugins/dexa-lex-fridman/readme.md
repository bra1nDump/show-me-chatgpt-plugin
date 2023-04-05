# ChatGPT Plugin Example - Dexa Lex Fridman Podcast <!-- omit in toc -->

> Example ChatGPT Plugin to search across all of the [Lex Fridman Podcast](https://lexfridman.com/podcast/) episodes – powered by [Dexa](https://dexa.ai) 🔥

[![Build Status](https://github.com/transitive-bullshit/chatgpt-plugin-ts/actions/workflows/test.yml/badge.svg)](https://github.com/transitive-bullshit/chatgpt-plugin-ts/actions/workflows/test.yml) [![MIT License](https://img.shields.io/badge/license-MIT-blue)](https://github.com/transitive-bullshit/chatgpt-plugin-ts/blob/main/license) [![Prettier Code Formatting](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)

- [Intro](#intro)
- [Dexa](#dexa)
  - [Lex Fridman Stats](#lex-fridman-stats)
- [Stack](#stack)
- [License](#license)

## Intro

This is a powerful ChatGPT Plugin which gives ChatGPT access to all of the transcriptions across 300 episodes of the [Lex Fridman Podcast](https://lexfridman.com/podcast/).

It contains a single API route.

[Live demo](https://chatgpt-plugin-dexa-lex-fridman.transitive-bullshit.workers.dev/.well-known/ai-plugin.json)

## Dexa

[Dexa](https://dexa.ai) has already done all the hard work of aggregating, transcribing, processing, and indexing the Lex Fridman Podcast (and many other podcasts!).

Under the hood, they're doing **a lot** of really awesome, AI-powered data processing:

- TODO @riley

### Lex Fridman Stats

Lex Fridman Podcast stats from [Dexa](https://dexa.ai/) as of April 5, 2023:

- Total audio length: 1 month, 4 days, 21 hours, 8 minutes, 32 seconds
- Total number of episodes: 364
- Total characters transcribed: 1,276,987

## Stack

- [Dexa API](https://dexa.ai/) (currently in private beta)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [@cloudflare/itty-router-openapi](https://github.com/cloudflare/itty-router-openapi)

## License

MIT © [Travis Fischer](https://transitivebullsh.it)

If you found this project interesting, please consider [sponsoring me](https://github.com/sponsors/transitive-bullshit) or <a href="https://twitter.com/transitive_bs">following me on twitter <img src="https://storage.googleapis.com/saasify-assets/twitter-logo.svg" alt="twitter" height="24px" align="center"></a>
