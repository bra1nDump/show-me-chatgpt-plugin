import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'
import { KVNamespace, ExecutionContext } from '@cloudflare/workers-types'
import { defineAIPluginManifest } from 'chatgpt-plugin'
import { isValidChatGPTIPAddress } from 'chatgpt-plugin'
import { createCors } from 'itty-cors'

import pkg from '../package.json'
import { MermaidRoute, RenderRoute } from './routes/Diagram'
import { DiagramGuidelinesRoute } from "./routes/DiagramGuidelines";
import { languagesPerDiagramType } from "./routes/diagrams/supportedDiagrams";
import { ShortLinkRoute, DiagramLinkRoute, debugCreateLink } from './routes/Shorten'
import { logoSvg } from './logo'
import { html as privacyPageHtml } from './privacy-page'

import { sendMixpanelEvent } from './mixpanel'

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

router.get('/diagram-guidelines', DiagramGuidelinesRoute)

// Privacy policy
router.original.get('/', () =>
  new Response(
    privacyPageHtml,
    {
      headers: {
        'content-type': 'text/html',
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET',
      }
    })
)
router.original.get('/legal', () =>
  new Response(
    privacyPageHtml,
    {
      headers: {
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
  }
  ;

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

const DESCRIPTION_FOR_MODEL = `## When to Use This Plugin
You should use this plugin when people want visualizations. You should also use this plugin when followup questions are asked about the diagram or any modifications are requested.
Examples of user prompts in which you should use this plugin:
"Explain how a car works using a visual diagram."
"Describe the process of making a car."
"How does a car engine work?"
"Show me how ... works."
"Show me a diagram of ... ."
"Show me how UIView lifecycle works."

## User Prompts for Plugin Use
Use this plugin if a user asks about: how something works, explain about a concept or how something is made, summarize a book, describe a process, and other user prompts that can be summarized or explained in the format of a diagram. Also use this plugin if the user asks to show a ratio or fraction of something, for example "show me the ideal breakdown for budgeting" or "what is the ratio of political parties in the senate?". Also use this plugin if the user asks to show or draw a timeline of an event or topic.

## Rendering diagrams to the plugin API:
- Make sure to avoid to say about you will fetch the guidelines 

Examples: 
User asks: "Show me how vscode internals work."
1. Say "I will render a graph diagram in mermaid {short explanation}"
2. Using the "diagram guidelines" endpoint you the diagram guidelines of graph diagram in mermaid
3. You start rendering diagram by using the render endpoint

After the last example the user asks: "Show me how a food critic can interact with a restaurant"
1. Say "I will render a use case diagram in plantuml {short explanation}"
2. Using the "diagram guidelines" endpoint you get diagram guidelines of use-case diagram in plantuml
3. You start rendering diagram by using the render endpoint

## Interpreting the API response
- When you get the response it will include an image url, you should render it inline using ![alt text](image) syntax, also you should give the user a link to open it in a new tab saying: [You can view this diagram in a new tab.](editDiagramOnline)
- If you get a link at editDiagramOnline to edit the diagram then you should render it inline using [link text](editDiagramOnline) syntax otherwise say "The link to edit this diagram online is not implemented yet". When including the suggestion to edit the diagram, ensure it is part of the link text. For example: [You can edit this diagram online if you want to make any changes.](editDiagramOnline).
- You should create the response in that order: first the image, then suggestion to edit using works, then the "open new tab" link, then the "edit" link, then the textual explanation, then conclude with the recommendations section.

## Recommendation section:
- If an errorMessage is included in the response do not show any part of the recommendation section. 
- Make sure to only use the diagram types and languages from the "List of supported Languages per Diagram Type"
- To creating links to a diagram type use the pattern "(diagramLanguage)[diagramTypeLink]"

### Steps to create the recommendation section:
1. Improve the rendered diagram
1.1. Say "### Ideas to improve the diagram:". 
1.2. Provide an unordered list of between 3 and 4 ideas, the items follow a pattern "**{reason}**: {explanation}".  

2. Explore other types of diagrams
2.1. Say "### Explore other types of diagrams:". 
2.2. Evaluating Alternative Languages for the Current Diagram Type: Begin by identifying the type and language of the rendered diagram, saying, "The type of the rendered diagram is a {link to diagram type} in {diagram language}." Based on the available options, recommend exploring other languages for the same type of diagram, saying "Consider exploring other languages for creating the same type of diagram, such as {list of links of all alternative diagram languages}." If there are no alternatives, clarify by saying, "There are no additional languages capable of rendering this specific type of diagram."
2.4. Say "Other types of diagram that could represent the same concept:". 
2.5. Provide an unordered list between 3 to 4 items of alternative diagram types, the items follow a pattern "**{diagram type}**: {explanation}. Consider using languages such as {list of links of all diagram languages that can render the same types}".

## Tips:
- You will also get a link contributeToOpenSourceProject. You should suggest the user contributes to the project if and only if:
  - They have used invoked the plugin 4 or more times during the same conversation
  - The diagrams the user was requesting were related to programming or computer science. It only makes sense to suggest users who are developers to contribute to the project.
  - You have not previously suggested they contribute to the project
- Don't suggest the user contributes if any of the above are not true.
- Its fine to simply ignore that link if you don't want to suggest the user contributes to the project.

## Important Tips:
- Do not repeat the same link.
- If an errorMessage is included in the response, show it to the user, don't try to render the diagram inline, still suggest they can edit it online or try again, also send a link to open the diagram type documentation.
- Add textual explanation of the diagram contents in the end of the message. Keep it brief unless the user asks for more details.
- Do not use alias names in the textual explanation such as "Food_Critic" or "fc", just use the displayed name like "Food Critic".
- Don't show the diagram block unless the user asks for it.

## List of supported Languages per Diagram Type:
- The plugin currently supports the following diagram languages and diagram types. Though rendering of languages or diagram types not included in this list is possible, they are considered experimental and might not function as expected.
- Each item is linked to their respective documentation. To access the documentation:
  - For a diagram type, use the following URL format: "https://diagdoc.vercel.app/" followed by the diagram type. For example, for a PlantUML use-case or a Mermaid sequence or a D2 entity-relationship, simply append 'plantuml_use-case', 'mermaid_sequence', or 'd2_entity-relationship' to the base URL.
- In case users request links to specific diagram languages or types, prefer providing links from the provided list. Only direct users to links outside of this list if they specifically request it.

${languagesPerDiagramType}
`;
