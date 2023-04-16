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

// CORS - Doesn't actualy work all that well
router.options('*', (request: Request) => {
  console.log(request.url)
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS'
    }
  })
})

router.get('/', routes.Mermaid)

// 1. Define the plugin manifest
router.get('/.well-known/ai-plugin.json', (request: Request) => {
  const host = request.headers.get('host')
  const pluginManifest = defineAIPluginManifest(
    {
      description_for_human: pkg.description,
      name_for_human: pkg.aiPlugin.name,
      ...pkg.aiPlugin,
      description_for_model: `
      You should use this plugin when people want visualizations.

The plugin takes in a mermaid diagram and renders it returning a link to the rendered image.
The plugin expects a mermaid.js snippet as input.
The snippet that it is passed should use fa v4 icons.
The snippet should only contain the mermaid diagram and NOT the mermaid.js code block using \`\`\`mermaid\`\`\`.

If you think the best diagram to represent the data is a mindmap:
- Limit to 2 outer layers outside the root.

Interpreting the response:
When you get the response it will include an image url, you should render it inline.
`
    },
    { openAPIUrl: `https://${host}/openapi.json` }
  )

  console.log(pluginManifest)

  return new Response(JSON.stringify(pluginManifest, null, 2), {
    headers: {
      'Access-Control-Allow-Origin': '*',
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
