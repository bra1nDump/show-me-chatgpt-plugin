import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'
import slugify from '@sindresorhus/slugify'
import { type AIPluginManifest } from 'chatgpt-plugin'

import * as routes from './routes'
import pkg from '../package.json'

export interface Env {
  DEXA_API_BASE_URL: string
}

const router = OpenAPIRouter({
  schema: {
    info: {
      title: pkg.aiPlugin.name,
      version: pkg.version
    }
  }
})

router.get('/search', routes.DexaSearch)

router.get('/.well-known/ai-plugin.json', (request: Request) => {
  const host = request.headers.get('host')
  const nameForModel = slugify(pkg.aiPlugin.name, { separator: '_' })

  const pluginSpec: AIPluginManifest = {
    schema_version: 'v1',
    name_for_model: nameForModel,
    name_for_human: pkg.aiPlugin.name,
    description_for_human: pkg.description,
    auth: {
      type: 'none'
    },
    api: {
      type: 'openapi',
      url: `https://${host}/openapi.json`,
      has_user_authentication: false
    },
    ...pkg.aiPlugin
  }

  return new Response(JSON.stringify(pluginSpec, null, 2), {
    headers: {
      'content-type': 'application/json;charset=UTF-8'
    }
  })
})

// 404 for everything else
router.all('*', () => new Response('Not Found.', { status: 404 }))

export default {
  fetch: (request: Request, env: Env, ctx: ExecutionContext) =>
    router.handle(request, env, ctx)
}
