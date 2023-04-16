import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'
import { KVNamespace } from '@cloudflare/workers-types'
import { defineAIPluginManifest } from 'chatgpt-plugin'
import { createCors } from 'itty-cors'

import pkg from '../package.json'
import { MermaidRoute } from './routes/Mermaid'
import { ShortLinkRoute, debugCreateLink } from './routes/Shorten'

export interface Env {
  SHORTEN: KVNamespace
  CHAT_HISTORY: KVNamespace
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

// 2. Expose magic openapi.json, expose API itself
router.get('/', MermaidRoute)

router.post('/debug/links', debugCreateLink)
router.get('/s/:id', ShortLinkRoute)

// 1. Define the plugin manifest
router.get('/.well-known/ai-plugin.json', (request: Request) => {
  const url = new URL(request.url)
  const host = request.headers.get('host')
  const openAPIUrl = `${url.protocol}//${host}/openapi.json`

  const pluginManifest = defineAIPluginManifest(
    {
      description_for_human:
        'Render any Diagram using Mermaid, GraphViz, and many more.',
      name_for_human: 'Diagram',
      logo_url:
        'https://res.cloudinary.com/deepwave-org/image/upload/v1681620862/Heye.earth/Projects/PinClipart.com_venn-diagram-clipart_5480153_hk80cf.png',
      contact_email: 'kirill2003de@gmail.com',
      legal_info_url: 'https://example.com',
      description_for_model: DESCRIPTION_FOR_MODEL
    },
    { openAPIUrl }
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
  fetch: (request: Request, env: Env, ctx: ExecutionContext) => {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-headers': request.headers.get(
            'Access-Control-Request-Headers'
          )
        }
      })
    }
    return router.handle(request, env, ctx).then(corsify)
  }
}

const DESCRIPTION_FOR_MODEL = `
You should use this plugin when people want visualizations. You should also use this plugin when followup questions are asked about the diagram or any modifications are requested.
Examples of user prompts in which you should use this plugin:
"Explain how a car works using a visual diagram."
"Describe the process of making a car."
"How does a car engine work?" 

Use this plugin if a user asks about: how something works, explain about a concept or how something is made, summarize a book, describe a process, and other user prompts that can be summarized or explained in the format of a mindmap or a state diagram. Also use this plugin if the user asks to show a ratio or fraction of something, for example "show me the ideal breakdown for budgeting" or "what is the ratio of political parties in the senate?". Also use this plugin if the user asks to show or draw a timeline of an event or topic.

How to create a request to the plugin API:
Pass the user prompt as a query parameter to the reqeust.

Example requests:
{
  query: "Explain how a car works using a visual diagram."
}
{
  query: "How does the US government work?"
}
{
  query: "Show me how a pen is structured."
}
{
  query: "Add more nodes to the diagram."
}
{
  query: "Change the diagram type to a state diagram."
}


Interpreting the API response:
When you get the response it will include an image url, you should render it inline using ![alt text](image) syntax.
You will also get a link as editDiagramOnline to edit the diagram, you should render it inline using [link text](url) syntax.
Include the links only once, do not repeat the same link.
`

const DESCRIPTION_FOR_MODEL_LONGER = `
You should use this plugin when people want visualizations.
Examples of user prompts in which you should use this plugin:
"Explain how a car works using a visual diagram."
"Describe the process of making a car."
"How does a car engine work?" 
The plugin api takes in a mermaid code snippet and renders it returning a link to the rendered image, and a link to edit the diagram online.

Use this plugin if a user asks about: how something works, explain about a concept or how something is made, summarize a book, describe a process, and other user prompts that can be summarized or explained in the format of a mindmap or a state diagram. Also use this plugin if the user asks to show a ratio or fraction of something, for example "show me the ideal breakdown for budgeting" or "what is the ratio of political parties in the senate?". Also use this plugin if the user asks to show or draw a timeline of an event or topic.

The plugin takes in a mermaid diagram and renders it returning a link to the rendered image.
The plugin expects a mermaid.js snippet as input.
The snippet that it is passed should use fa v4 icons.
The snippet should only contain the mermaid diagram and NOT the mermaid.js code block using \`\`\`mermaid\`\`\`.

If you think the best diagram to represent the data is a mindmap:
- Limit to 2 outer layers outside the root.

How to create the API request to the plugin:
- The plugin expects a mermaid.js snippet as mermaid parameter
- It should be properly indentend, otherwise it will break

Interpreting the API response:
When you get the response it will include an image url, you should render it inline.
You will also get a link as editDiagramOnline to edit the diagram, you should render it inline.
You should not print the mermaid snippet in the response.
You should keep your textual explanation short - the diagram is the main focus of the response.
`
