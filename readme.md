<a href="https://github.com/transitive-bullshit/chatgpt-plugin-ts">
  <img alt="ChatGPT Plugin TS" src="/media/social.png">
</a>

<h1 align="center">ChatGPT Plugin TS</h1>

<p align="center">
  Examples and resources for creating ChatGPT plugins in TypeScript.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/chatgpt-plugin"><img alt="chatgpt-plugin NPM package" src="https://img.shields.io/npm/v/chatgpt-plugin.svg" /></a>
  <a href="https://github.com/transitive-bullshit/chatgpt-plugin-ts/actions/workflows/test.yml"><img alt="Build Status" src="https://github.com/transitive-bullshit/chatgpt-plugin-ts/actions/workflows/test.yml/badge.svg" /></a>
  <a href="https://github.com/transitive-bullshit/chatgpt-plugin-ts/blob/main/license"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-blue" /></a>
  <a href="https://prettier.io"><img alt="Prettier Code Formatting" src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg" /></a>
</p>

- [Intro](#intro)
- [Example Plugins](#example-plugins)
- [Notes](#notes)
- [License](#license)

## Intro

TODO

## Example Plugins

## Notes

- `name_for_human`
  - 30 character max
- `name_for_model`
  - 50 character max
- `description_for_human`
  - 120 character max
- `description_for_model`
  - 8000 character max
  - Max decreases over time
- API response body length
  - 100k character limit
  - Decreases over time
  - Subject to limitations
- TODO: `defineConfig` function to help validate `ai-plugin.json` configs?

## License

MIT © [Travis Fischer](https://transitivebullsh.it)

If you found this project interesting, please consider [sponsoring me](https://github.com/sponsors/transitive-bullshit) or <a href="https://twitter.com/transitive_bs">following me on twitter <img src="https://storage.googleapis.com/saasify-assets/twitter-logo.svg" alt="twitter" height="24px" align="center"></a>
