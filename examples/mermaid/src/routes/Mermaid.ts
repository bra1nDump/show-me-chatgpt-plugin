import * as pako from 'pako'
import { OpenAPIRoute, Query, Str } from '@cloudflare/itty-router-openapi'
import { isValidChatGPTIPAddress } from 'chatgpt-plugin'

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
  apiKey: string
): Promise<string> {
  const apiUrl = `https://api.openai.com/v1/chat/completions`

  // TODO: Dominic suggests savings :D
  // return "Good to hear bro";

  // get env OPENAI_KEY, from .env

  let chatRequest = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemPrompt(userQuestion)
        }
      ],
      temperature: 0.7
    })
  })

  const response = await chatRequest.json()
  let textReply = response.choices[0].message.content

  return textReply
}

console.log(compressAndEncodeBase64('digraph G {Hello->World}'))

export class MermaidRoute extends OpenAPIRoute {
  /// 2. Creates /openapi.json route under the hood. Injects this into gpt prompt to teach about how to use the plugin.
  static schema = {
    tags: ['Diagram', 'Mermaid'],
    summary: `The API takes in a request to learn something, returns a link to an image of the diagram and a link to edit the diagram online.`,
    parameters: {
      query: Query(
        new Str({
          description:
            "A textual request to learn about something, usaully the user's prompt",
          example: `Explain how the US government works`
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
                description: 'URL to the rendered image'
              }),
              editDiagramOnline: new Str({
                description: 'URL to the editor where the diagram can be edited'
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

    let mermaidNoPluses: string
    // Means we are in gpt-4 mode
    if (mermaid === undefined) {
      const { query } = data
      const queryNoPluses = query.replace(/\+/g, ' ')

      console.log('key', env)
      // GPT Plugins encoded spaces as +
      mermaidNoPluses = await getGPTResponse(queryNoPluses, env.OPENAI_KEY)
    } else {
      // GPT Plugins encoded spaces as +
      mermaidNoPluses = mermaid.replace(/\+/g, ' ')
    }

    diagramLanguage = diagramLanguage || 'mermaid'

    let diagramSource = mermaidNoPluses
    let editDiagramOnline: string | undefined

    if (diagramLanguage === 'mermaid') {
      const mermaidNoHyphenatedWords = processString(mermaidNoPluses)
      console.log('mermaidNoHyphenatedWords', mermaidNoHyphenatedWords)

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

      diagramSource = mermaidNoHyphenatedWords
    }

    // TODO: Add graphvis editor https://www.devtoolsdaily.com/graphviz/?#%7B%22dot%22%3A%22digraph%20MessageArchitecture%20%7B%5Cn%20%20messageClient%5Cn%20%20messageQueue%5Bshape%3Drarrow%5D%5Cn%7D%22%7D

    const imageUrl =
      'https://kroki.io/' +
      diagramLanguage +
      '/svg/' +
      compressAndEncodeBase64(mermaidNoPluses)

    const slug = await saveShortLink(env.SHORTEN, imageUrl)
    let shortenedURL = `${new URL(request.url).origin}/s/${slug}`

    const editorSlug = await saveShortLink(env.SHORTEN, editDiagramOnline)
    let shortenedEditDiagramURL = `${
      new URL(request.url).origin
    }/s/${editorSlug}`

    console.log({ shortenedURL })

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

function systemPrompt(userQuestion: string): string {
  return `
You should create a mermaid diagram to answer the user's question. As your output only return the mermaid code snippet, not the mermaid.js code block using \`\`\`mermaid\`\`\`.

Limit output to mermaid.js code snippet to a single diagram.

Rules for creating the mermaid.js code snippet for input to the API:
If the user wants to know about a fractional breakdown, then you can use a pie chart instead of a mindmap or state diagram.
If the user wants the timeline of an event of topic, use a timeline.
If generating a timeline, then for the first output that consists of 2 sentences, summarize the trend of the timeline.
To show a breakdown or fractional representation of an item, use a pie chart.

For element names such as "Lab-on-a-chip", use spaces instead of dashes so that the new element name will be "Lab on a chip". Another example is the name "State-specific regulations" which should be instead "State specific regulations". Another example is "T-Cells" would be "T Cells". Another example is "COVID-19" make this "COVID 19". Follow this pattern for other names that fall into this category.

Use a state diagram to explain processes and systems that have a specific order. simplify to a maximum of 10 elements for a state diagram. use a mindmap to summarize content such as books or generally explain broad concepts. for mind maps, simplify to: maximum of 4 connections per element. only chain at most 2 elements away from the root.

when outputs are given to a user and then a user asks for more detail (or if user specifically asks to explain a concept in depth or in more detail), increase the first output from 2 sentence summary to a 4 sentence synopsis or detailed description of the user's original prompt. For the second output, expand so that the maximum items for a state diagram is 30 elements. If rearranging the location of a element will allow for less crossing of arrow lines, then use this formation. Expand so that a mindmap is up to 4 levels from the root.

For the code snippet, generate a mermaid.js snippet that only uses fa v4.7 icons as listed in this link: [https://www.fontawesomecheatsheet.com/font-awesome-cheatsheet-4x/](https://www.fontawesomecheatsheet.com/font-awesome-cheatsheet-4x/). Do not use the same icon more than once. Try to only use element titles that have icons to correlate. Use colors to color code labels when appropriate. If an icon does not exist in the fa v4.7 list, then do not use it.

If icons do not make sense for a diagram or mindmap because the names do not have good correlating icons, then do not use any icons.

here is example of syntax for state diagram:

stateDiagram
    %% Define different styles
    classDef customStyle fill:lightblue,stroke:blue,stroke-width:2px

    state "fa:fa-file-text-o Idea" as Idea
    state "fa:fa-pencil-square-o Drafting" as Drafting
    state "fa:fa-gavel Review" as Review
    state "fa:fa-comments-o Debate" as Debate
    state "fa:fa-check-square-o Vote" as Vote
    state "fa:fa-exchange Conference" as Conference
    state "fa:fa-legal Presidential\\nAction" as PresidentialAction
    state "fa:fa-balance-scale Law" as Law

    Idea --> Drafting
    Drafting --> Review
    Review --> Debate
    Debate --> Vote
    Vote --> Conference
    Vote --> Law: Passes
    Conference --> PresidentialAction
    PresidentialAction --> Law: Signed
    PresidentialAction --> Review: Veto

    %% Apply the style (aka class)
    class Idea, Drafting, Review, Debate, Vote, Conference, PresidentialAction, Law customStyle

Example of mindmap syntax:

mindmap
  root((Great Gatsby))
    Characters
      Jay Gatsby
      ::icon(fa fa-user)
      Daisy Buchanan
      ::icon(fa fa-female)
      Tom Buchanan
      ::icon(fa fa-male)
      Nick Carraway
      ::icon(fa fa-user)
    Themes
      Wealth
      ::icon(fa fa-money)
      Love
      ::icon(fa fa-heart)
      American Dream
      ::icon(fa fa-flag)
    Setting
      1920s
      ::icon(fa fa-clock-o)
      Long Island
      ::icon(fa fa-map-marker)
    Author
      F. Scott Fitzgerald
      ::icon(fa fa-pencil)

For pie charts, here is example syntax:

%%{init: {"pie": {"textPosition": 0.5}, "themeVariables": {"pieOuterStrokeWidth": "5px"}} }%%
pie showData
    title Key elements in Product X
   "Calcium" : 42.96
   "Potassium" : 50.05
   "Magnesium" : 10.01
   "Iron" :  5

For timeline, here is example syntax:

timeline
    title History of Social Media Platform
    2002 : LinkedIn
    2004 : Facebook
         : Google
    2005 : Youtube
    2006 : Twitter


Task:
Createa a diagram for the following prompt:
${userQuestion}
`
}
