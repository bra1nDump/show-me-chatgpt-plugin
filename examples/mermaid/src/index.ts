import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'
import { defineAIPluginManifest } from 'chatgpt-plugin'

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

router.get('/', routes.MermaidRender)

router.get('/.well-known/ai-plugin.json', (request: Request) => {
  const host = request.headers.get('host')
  const pluginManifest = defineAIPluginManifest(
    {
      description_for_human: pkg.description,
      name_for_human: pkg.aiPlugin.name,
      ...pkg.aiPlugin
    },
    { openAPIUrl: `https://${host}/openapi.json` }
  )

  return new Response(JSON.stringify(pluginManifest, null, 2), {
    headers: {
      'content-type': 'application/json;charset=UTF-8'
    }
  })
})

// 404 for everything else
router.all('*', () => new Response('404 Not Found...', { status: 200 }))

export default {
  fetch: (request: Request, env: Env, ctx: ExecutionContext) =>
    router.handle(request, env, ctx)
}
