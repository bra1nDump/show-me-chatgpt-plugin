import * as pako from 'pako'
import { OpenAPIRoute, Query, Str } from '@cloudflare/itty-router-openapi'
import { isValidChatGPTIPAddress } from 'chatgpt-plugin'

import * as types from '../types'
import { omit } from '../utils'

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

console.log(compressAndEncodeBase64('digraph G {Hello->World}'))

export class MermaidRoute extends OpenAPIRoute {
  /// 2. Creates /openapi.json route under the hood. Injects this into gpt prompt to teach about how to use the plugin.
  static schema = {
    tags: ['Diagram', 'Mermaid'],
    summary: `Taking in a diagram, renders it and returns a link to the rendered image. Select the diagram language from amongst BlockDiag, BPMN, Bytefield, C4 (with PlantUML), D2, DBML, Ditaa, Erd, Excalidraw, GraphViz, Mermaid, Pikchr, PlantUML, Structurizr, SvgBob, UMLet, Vega, Vega-Lite, WaveDrom`,
    summary: `Taking in a mermaid diagram, renders it and returns a link to the rendered image.`,
    parameters: {
      mermaid: Query(
        new Str({
          description: 'Diagram to render',
          example: `
mindmap
  root((mindmap))
    Origins
      Long history
      ::icon(fa fa-book)
      Popularisation
        British popular psychology author Tony Buzan
    Research
      On effectiveness<br/>and features
      On Automatic creation
        Uses
            Creative techniques
            Strategic planning
            Argument mapping
    Tools
      Pen and paper
      Mermaid
          `
        }),
        {
          required: true
        }
      ),
      diagramLanguage: Query(
        new Str({
          description: 'The language to use to render the diagram',
          example: 'mermaid'
        }),
        {
          required: false
        }
      )
    },
    responses: {
      '200': {
        schema: {
          results: [
            {
              image: new Str({
                description: 'URL to the rendered image',
                example: 'https://placekitten.com/g/200/300'
              }),
              editDiagramOnline: new Str({
                description:
                  'URL to the editor where the diagram can be edited',
                example: 'https://placekitten.com/g/200/300'
              })
            }
          ]
        }
      }
    }
  }

  /// 3. Handles the API request
  async handle(request: Request, env: any, _ctx, data: Record<string, any>) {
    console.log(data)
    let { mermaid, diagramLanguage } = data
    console.log('snippet', mermaid)

    const url = new URL(request.url)
    diagramLanguage = diagramLanguage || 'mermaid'

    const mermaidNoPluses = mermaid.replace(/\+/g, ' ')

    let editDiagramOnline: string | undefined

    if (diagramLanguage === 'mermaid') {
      const mermaidNoHyphenatedWords = processString(mermaidNoPluses)
      // Encode the mermaid diagram to a Base64 string
      const mermaidEditorJson = {
        code: mermaidNoHyphenatedWords,
        mermaid: { theme: 'default' },
        updateEditor: false
      }
      const mermaidEditorJsonString = JSON.stringify(mermaidEditorJson)
      const buffer = encodeBase64(mermaidEditorJsonString)
      editDiagramOnline = 'https://mermaid.live/edit#' + buffer
      console.log('editDiagramOnline', editDiagramOnline)
    }

    // TODO: Add graphvis editor https://www.devtoolsdaily.com/graphviz/?#%7B%22dot%22%3A%22digraph%20MessageArchitecture%20%7B%5Cn%20%20messageClient%5Cn%20%20messageQueue%5Bshape%3Drarrow%5D%5Cn%7D%22%7D

    const imageUrl =
      'https://kroki.io/' +
      diagramLanguage +
      '/svg/' +
      compressAndEncodeBase64(mermaidNoPluses)

    return new Response(
      JSON.stringify({
        results: [
          {
            image: imageUrl,
            editDiagramOnline
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

function processString(input: string): string {
  // Step 1: Replace all '-->' occurrences with the keyword 'ARRRROW'
  const step1 = input.replace(/-->/g, 'ARRRROW')

  // Step 2: Replace all 'fa-some-word-lol' patterns with 'fa__some__word__lol'
  var step2 = String(step1)
  step1.match(/fa-(\S+)/g)?.forEach((match) => {
    const replacement = match.replace(/-/g, '__')
    step2 = step2.replace(match, replacement)
  })
  console.log('step2', step2)

  // Step 3: Replace all '-' with a space
  const step3 = step2.replace(/-/g, ' ')

  // Step 4: Reverse the replacements made in the first 2 steps
  const step4 = step3.replace(/ARRRROW/g, '-->').replace(/__/g, '-')

  return step4
}

/// 3. Generates the rich preview and the page to open diagram in full screen
export function richPreview(request: Request) {
  console.log(request.url)
  const searchParams = new URL(request.url).searchParams
  const mermaid = searchParams.get('mermaid')

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OpenGraph Image Example</title>
  <meta property="og:url" content="https://dexa.ai/lex/episodes/doc_358?sectionSid=sec_5319&chunkSid=chunk_9725">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Daniel Negreanu: Poker | Lex Fridman Podcast #324">
  <meta property="og:description" content="undefined">
  <meta property="og:image" content="https://dexa.ai/resources/chunk/image/chunk_9725.png">
</head>
<script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
  </script>
  <body>
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
      'content-type': 'application/html;charset=UTF-8'
    }
  })
}
