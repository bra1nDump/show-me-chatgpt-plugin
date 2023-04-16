import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'
import { defineAIPluginManifest } from 'chatgpt-plugin'
import { createCors } from 'itty-cors'

import pkg from '../package.json'
import { MermaidRoute, richPreview } from './routes/Mermaid'

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

const { preflight, corsify } = createCors({ origins: ['*'] })
router.all('*', preflight)

//router.get('/richPreview', richPreview)

// 2. Expose magic openapi.json, expose API itself
router.get('/', MermaidRoute)

// 1. Define the plugin manifest
router.get('/.well-known/ai-plugin.json', (request: Request) => {
  const url = new URL(request.url)
  const host = request.headers.get('host');
  const openAPIUrl = `${url.protocol}//${host}/openapi.json`

  console.log('using manifest', openAPIUrl)
  const pluginManifest = defineAIPluginManifest(
    {
      description_for_human: 'Render any Diagram using Mermaid, GraphViz, and many more.',
      name_for_human: 'Diagram',
      logo_url:
        'https://res.cloudinary.com/deepwave-org/image/upload/v1681620862/Heye.earth/Projects/PinClipart.com_venn-diagram-clipart_5480153_hk80cf.png',
      contact_email: 'kirill2003de@gmail.com',
      legal_info_url: 'https://example.com',
      description_for_model: DESCRIPTION_FOR_MODEL
    },
    { openAPIUrl }
  )

  console.log(pluginManifest)

  return new Response(JSON.stringify(pluginManifest, null, 2), {
    headers: {
      'content-type': 'application/json;charset=UTF-8'
    }
  })
})

// 404 for everything else
router.all('*', () => new Response('404 Not Found...', { status: 200 }))

export default {
  fetch: (request: Request, env: Env, ctx: ExecutionContext) => {
    if (request.method === 'OPTIONS') {
      console.log('got a cors request')
      return new Response(null, {
        status: 200,
        headers: {
          'access-control-allow-origin': '*', //request.headers.get('Origin'),
          'access-control-allow-headers': request.headers.get(
            'Access-Control-Request-Headers'
          )
        }
      })
    }
    return router.handle(request, env, ctx).then(corsify)
  }
}

const DESCRIPTION_FOR_MODEL = `You should use this plugin when people want visualizations.

The plugin takes in a mermaid diagram and renders it returning a link to the rendered image.
The plugin expects a mermaid.js snippet as input.
The snippet that it is passed should use fa v4 icons.
The snippet should only contain the mermaid diagram and NOT the mermaid.js code block using \`\`\`mermaid\`\`\`.

If you think the best diagram to represent the data is a mindmap:
- Limit to 2 outer layers outside the root.

Interpreting the response:
When you get the response it will include an image url, you should render it inline.
`