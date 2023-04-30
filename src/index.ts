import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'
import { KVNamespace, ExecutionContext } from '@cloudflare/workers-types'
import { defineAIPluginManifest } from 'chatgpt-plugin'
import { isValidChatGPTIPAddress } from 'chatgpt-plugin'
import { createCors } from 'itty-cors'

import pkg from '../package.json'
import { MermaidRoute, RenderRoute } from './routes/Mermaid'
import { ShortLinkRoute, debugCreateLink } from './routes/Shorten'

export interface Env {
  SHORTEN: KVNamespace
  CHAT_HISTORY: KVNamespace
  OPENAI_KEY: string
  WORKER_ENV: 'production' | 'local'
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

//router.get('/render', RenderRoute)

//router.post('/debug/links', debugCreateLink)
router.original.get('/s/:id', ShortLinkRoute)
router.original.get('/.well-known/ai-plugin.json', ManifestRoute);

function ManifestRoute(request: Request): Response {
  const url = new URL(request.url)
  const host = request.headers.get('host')
  const openAPIUrl = `${url.protocol}//${host}/openapi.json`
  const legalUrl = `${url.protocol}//${host}/legal`

  const pluginManifest = defineAIPluginManifest(
    {
      description_for_human:
        'Render any Diagram using Mermaid, GraphViz, and many more.',
      name_for_human: 'Show Me',
      logo_url:
        'https://res.cloudinary.com/deepwave-org/image/upload/v1681620862/Heye.earth/Projects/PinClipart.com_venn-diagram-clipart_5480153_hk80cf.png',
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
  fetch: (request: Request, env: Env, ctx: ExecutionContext) => {
    const ip = request.headers.get('Cf-Connecting-Ip')
    if (!ip) {
      console.warn('search error missing IP address')
      return new Response('invalid source IP', { status: 500 })
    }
    if (env.WORKER_ENV !== 'local') {
      if (!isValidChatGPTIPAddress(ip)) {
        console.warn('search error invalid IP address', ip)
        return new Response(`Forbidden`, { status: 403 })
      }
    }

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
- Always use graph TB types of diagrams.
- Avoid linear diagrams when possible, diagrams should be hierarchical and have multiple branches when applicable.
- Never use the ampersand (&) symbol in the diagram, it will break the diagram. Use the word "and" instead. For example use "User and Admin" instead of "User & Admin".
- Use short node identifiers, for example U for User or FS for File System.
- Always use double quotes for node labels, for example U["User"].
- Always use double quotes for edge labels, for example U["User"] -- "User enters email" --> V["Verification"].
- Indentation is very important, always indent according to the examples below.

Examples.

User asks: "Show me how vscode internals work."
Your call to the api:
{
  query: 
  "graph TB
    U[\\"User\\"] -- \\"File Operations\\" --> FO[\\"File Operations\\"]
    U -- \\"Code Editor\\" --> CE[\\"Code Editor\\"]
    FO -- \\"Manipulation of Files\\" --> FS[\\"FileSystem\\"]
    FS -- \\"Write/Read\\" --> D[\\"Disk\\"]
    FS -- \\"Compress/Decompress\\" --> ZL[\\"ZipLib\\"]
    FS -- \\"Read\\" --> IP[\\"INIParser\\"]
    CE -- \\"Create/Display/Edit\\" --> WV[\\"Webview\\"]
    CE -- \\"Language/Code Analysis\\" --> VCA[\\"VSCodeAPI\\"]
    VCA -- \\"Talks to\\" --> VE[\\"ValidationEngine\\"]
    WV -- \\"Render UI\\" --> HC[\\"HTMLCSS\\"]
    VE -- \\"Decorate Errors\\" --> ED[\\"ErrorDecoration\\"]
    VE -- \\"Analyze Document\\" --> TD[\\"TextDocument\\"]
  "
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
  query:
  "graph TB
    A[\\"Web Browser\\"] -- \\"HTTP API Request\\" --> B[\\"Load Balancer\\"]
    B -- \\"HTTP Request\\" --> C[\\"Crossover\\"]
    C -- \\"Talks to\\" --> D[\\"Redis\\"]
    C -- \\"Talks to\\" --> E[\\"MySQL\\"]
    C -- \\"Downstream API Request\\" --> F[\\"Multiplex\\"]
    F -- \\"Returns Job ID\\" --> C
    C -- \\"Long Poll API Request\\" --> G[\\"Evaluator\\"]
    G -- \\"API Call\\" --> F
    G -- \\"API Call\\" --> H[\\"Result-Fetcher\\"]
    H -- \\"Downloads Results\\" --> I[\\"S3 or GCP Cloud Buckets\\"]
    I -- \\"Results Stream\\" --> G
    G -- \\"Results Stream\\" --> C
    C -- \\"API Response\\" --> A
  "
}

Sometimes you will need to revise the same diagram based on user feedback.
For the last example the user might make a followup request:

User followup ask:
"Crossover post processes the result and returns the API response to the client through the load balancer.

Draw the crossover node in green"

Your call to the api:
{
  query:
  "graph TB
    A[\\"Web Browser\\"] -- \\"HTTP API Request\\" --> B[\\"Load Balancer\\"]
    B -- \\"HTTP Request\\" --> C[\\"Crossover\\"]
    style C fill:#99cc99
    C -- \\"Talks to\\" --> D[\\"Redis\\"]
    C -- \\"Talks to\\" --> E[\\"MySQL\\"]
    C -- \\"Downstream API Request\\" --> F[\\"Multiplex\\"]
    F -- \\"Returns Job ID\\" --> C
    C -- \\"Long Poll API Request\\" --> G[\\"Evaluator\\"]
    G -- \\"API Call\\" --> F
    G -- \\"API Call\\" --> H[\\"Result-Fetcher\\"]
    H -- \\"Downloads Results\\" --> I[\\"S3 or GCP Cloud Buckets\\"]
    I -- \\"Results Stream\\" --> G
    G -- \\"Results Stream\\" --> C
    C -- \\"API Response\\" --> B
    B -- \\"API Response\\" --> A
  "
}

Interpreting the API response:
When you get the response it will include an image url, you should render it inline using ![alt text](image) syntax.
You will also get a link as editDiagramOnline to edit the diagram, you should render it inline using [link text](url) syntax.
Include the links only once, do not repeat the same link.
`;
