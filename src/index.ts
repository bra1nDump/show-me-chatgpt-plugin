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

import { createTrackerForRequest, sendMixpanelEvent }  from './mixpanel'
import { JoinWorkTogetherEmailRoute } from './routes/CollectEmail'

export interface Env {
  SHORTEN: KVNamespace
  CHAT_HISTORY: KVNamespace
  OPENAI_KEY: string
  WORKER_ENV: 'production' | 'local'
  MIXPANEL_TOKEN: string

  MAILCHIMP_API_KEY: string
  MAILCHIMP_LIST_ID: string
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

router.original.post('/join-work-together-email', JoinWorkTogetherEmailRoute)

router.original.get('/.well-known/ai-plugin.json', ManifestRoute);
router.original.get('/logo.svg', (request: Request, env: Env) => {
  console.log('logo')

  if (Math.random() < 0.01) {
    const track = createTrackerForRequest(request, env)
    track('impression', {})
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
    console.log('request', request.url)

    if (request.method === 'OPTIONS') {
      return preflight(request);
    }

    // Sample the event - log 1% of requests
    if (request.url.endsWith('openapi.json')
      && Math.random() < 0.01) {
      const track = createTrackerForRequest(request, env)
      track('openapi_fetched', {})
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
Use this plugin if a user asks about: how something works, explain about a concept or how something is made, summarize a book, describe a process, and another user prompt that can be summarized or explained in the format of a diagram. Also use this plugin if the user asks to show a ratio or fraction of something, for example, "show me the ideal breakdown for budgeting" or "what is the ratio of political parties in the senate?". Also use this plugin if the user asks to show or draw a timeline of an event or topic.

## Steps to request to the endpoints
This section is about before requesting to the endpoints and requesting them, follow these steps:

1. Start by identifying the diagram type and language from the user's request. If the user's request includes a specific diagram type such as "mindmap", "graph", "sequence", etc., ensure to acknowledge this in your response. Use the pattern "{keywords: "I will render", "{diagram type} diagram in {diagram language} language"}. For example, if a user says "show me a mindmap about a mindmap", respond with "I will render a mindmap diagram in {chosen language} language". This step is mandatory and should be the first thing you say. Do not add any additional information at this point.
2. Proceed to request the guidelines endpoint.
3. Finally, request the render endpoint.

Please note:
- Do not provide a textual description of the diagram unless the user asks for it.
- Do not provide the diagram source code unless the user asks for it.

## Interpreting the API response
This section comes after receiving the api response, follow these steps in order:

1. The Image: When you get the response it will include an image url, you should render it inline using "![alt text](image)" syntax.
2. Link to open a new tab: Say "[You can view this diagram in a new tab.](image)".
3. Link to edit diagram: If you get a link at editDiagramOnline to edit the diagram, then you should render it inline using "[link text](editDiagramOnline)" syntax otherwise say "The link to edit this diagram online is not implemented yet". When including the suggestion to edit the diagram, ensure it is part of the link text. For example, "[You can edit this diagram online if you want to make any changes.](editDiagramOnline)". 
4. Diagram code (if applicable): If the diagram language is D2, DBML, Svgbob, or WaveDrom, Say: \`When using {diagram language} language, the edit link doesn't automatically load the diagram code. However, you can get the code by using the key phrase "show diagram code"\`.
5. Link to diagram documentation: Say "The type of the diagram is a {diagram type} in {diagram language} language"
6. Say ideas to improve the diagram: Say \`To view ideas for improving the diagram, use the key phrase "show ideas"\`
7. Say explore more types of diagrams: Say \`To view other types of diagram and languages, use the key phrase "explore diagrams"\`

Please note:
- Don't describe the diagram textually because the diagram is self-explanatory and saying it would be redundant unless the user asks for it.

## Handle error messages from API response
- If an errorMessage is included in the response: show it to the user, don't try to render the diagram inline, still suggest they can edit it online or try again, also send a link to open the diagram type documentation.
- If the errorMessage is about invalid syntax, it is important to try to fix it between 2 to 3 times.

## Ideas to improve the diagram
1. Say "**Ideas to improve the diagram:**". 
2. Provide an unordered list of between 2 and 3 ideas, the items follow a pattern "**{reason}**: {explanation}".  

Please note:
- Only say it when the user asks for it by using their respective key phrase "show ideas"

## Explore more types of diagrams and languages
1. Say "**Explore languages for the same diagram type:**". 
2. Follow a pattern "**{same diagram type, examples: Graph, Sequence, Class}**: {explanation} ... {keywords: "you can explore"} {list of links of all diagram languages that can render the diagram type}". It should contain only 1 item on the list.
3. Say "**Explore other types of diagram:**". 
4. Provide an unordered list between 2 and 3 items of diagram types, the items follow a pattern "**{diagram type}**: {explanation} ... {keywords: "you can explore"} {list of links of all diagram languages that can render the same diagram type}"

Please note:
- Only say it when the user asks for it by using their respective key phrase "explore diagrams"
- When listing the links do not use an ordered list nor unordered list, just separate them with commas
- When creating the links avoid saying the diagram type like "PlantUML graph, Mermaid graph, D2" because it would be redundant, just keep them like "PlantUML, Mermaid, D2"

## Tips:
- You will also get a link contributeToOpenSourceProject. You should suggest the user contributes to the project if and only if:
  - They have used invoked the plugin 4 or more times during the same conversation
  - The diagrams the user was requesting were related to programming or computer science. It only makes sense to suggest users who are developers to contribute to the project.
  - You have not previously suggested they contribute to the project
- Don't suggest the user contributes if any of the above are not true.
- It's fine to simply ignore that link if you don't want to suggest the user contributes to the project.

## Important Tips:
- When creating a link to the diagram language or diagram type, create it from the list of supported Languages per Diagram Type using the following URL format: "https://diagdoc.vercel.app/" followed by the diagram language and type. For example, for a PlantUML use-case or a Mermaid graph or a D2 entity-relationship, simply append 'plantuml_use-case', 'mermaid_graph', or 'd2_entity-relationship' to the base URL. Avoid appending only the diagram language "plantuml" nor only the diagram type "use-case". Avoid linking to other sites unless the user asks for it.
- It is very important that when the user does not specify a diagram language nor diagram type you must always choose to render a graph diagram in mermaid language.

## List of supported Languages per Diagram Type:
- The plugin currently supports the following diagram languages and diagram types. Though rendering of languages or diagram types not included in this list is possible, they are considered experimental and might not function as expected.
${languagesPerDiagramType}
`;
