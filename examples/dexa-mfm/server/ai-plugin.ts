import { defineAIPluginManifest } from 'chatgpt-plugin'

import * as config from './config'

const { name, ...aiPlugin } = config.aiPlugin

export const aiPluginManifest = defineAIPluginManifest(
  {
    description_for_human: config.pkg.description,
    name_for_human: name,
    ...aiPlugin
  },
  { openAPIUrl: `${config.url}/api/openapi.json` }
)
