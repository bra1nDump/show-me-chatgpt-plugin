import { OpenAPIRoute, Query, Str } from '@cloudflare/itty-router-openapi'
import { isValidChatGPTIPAddress } from 'chatgpt-plugin'
import * as pako from 'pako'

import * as types from '../types'
import { omit } from '../utils'

function compressAndEncodeBase64(input: string) {
  // Convert the input string to a Uint8Array
  const textEncoder = new TextEncoder();
  const inputUint8Array = textEncoder.encode(input);

  // Compress the Uint8Array using pako's deflate function
  const compressedUint8Array = pako.deflate(inputUint8Array)//, { level: 8 });

  // Encode the compressed Uint8Array to a Base64 string
  const base64Encoded = btoa(String.fromCharCode.apply(null, compressedUint8Array)).replace(/\+/g, '-').replace(/\//g, '_')

  return base64Encoded;
}

console.log(compressAndEncodeBase64('digraph G {Hello->World}'));


export class MermaidRoute extends OpenAPIRoute {
  /// 2. Creates /openapi.json route under the hood. Injects this into gpt prompt to teach about how to use the plugin.
  static schema = {
    tags: ['dexa'],
    summary: `Taking in a mermaid diagram, renders it and returns a link to the rendered image.`,
    parameters: {
      mermaid: Query(
        new Str({
          description: 'Mermaid diagram to render',
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
              previewUrl: new Str({
                description:
                  'URL with a mermaid diagram that can be used to visualize the conversation',
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
    console.log('handling MermaidRoute', data)
    let { mermaid } = data
    mermaid = mermaid.replace(/\+/g, ' ')

    const url = new URL(request.url)
    
    // eNpLyUwvSizIUHBXqPZIzcnJ17ULzy_KSanlAgB1EAjQ
    // eNpLyUwvSizIUHBXqPZIzcnJ17ULzy/KSakFAGxACMY=
    //
    //const imageUrl = 'https://kroki.io/graphviz/svg/eJxLyUwvSizIUHBXqPZIzcnJ17ULzy/KSakFAGxACMY=';
    const imageUrl = 'https://kroki.io/mermaid/svg/' + compressAndEncodeBase64(mermaid)
    //try {
    //  const response = await fetch('https://kroki.io/mermaid/svg', {
    //    headers: {
    //      'Accept': 'image/svg+xml',
    //      'Context-Type': 'text/plain',
    //    },
    //    method: 'POST',
    //    body: mermaid
    //  }
    //  );
    //}

    //const imageGen = encodeURIComponent(`${url.href}/render?mermaid=` + mermaid)
    //console.log("trying to get an image");
    //let jsonResponse: any;
    //try {
    //  const downstreamURL =  `https://v2.convertapi.com/convert/web/to/jpg?Secret=VrvzgfsXZmsQy80d&Url=${imageGen}&StoreFile=true&ConversionDelay=2`;
    //  console.log(downstreamURL);
    //  const apiResponse = await fetch(downstreamURL)
    //  if (apiResponse.status !== 200) {
    //    console.log("did not get a good response", apiResponse);
    //  }
    //  jsonResponse = await apiResponse.json()
    //} catch (err) {
    //  console.log("got an error, falling back")
    //  jsonResponse.Files = [ {Url: 'https://placekitten.com/200/200'} ];
    //}
    //console.log("got an JSON response")

    // Get the URL from the API response
    //const imageUrl = jsonResponse.Files[0].Url
    return new Response(
      JSON.stringify({
        results: [
          {
            image: imageUrl,
            previewUrl: 'https://example.com'
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

// TODO make this work
//    mermaid = 'digraph G {Hello->World}'
//    const buffer = new TextEncoder().encode(mermaid)
//    console.log("going back", new TextDecoder().decode(buffer));
//    //const buffer = Buffer.from(mermaid);
//    console.log("orginal buffer", buffer);
//    const compressed = pako.deflate(buffer)//, { raw: true })
//    //const compressed = zlib.deflate(buffer);
//    console.log("compressed", compressed)
//    console.log("compressed form", btoa(compressed))
//    const result = btoa(compressed).replace(/\+/g, '-').replace(/\//g, '_')
//
//    const raw = atob(result.replace(/\-/g, '+').replace(/_/g, '/'));
//    console.log("decoded raw to", raw);
//    
//  
//    
//
//    const expect = 'eJxLyUwvSizIUHBXqPZIzcnJ17ULzy_KSakFAGxACMY=';
//    console.log({result, expect});
//
//    const imageUrl = 'https://kroki.io/graphviz/svg/eNpLyUwvSizIUHBXqPZIzcnJ17ULzy_KSanlAgB1EAjQ';
//    //const imageUrl = 'https://kroki.io/mermaid/svg/' + result;
//    //const imageUrl = 'https://kroki.io/graphviz/svg/' + result;
//    console.log(imageUrl)
