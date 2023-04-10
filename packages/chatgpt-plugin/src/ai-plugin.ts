import slugify from '@sindresorhus/slugify'

import * as types from './types'

// TODO: better typing and validation
export function defineAIPluginManifest(
  partialPluginManifest: Partial<types.AIPluginManifest>,
  opts: { host?: string } = {}
): types.AIPluginManifest {
  const { host } = opts

  const nameForModel =
    partialPluginManifest.name_for_model ||
    slugify(partialPluginManifest.name_for_human, { separator: '_' })

  const pluginManifest = {
    schema_version: 'v1',
    name_for_model: nameForModel,
    auth: {
      type: 'none'
    },
    api: host
      ? {
          type: 'openapi',
          url: `https://${host}/openapi.json`,
          has_user_authentication: false
        }
      : undefined,
    ...partialPluginManifest
  } as types.AIPluginManifest

  return pluginManifest
}
