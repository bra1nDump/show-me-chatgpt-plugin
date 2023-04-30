import * as mermaid from 'mermaid'
import * as pako from 'pako'
import { OpenAPIRoute, Query, Str, Enumeration } from '@cloudflare/itty-router-openapi'

import * as types from '../types'
import { omit } from '../utils'
import { saveShortLink } from './Shorten'

function compressAndEncodeBase64(input: string) {
  // Convert the input string to a Uint8Array
  const textEncoder = new TextEncoder()
  const inputUint8Array = textEncoder.encode(input)

  // Compress the Uint8Array using pako's deflate function
  const compressedUint8Array = pako.deflate(inputUint8Array) //, { level: 8 });

  // Encode the compressed Uint8Array to a Base64 string
  const base64Encoded = btoa(
    String.fromCharCode.apply(null, compressedUint8Array)
  )
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  return base64Encoded
}

function encodeBase64(input: string) {
  // Convert the input string to a Uint8Array
  const textEncoder = new TextEncoder()
  const inputUint8Array = textEncoder.encode(input)

  // Encode the compressed Uint8Array to a Base64 string
  const base64Encoded = btoa(String.fromCharCode.apply(null, inputUint8Array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  return base64Encoded
}

export interface Interaction {
  role: string
  content: string
}

export async function getGPTResponse(
  userQuestion: string,
  env: any
): Promise<string> {
  const apiKey = env.OPENAI_KEY as string
  const store = env.CHAT_HISTORY as KVNamespace

  let historyString = await store.get('CHAT_HISTORY')

  let history: Interaction[] = []
  if (
    true || // UNTIL WE HAVE AUTHENTICATION, WE WILL JUST START A NEW CHAT EVERY TIME
    historyString === null ||
    historyString === undefined
  ) {
    console.log("No history, let's start a new one")
    history = [
      {
        role: 'system',
        content: 'system prompt goes here, not used rn'
      }
    ]
  } else {
    // Get old messages
    console.log('Appending to old history')
    history = JSON.parse(historyString)

    history.push({
      role: 'user',
      content: userQuestion
    })
  }

  console.log('history', history)

  const apiUrl = `https://api.openai.com/v1/chat/completions`
  let chatRequest = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: history,
      temperature: 0.7
    })
  })

  const response: any = await chatRequest.json()
  let textReply = response.choices[0].message.content

  // Add to history as assistant
  history.push({
    role: 'assistant',
    content: textReply
  })

  // Save history
  await store.put('CHAT_HISTORY', JSON.stringify(history))

  return textReply
}

export class MermaidRoute extends OpenAPIRoute {
  /// 2. Creates /openapi.json route under the hood. Injects this into gpt prompt to teach about how to use the plugin.
  static schema = {
    tags: ["Diagram", "Mermaid"],
    summary: `Taking in a mermaid graph diagram, renders it and returns a link to the rendered image.`,
    parameters: {
      mermaid: Query(
        new Str({
          description: "Diagram to render",
          example: `graph TB
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
`,
        }),
        {
          required: true,
        }
      ),
    },
    responses: {
      "200": {
        schema: {
          results: [
            {
              image: new Str({
                description: "URL to the rendered image",
              }),
              editDiagramOnline: new Str({
                description:
                  "URL to the editor where the diagram can be edited",
              }),
            },
          ],
        },
      },
    },
  }

  /// 3. Handles the API request
  async handle(request: Request, env: any, _ctx, data: Record<string, any>) {
    const BASE_URL = new URL(request.url).origin
    const timeline = new Timeline();

    console.log(data)
    console.log(request)


    let { diagramLanguage } = data
    let mermaid = new URL(request.url).searchParams.get("mermaid");
    console.log('snippet', mermaid)

    let mermaidNoPluses: string
    // Means we are in gpt-4 mode
    if (mermaid === undefined) {
      const { query } = data
      const queryNoPluses = query.replace(/\+/g, ' ')

      // GPT Plugins encoded spaces as +
      mermaidNoPluses = await getGPTResponse(queryNoPluses, env)
      timeline.finishGPTResponse()
    } else {
      // GPT Plugins encoded spaces as +
      mermaidNoPluses = mermaid.replace(/\+/g, ' ')
    }

    console.log('mermaidNoPluses before styling')
    console.log(mermaidNoPluses)

    // TODO hoist regex to only generate once
    const MERMAID_LINK_PATTERN = /-->/g;
    const linksCount = (mermaidNoPluses.match(MERMAID_LINK_PATTERN) || []).length;
    mermaidNoPluses += '\n';
    for (let i = 0; i  < linksCount; i++) {
      mermaidNoPluses += `  linkStyle ${i} stroke:#2ecd71,stroke-width:2px;\n`;
    }

    console.log('mermaidNoPluses after styling')
    console.log(mermaidNoPluses)

    diagramLanguage = diagramLanguage || 'mermaid'

    let diagramSource = mermaidNoPluses

    let editDiagramOnline = None;
    switch (diagramLanguage) {
      case 'blockdiag':
        break;
      case 'bpmn':
        break;
      case 'bytefield':
        break;
      case 'seqdiag':
        break;
      case 'actdiag':
        break;
      case 'nwdiag':
        break;
      case 'packetdiag':
        break;
      case 'rackdiag':
        break;
      case 'c4-with-plantuml':
        break;
      case 'd2':
        break;
      case 'dbml':
        break;
      case 'ditaa':
        break;
      case 'erd':
        break;
      case 'excalidraw':
        break;
      case 'graphviz':
        break;
      case 'mermaid':
        editDiagramOnline = Some(mermaidEditorLink(diagramSource));
        break;
      case 'nomnoml':
        break;
      case 'pikchr':
        break;
      case 'plantuml':
        break;
      case 'structurizr':
        break;
      case 'svgbob':
        break;
      case 'umlet':
        break;
      case 'vega':
        break;
      case 'vega-lite':
        break;
      case 'wavedrom':
        break;
      case 'wireviz':
        break;
    }


    // TODO: Add graphvis editor https://www.devtoolsdaily.com/graphviz/?#%7B%22dot%22%3A%22digraph%20MessageArchitecture%20%7B%5Cn%20%20messageClient%5Cn%20%20messageQueue%5Bshape%3Drarrow%5D%5Cn%7D%22%7D

    //console.log(
    //  'time page to image: ',
    //  (new Date().getTime() - start.getTime()) / 1000
    //)

    // Does not support mindmaps
    const imageUrl =
       'https://kroki.io/' +
       diagramLanguage +
       '/svg/' +
       compressAndEncodeBase64(diagramSource)

    const slug = await saveShortLink(env.SHORTEN, imageUrl)
    let shortenedURL = `${BASE_URL}/s/${slug}`

    //console.log(
    //  'time save link 1: ',
    //  (new Date().getTime() - start.getTime()) / 1000
    //)

    const editorSlug = await saveShortLink(env.SHORTEN, editDiagramOnline)

    let shortenedEditDiagramURL = `${BASE_URL}/s/${editorSlug}`

    console.log({ shortenedURL })

    //console.log(
    //  'time completed: ',
    //  (new Date().getTime() - start.getTime()) / 1000
    //)

    return new Response(
      JSON.stringify({
        results: [
          {
            image: shortenedURL,
            editDiagramOnline: shortenedEditDiagramURL
          }
        ]
      }),
      {
        headers: {
          'content-type': 'application/json;charset=UTF-8'
        }
      }
    )
  }
}

function mermaidEditorLink(code: string): string {
    const mermaidEditorJson = {
      code,
      mermaid: { theme: 'default' },
      updateEditor: false
    }
    const mermaidEditorJsonString = JSON.stringify(mermaidEditorJson)
    const buffer = encodeBase64(mermaidEditorJsonString)

    return 'https://mermaid.live/edit#' + buffer
}

export function RenderRoute(request: Request, data: Record<string, any>) {
  console.log('\n\nPreview')
  console.log(request.url)
  const searchParams = new URL(request.url).searchParams
  const mermaid = searchParams.get('mermaid')

  const html = `
<!DOCTYPE html>
<html lang="en" style="background: rgb(247, 247, 248)">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OpenGraph Image Example</title>
  <meta property="og:url" content="https://dexa.ai/lex/episodes/doc_358?sectionSid=sec_5319&chunkSid=chunk_9725">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Daniel Negreanu: Poker | Lex Fridman Podcast #324">
  <meta property="og:description" content="undefined">
  <meta property="og:image" content="https://dexa.ai/resources/chunk/image/chunk_9725.png">
  <link rel="stylesheet"
href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

</head>
<script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
  </script>
  <body style="background: rgb(247, 247, 248)">
    <pre class="mermaid" style="width: 100vw">
        ${mermaid.replace(/\+/g, ' ')}
    </pre>
  </body>
  <style>svg {
   max-width: none !important;
   max-height: 100vh !important;
  }</style>
</html>
  `

  return new Response(html, {
    headers: {
      'content-type': 'text/html;charset=UTF-8'
    }
  })
}

class Timeline {
  private start: Date;
  private endOfGPTResponse: Option<Date>;
  constructor() {
    this.start = new Date();
  }

  finishGPTResponse() {
    this.endOfGPTResponse = new Date();
    console.log(
      'time gpt responded: ',
      (this.endOfGPTResponse.getTime() - this.start.getTime()) / 1000
    )
  }

  finish() {

  }
}

type Option<T> = T | null;
const None: Option<any> = null;
function Some<T>(a: T): Option<T> { return a }
