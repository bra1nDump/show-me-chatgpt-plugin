import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'
import { KVNamespace, ExecutionContext } from '@cloudflare/workers-types'
import { defineAIPluginManifest } from 'chatgpt-plugin'
import { isValidChatGPTIPAddress } from 'chatgpt-plugin'
import { createCors } from 'itty-cors'

import pkg from '../package.json'
import { MermaidRoute, RenderRoute } from './routes/Diagram'
import { GuidelinesRoute } from "./routes/Guidelines";
import { ShortLinkRoute, DiagramLinkRoute, debugCreateLink } from './routes/Shorten'
import { logoSvg } from './logo'
import { html as privacyPageHtml } from './privacy-page'

import { sendMixpanelEvent }  from './mixpanel'
import { diagramLanguagesAndTypes } from "./routes/diagrams/utils";

export interface Env {
  SHORTEN: KVNamespace
  CHAT_HISTORY: KVNamespace
  OPENAI_KEY: string
  WORKER_ENV: 'production' | 'local'
  MIXPANEL_TOKEN: string
}

const router = OpenAPIRouter({
  schema: {
    info: {
      title: "Show Me",
      version: pkg.version
    }
  }
})

const { preflight, corsify } = createCors({ origins: ['*'] })
router.all('*', preflight)

// 2. Expose magic openapi.json, expose API itself
router.get('/render', MermaidRoute)

router.get('/get-guidelines', GuidelinesRoute)

// Privacy policy
router.original.get('/', () =>
  new Response(
    privacyPageHtml,
    { headers: {
      'content-type': 'text/html',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET',
    }
  })
)
router.original.get('/legal', () =>
  new Response(
    privacyPageHtml,
    { headers: {
      'content-type': 'text/html',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET',
    }
  })
)

router.original.get('/s/:id', ShortLinkRoute)
router.original.get('/d/:id', DiagramLinkRoute)
router.original.get('/.well-known/ai-plugin.json', ManifestRoute);
router.original.get('/logo.svg', (request: Request, env: Env) => {
  console.log('logo')
  const ip = request.headers.get('Cf-Connecting-Ip') as string

  if (Math.random() < 0.01) {
    void sendMixpanelEvent(env.MIXPANEL_TOKEN, 'impression', ip, { ip })
  };

  return new Response(logoSvg, {
    headers: {
      'content-type': 'image/svg+xml',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET',
    }
  });
})

function ManifestRoute(request: Request): Response {
  const url = new URL(request.url)
  const host = request.headers.get('host')
  const openAPIUrl = `${url.protocol}//${host}/openapi.json`
  const legalUrl = `${url.protocol}//${host}/legal`
  const logoUrl = `${url.protocol}//${host}/logo.svg`

  const pluginManifest = defineAIPluginManifest(
    {
      description_for_human:
        'Create and edit diagrams directly in chat.',
      name_for_human: 'Show Me Diagrams',
      logo_url: logoUrl,
      contact_email: 'kirill2003de@gmail.com',
      legal_info_url: legalUrl,
      description_for_model: DESCRIPTION_FOR_MODEL
    },
    { openAPIUrl }
  )
  return new Response(JSON.stringify(pluginManifest, null, 2), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET',
    }
  })
}

// 404 for everything else
router.all('*', () => new Response('404 Not Found...', { status: 200 }))

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const ip = request.headers.get('Cf-Connecting-Ip')
    // if (!ip) {
    //   console.warn('search error missing IP address')
    //   return new Response('invalid source IP', { status: 500 })
    // }
    // if (env.WORKER_ENV !== 'local') {
    //   if (!isValidChatGPTIPAddress(ip)) {
    //     console.warn('search error invalid IP address', ip)
    //     return new Response(`Forbidden`, { status: 403 })
    //   }
    // }

    console.log('request', request.url)

    if (request.method === 'OPTIONS') {
      return preflight(request);
    }

    return router.handle(request, env, ctx).then(corsify)
  }
}

const DESCRIPTION_FOR_MODEL = `You should use this plugin when people want visualizations. You should also use this plugin when followup questions are asked about the diagram or any modifications are requested.
Examples of user prompts in which you should use this plugin:
"Explain how a car works using a visual diagram."
"Describe the process of making a car."
"How does a car engine work?"
"Show me how ... works."
"Show me a diagram of ... ."
"Show me how UIView lifecycle works."

Use this plugin if a user asks about: how something works, explain about a concept or how something is made, summarize a book, describe a process, and other user prompts that can be summarized or explained in the format of a mindmap or a state diagram. Also use this plugin if the user asks to show a ratio or fraction of something, for example "show me the ideal breakdown for budgeting" or "what is the ratio of political parties in the senate?". Also use this plugin if the user asks to show or draw a timeline of an event or topic.

Before rendering diagrams to the plugin API:
If there are established guidelines for the diagram you are about to create, make sure to request them. Otherwise, refrain from requesting them.

Rendering diagrams to the plugin API:
If an guidelines is included in the response from the guidelines endpoint, make sure to follow them.
Examples: 
User asks: "Show me how vscode internals work."
You request guidelines: graph_mermaid
You follow guidelines and start rendering diagram

User asks: "Show me a mindmap about a mindmap"
You request guidelines: mindmap_mermaid
You follow guidelines and start rendering diagram

Interpreting the API response:
- When you get the response it will include an image url, you should render it inline using ![alt text](image) syntax.
- If you get a link at editDiagramOnline to edit the diagram then you should render it inline using [link text](editDiagramOnline) syntax otherwise say "Please note that the link to edit this diagram online is not implemented yet". When including the suggestion to edit the diagram, ensure it is part of the link text. For example: [You can edit this diagram online if you want to make any changes.](editDiagramOnline).
- You should create the response in that order: first the image, then suggestion to edit using works, then the edit link, then the textual explanation, then conclude with the recommendations section.

Recommendation section:
The section has two parts: suggestions to improve the rendered diagram and explore other types of diagrams. If an errorMessage is included in the response do not show the recommendation section

1. Improve the rendered diagram
First, introduce the section with the message like "Here are ways to improve the diagram to provide more detail or clarity:". Second, provide a unordered list of between 3 and 4 suggestions, the items follows a pattern "{reason}: {explanation}".  

2. Explore other types of diagrams
First, introduce the section with the message like "Here are some other types of diagrams that could be used to render the same concept:". Second, provide a unordered list of alternative diagram types that could be used to render the same concept. List between 1 to 3 items using a pattern "type: A {type} diagram can help you {explanation}, Consider language 1, language 2, etc.". The first line must match the same type of the latest rendered diagram. For example: if the latest rendered diagram is Use Case in PlantUML then the first recommendation item must be "Use Case: [diagram types without PlantUML because it is already rendered]".

Tips:
- You will also get a link contributeToOpenSourceProject. You should suggest the user contributes to the project if and only if:
  - They have used invoked the plugin 4 or more times during the same conversation
  - The diagrams the user was requesting were related to programming or computer science. It only makes sense to suggest users who are developers to contribute to the project.
  - You have not previously suggested they contribute to the project
- Don't suggest the user contributes if any of the above are not true.
- Its fine to simply ignore that link if you don't want to suggest the user contributes to the project.

Important Tips:
- Do not repeat the same link.
- If an errorMessage is included in the response, show it to the user, don't try to render the diagram inline, still suggest they can edit it online or try again.
- Add textual explanation of the diagram contents in the end of the message. Keep it brief unless the user asks for more details.
- Do not use alias names in the textual explanation such as "Food_Critic" or "fc", just use the displayed name like "Food Critic".
- Don't show the diagram block unless the user asks for it.

Supported diagram types and languages:
- When the user generates additional diagram types not listed in this table, it is important to inform them that it may be possible to create them. However, please note that since these have not undergone testing, they should be considered experimental

Table: 
${(diagramLanguagesAndTypes.map(item => item.join(": "))).join("\n")}
`;
