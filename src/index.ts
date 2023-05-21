import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'
import { KVNamespace, ExecutionContext } from '@cloudflare/workers-types'
import { defineAIPluginManifest } from 'chatgpt-plugin'
import { isValidChatGPTIPAddress } from 'chatgpt-plugin'
import { createCors } from 'itty-cors'

import pkg from '../package.json'
import { MermaidRoute, RenderRoute } from './routes/Mermaid'
import { ShortLinkRoute, debugCreateLink } from './routes/Shorten'
import { logoSvg } from './logo'
import { html as privacyPageHtml } from './privacy-page'

import { sendMixpanelEvent }  from './mixpanel'

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
router.original.get('/.well-known/ai-plugin.json', ManifestRoute);
router.original.get('/logo.svg', (request: Request, env: Env) => {
  console.log('logo')
  const ip = request.headers.get('Cf-Connecting-Ip')

  if (Math.random() < 0.01) {
    sendMixpanelEvent(env.MIXPANEL_TOKEN, 'impression', ip, { ip })
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

How to create a request to the plugin API:
You create the diagram in mermaid syntax based on what user asked and pass it to the plugin API to render.

Important rules when creating the diagram:
- Prefer using graph TB types of diagrams.
- Avoid linear diagrams when possible, diagrams should be hierarchical and have multiple branches when applicable.
- Never use the ampersand (&) symbol in the diagram, it will break the diagram. Use the word "and" instead. For example use "User and Admin" instead of "User & Admin".
- Never use round brackets () in the node identifiers, node labels and edge labels, it will break the diagram. Use a coma instead. For example use "User, Admin" instead of "User (Admin)".
- Don't use empty labels "" for edges, instead don't label the edge at all. For example U["User"] --> A["Admin"].
- Don't add the label if its the same as the destination node.

Rules when using graph diagrams:
- Use short node identifiers, for example U for User or FS for File System.
- Always use double quotes for node labels, for example U["User"].
- Always use double quotes for edge labels, for example U["User"] -- "User enters email" --> V["Verification"].
- Indentation is very important, always indent according to the examples below.

Rules when using graph diagrams with subgraphs:
Never refer to the subgraph root node from within the subgraph itself.

For example this is wrong subgraph usage:
\`\`\`
graph TB
  subgraph M["Microsoft"]
    A["Azure"]
    M -- "Invested in" --> O
  end
  
  subgraph O["AI"]
    C["Chat"]
  end
\`\`\`

In this diagram M is referenced from within the M subgraph, this will break the diagram.
Never reference the subgraph node identifier from within the subgraph itself.
Instead move any edges that connect the subgraph with other nodes or subgraphs outside of the subgraph like so.

Correct subgraph usage:
\`\`\`
graph TB
  subgraph M["Microsoft"]
    A["Azure"]
  end

  M -- "Invested in" --> O
  
  subgraph O["OpenAI"]
    C["ChatGPT"]
  end
\`\`\`

Examples of invoking the plugin API:

User asks: "Show me how vscode internals work."
Your call to the api:
{
  query: "graph TB\\n  U[\\"User\\"] -- \\"File Operations\\" --> FO[\\"File Operations\\"]\\n  U -- \\"Code Editor\\" --> CE[\\"Code Editor\\"]\\n  FO -- \\"Manipulation of Files\\" --> FS[\\"FileSystem\\"]\\n  FS -- \\"Write/Read\\" --> D[\\"Disk\\"]\\n  FS -- \\"Compress/Decompress\\" --> ZL[\\"ZipLib\\"]\\n  FS -- \\"Read\\" --> IP[\\"INIParser\\"]\\n  CE -- \\"Create/Display/Edit\\" --> WV[\\"Webview\\"]\\n  CE -- \\"Language/Code Analysis\\" --> VCA[\\"VSCodeAPI\\"]\\n  VCA -- \\"Talks to\\" --> VE[\\"ValidationEngine\\"]\\n  WV -- \\"Render UI\\" --> HC[\\"HTMLCSS\\"]\\n  VE -- \\"Decorate Errors\\" --> ED[\\"ErrorDecoration\\"]\\n  VE -- \\"Analyze Document\\" --> TD[\\"TextDocument\\"]\\n"
}

User asks: "Draw me a mindmap for beer brewing. Maximum of 4 nodes"
Your call to the api:
{
  query: "graph TB\\n  B[\"Beer\"]\\n  B --> T[\"Types\"]\\n  B --> I[\"Ingredients\"]\\n  B --> BP[\"Brewing Process\"]"
}

User asks:
"Computing backend data services is a distributed system made of multiple microservices.

A web browser sends an HTTP api request to the load balancer.
The load balancer sends the http request to the crossover service.
Crossover talks to redis and mysql database.
Crossover makes a downstream API request to multiplex to submit the query which returns a job id to crossover.
Then crossover makes a long poll API request to evaluator to get the results of the job.
Then evaluator makes an API call to multiplex to check the status of the job.
Once evaluator gets a successful status response from multiplex, then evaluator makes a third API call to result-fetcher service to download the job results from S3 or GCP cloud buckets.
The result is streamed back through evaluator to crossover.

Crossover post processes the result and returns the API response to the client.

Draw me a diagram of this system"

Your call to the api:
{
  query: "graph TB\\n  A[\\"Web Browser\\"] -- \\"HTTP API Request\\" --> B[\\"Load Balancer\\"]\\n  B -- \\"HTTP Request\\" --> C[\\"Crossover\\"]\\n  C -- \\"Talks to\\" --> D[\\"Redis\\"]\\n  C -- \\"Talks to\\" --> E[\\"MySQL\\"]\\n  C -- \\"Downstream API Request\\" --> F[\\"Multiplex\\"]\\n  F -- \\"Returns Job ID\\" --> C\\n  C -- \\"Long Poll API Request\\" --> G[\\"Evaluator\\"]\\n  G -- \\"API Call\\" --> F\\n  G -- \\"API Call\\" --> H[\\"Result-Fetcher\\"]\\n  H -- \\"Downloads Results\\" --> I[\\"S3 or GCP Cloud Buckets\\"]\\n  I -- \\"Results Stream\\" --> G\\n  G -- \\"Results Stream\\" --> C\\n  C -- \\"API Response\\" --> A\\n"
}

Sometimes you will need to revise the same diagram based on user feedback.
For the last example the user might make a followup request:

User followup ask:
"Crossover post processes the result and returns the API response to the client through the load balancer.

Draw the crossover node in green"

Your call to the api:
{
  query: "graph TB\\n  A[\\"Web Browser\\"] -- \\"HTTP API Request\\" --> B[\\"Load Balancer\\"]\\n  B -- \\"HTTP Request\\" --> C[\\"Crossover\\"]\\n  style C fill:#99cc99\\n  C -- \\"Talks to\\" --> D[\\"Redis\\"]\\n  C -- \\"Talks to\\" --> E[\\"MySQL\\"]\\n  C -- \\"Downstream API Request\\" --> F[\\"Multiplex\\"]\\n  F -- \\"Returns Job ID\\" --> C\\n  C -- \\"Long Poll API Request\\" --> G[\\"Evaluator\\"]\\n  G -- \\"API Call\\" --> F\\n  G -- \\"API Call\\" --> H[\\"Result-Fetcher\\"]\\n  H -- \\"Downloads Results\\" --> I[\\"S3 or GCP Cloud Buckets\\"]\\n  I -- \\"Results Stream\\" --> G\\n  G -- \\"Results Stream\\" --> C\\n  C -- \\"API Response\\" --> B\\n  B -- \\"API Response\\" --> A\\n"
}

Interpreting the API response:
- When you get the response it will include an image url, you should render it inline using ![alt text](image) syntax.
- Suggest to the user that they can edit the diagram with followup requests in chat.
- You will also get a link as editDiagramOnline to edit the diagram, you should render it inline using [link text](editDiagramOnline) syntax. Include the whole suggestion to edit the diagram as part of the link. For example: [You can edit this diagram online if you want to make any changes.](editDiagramOnline)
- You should create the response in that order: first the image, then suggestion to edit using works, then the edit link, then the textual explanation.

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
- Don't show the diagram block unless the user asks for it.
`;
