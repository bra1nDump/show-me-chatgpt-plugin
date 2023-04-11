import slugify from '@sindresorhus/slugify'

import * as types from './types'

const preferredKeysOrder: (keyof types.AIPluginManifest)[] = [
  'schema_version',
  'name_for_model',
  'name_for_human',
  'description_for_model',
  'description_for_human',
  'auth',
  'api',
  'logo_url',
  'contact_email',
  'legal_info_url'
]

const preferredKeysOrderMap = preferredKeysOrder.reduce(
  (acc, key, i) => ({ ...acc, [key]: i }),
  {} as Record<keyof types.AIPluginManifest, number>
)

// TODO: better typing and validation
export function defineAIPluginManifest(
  partialPluginManifest: Partial<types.AIPluginManifest>,
  opts: { openAPIUrl?: string } = {}
): types.AIPluginManifest {
  const { openAPIUrl } = opts

  const nameForModel =
    partialPluginManifest.name_for_model ||
    slugify(
      partialPluginManifest.name_for_human ||
        (partialPluginManifest as any).name ||
        'chatgpt test plugin',
      { separator: '_' }
    )
  const nameForHuman =
    partialPluginManifest.name_for_human ||
    (partialPluginManifest as any).name ||
    'chatgpt test plugin'

  const pluginManifest = {
    schema_version: 'v1',
    auth: {
      type: 'none'
    },
    api: openAPIUrl
      ? {
          type: 'openapi',
          url: openAPIUrl,
          has_user_authentication: false
        }
      : undefined,
    ...partialPluginManifest,
    name_for_model: nameForModel,
    name_for_human: nameForHuman
  } as types.AIPluginManifest

  // ensure the manifest keys are always in a determinstic order
  const pluginManifestSorted = Object.fromEntries(
    Object.entries(pluginManifest).sort((a, b) => {
      const kA = preferredKeysOrderMap[a[0]] ?? Number.POSITIVE_INFINITY
      const kB = preferredKeysOrderMap[b[0]] ?? Number.POSITIVE_INFINITY

      return kA - kB
    })
  ) as types.AIPluginManifest

  return pluginManifestSorted
}
