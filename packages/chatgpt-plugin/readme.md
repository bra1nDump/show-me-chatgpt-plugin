# ChatGPT Plugin <!-- omit in toc -->

> Types and utilities for building ChatGPT Plugins with TypeScript.

[![Build Status](https://github.com/transitive-bullshit/chatgpt-plugin-ts/actions/workflows/test.yml/badge.svg)](https://github.com/transitive-bullshit/chatgpt-plugin-ts/actions/workflows/test.yml) [![MIT License](https://img.shields.io/badge/license-MIT-blue)](https://github.com/transitive-bullshit/chatgpt-plugin-ts/blob/main/license) [![Prettier Code Formatting](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)

- [Intro](#intro)
- [License](#license)

## Intro

Currently, this package only contains types for `.well-known/ai-plugin.json` manifest files. We're actively working on adding more utilities to validate plugin manifests and OpenAPI specs.

We'll also be consolidating best practices as we develop more plugins.

The goals of this package are to:

- Help developers build ChatGPT Plugins with TS
- Distill best practices for building ChatGPT Plugins with TS
- Be agnostic to the underlying server framework (e.g. itty-router, Express, Fastify, etc)
- Be agnostic to the underlying hosting provider (e.g. Cloudflare, Vercel, AWS, etc)

Framework-specific and hosting provider-specific examples can be found in the [example plugins](../../plugins) folder.

See the [main readme](https://github.com/transitive-bullshit/chatgpt-plugin-ts) for more details.

## License

MIT © [Travis Fischer](https://transitivebullsh.it)

If you found this project interesting, please consider [sponsoring me](https://github.com/sponsors/transitive-bullshit) or <a href="https://twitter.com/transitive_bs">following me on twitter <img src="https://storage.googleapis.com/saasify-assets/twitter-logo.svg" alt="twitter" height="24px" align="center"></a>
