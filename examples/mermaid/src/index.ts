import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'
import { defineAIPluginManifest } from 'chatgpt-plugin'
import { createCors } from 'itty-cors';

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

const { preflight, corsify } = createCors({ origins: ['*'] });
router.all('*', preflight)

// 1. Define the plugin manifest
router.get('/', routes.Mermaid)
//router.get('/preview.html', routes.previewHandle)

router.get('/.well-known/ai-plugin.json', (request: Request) => {
  const host = request.headers.get('host')
  const openAPIUrl = `http://${host}/openapi.json`;
  console.log("using manifest", openAPIUrl);
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
    { openAPIUrl }
   // { openAPIUrl: `http://127.0.0.1:35243/openapi.json` }
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
    const host = request.headers.get('host')
    console.log("================= host", host);
    if (request.method === 'OPTIONS') {
      console.log("we got a cors request");
      return new Response(null, {
        status: 200,
        headers: {
          'access-control-allow-origin': '*', 
        } 
      });
    } 
    console.log("we got other cors request", request.method);
    return router.handle(request, env, ctx).then(corsify);
  }
}
