import { Enumeration, OpenAPIRoute, Query, Str } from '@cloudflare/itty-router-openapi'

import { saveShortLink } from './Shorten'

import { Env } from '..';
import { diagramDetails } from "./diagrams";
import { DiagramLanguage, diagramLanguages, DiagramType, diagramTypes } from "./diagrams/utils";
import { getTrack } from "./utils";

export class MermaidRoute extends OpenAPIRoute {
  /// 2. Creates /openapi.json route under the hood. Injects this into gpt prompt to teach about how to use the plugin.
  static schema = {
    tags: ["Diagram"],
    summary: `Taking a diagram, renders it and returns a link to the rendered image.`,
    parameters: {
      // TODO: Pass manifest version as a parameter so its easier to debug old / new clients
      // not sure if its even possible.

      // It still prefers the old name even if new manifest is fetched
      mermaid: Query(
        new Str({
          description: "Mermaid to render (legacy parameter name, use diagram instead)",
          // Not providing an example because it's a duplicate of the one below
        }),
        {
          required: false,
        }
      ),
      diagram: Query(
        new Str({
          description: "Diagram to render",
          example: `graph TB\\n  U[\\"User\\"] -- \\"File Operations\\" --> FO[\\"File Operations\\"]\\n  U -- \\"Code Editor\\" --> CE[\\"Code Editor\\"]\\n  FO -- \\"Manipulation of Files\\" --> FS[\\"FileSystem\\"]\\n  FS -- \\"Write/Read\\" --> D[\\"Disk\\"]\\n  FS -- \\"Compress/Decompress\\" --> ZL[\\"ZipLib\\"]\\n  FS -- \\"Read\\" --> IP[\\"INIParser\\"]\\n  CE -- \\"Create/Display/Edit\\" --> WV[\\"Webview\\"]\\n  CE -- \\"Language/Code Analysis\\" --> VCA[\\"VSCodeAPI\\"]\\n  VCA -- \\"Talks to\\" --> VE[\\"ValidationEngine\\"]\\n  WV -- \\"Render UI\\" --> HC[\\"HTMLCSS\\"]\\n  VE -- \\"Decorate Errors\\" --> ED[\\"ErrorDecoration\\"]\\n  VE -- \\"Analyze Document\\" --> TD[\\"TextDocument\\"]\\n`,
        }),
        {
          required: true,
        }
      ),
      diagramLanguage: Query(
        new Enumeration({
          description: 'Language of the diagram',
          required: true,
          values: Object.fromEntries(
            diagramLanguages.map(language => [language, language])
          )
        }),
        {
          required: false,
        }
      ),
      diagramType: Query(
        new Enumeration({
          description: "Type of the diagram",
          values: Object.fromEntries(
            diagramTypes.map(language => [language, language])
          )
        }),
        {
          required: false,
        }
      ),
      topic: Query(
        new Str({
          description: "Topic of the diagram",
          example: "Software",
        }),
        {
          required: false,
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
                required: false,
              }),
              errorMessage: new Str({
                description: "Error message if there was an error",
                required: false,
              }),
              editDiagramOnline: new Str({
                description:
                  "URL to the editor where the diagram can be edited",
                required: false,
              }),
              contributeToOpenSourceProject: new Str({
                description: "GitHub URL to the open source project for this project",
              }),
            },
          ],
        },
      },
    },
  }

  /// 3. Handles the API request
  async handle(request: Request, env: Env, _ctx : unknown, data: Record<string, any>) {
    const BASE_URL = new URL(request.url).origin
    const timeline = new Timeline();

    // Extract data from request
    const diagramLanguage =
      new URL(request.url).searchParams.get("diagramLanguage") as DiagramLanguage
      ?? "mermaid"; // For older versions
    const diagramParam =
      new URL(request.url).searchParams.get("diagram")
      ?? new URL(request.url).searchParams.get("mermaid") as string; // For older versions

    const topic  = new URL(request.url).searchParams.get("topic") ?? "none";
    const diagramType  = new URL(request.url).searchParams.get("diagramType") as DiagramType
      ?? "unknown";

    console.log('diagram', diagramParam)
    console.log('topic', topic)

    const diagram = await diagramDetails(diagramParam, diagramLanguage, diagramType)

    const headers = Object.fromEntries(request.headers)
    console.log('headers', headers)

    const track = getTrack(headers, env)

    void track('render', {
      'diagram_language': diagramLanguage,

      // Mixpanel truncates all strings https://developer.mixpanel.com/reference/import-events#common-issues
      'diagram_type': diagramType,
      'diagram': diagramParam.length > 255 ? diagramParam.substring(0, 200) + " -- truncated" : diagramParam,

      'topic': topic,
    })

    let shortenedDiagramURL: string | undefined;
    if (diagram.isValid) {
      const slug = await saveShortLink(env.SHORTEN, diagram.diagramSVG as string)
      shortenedDiagramURL = `${BASE_URL}/d/${slug}`
    }

    let shortenedEditDiagramURL: string | undefined;
    if (diagram.editorLink) {
      // Still show the edit link if available, even if there was an
      const editorSlug = await saveShortLink(env.SHORTEN, diagram.editorLink);
      shortenedEditDiagramURL = diagram.editorLink ? `${BASE_URL}/s/${editorSlug}` : undefined
    }

    console.log({ shortenedDiagramURL })
    console.log('diagram svg (truncated)', diagram.diagramSVG?.slice(0, 300))

    await track('render_complete', {
      'diagram_language': diagramLanguage,
      'diagram_syntax_is_valid': diagram.isValid,
      'rendering_error': diagram.error,

      'diagram_type': diagramType,
      'diagram_url': shortenedDiagramURL ?? "diagram is invalid",
      'edit_diagram_url': shortenedEditDiagramURL ?? "not implemented yet",

      'topic': topic,
    })

    let errorMessage: string | undefined;
    switch (diagram.error) {
      case 'invalid syntax':
        errorMessage = "GPT created an invalid diagram, you can try again or fix it by hand by editing it online"
        break;
      case 'kroki timed out':
      case 'kroki failed':
        errorMessage = "We are experiencing a high load of requests for rendering the diagram, you can still view and edit it online. We are working on a fix."
        break;
    }

    // TODO: Type this reponse to avoid breaking in the future
    const responseBody =
      {
        results:  [
          {
            ...shortenedDiagramURL && { image: shortenedDiagramURL },
            ...errorMessage && { errorMessage: errorMessage },
            ...shortenedEditDiagramURL && { editDiagramOnline: shortenedEditDiagramURL },
            contributeToOpenSourceProject: 'https://github.com/bra1nDump/show-me-chatgpt-plugin/issues'
          }
        ]
      }

    console.log('response', JSON.stringify(responseBody, null, 2))

    return new Response(
      JSON.stringify(responseBody),
      {
        headers: {
          'content-type': 'application/json;charset=UTF-8'
        }
      }
    )
  }
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
        ${mermaid?.replace(/\+/g, ' ')}
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
  // @ts-ignore
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

