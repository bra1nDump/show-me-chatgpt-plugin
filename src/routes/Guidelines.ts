import { Enumeration, OpenAPIRoute, Query, Str } from '@cloudflare/itty-router-openapi'

import { Env } from '..';
import { DiagramLanguage, DiagramType } from "./diagrams/utils";
import { diagramTypeGuidelines } from "./diagrams/guidelines/diagramTypeGuidelines";
import { syntaxGuidelines } from "./diagrams/guidelines/syntaxGuidelines";
import { getTrack } from "./utils";

type DiagramTypeSyntax = `${DiagramType}_${DiagramLanguage}`

const guidelinesName = [
  "graph_mermaid",
  "use-case_plantuml",
  "timeline-diagram_mermaid",
  "mindmap_mermaid"
] as const satisfies ReadonlyArray<(DiagramTypeSyntax)>

type Guideline = typeof guidelinesName[number]

export class GuidelinesRoute extends OpenAPIRoute {
  /// 2. Creates /openapi.json route under the hood. Injects this into gpt prompt to teach about how to use the plugin.
  static schema = {
    tags: ["Guidelines"],
    summary: "Get guidelines to help rendering more effective diagrams",
    parameters: {
      guidelinesName: Query(new Enumeration({
        description: 'Guidelines name',
        required: true,
        values: Object.fromEntries(
          guidelinesName.map(guidelinesName => [guidelinesName, guidelinesName])
        )
      })),
    },
    responses: {
      "200": {
        schema: {
          guidelines: new Str({
            description: "The requested guidelines",
          }),
        },
      },
    },
  }

  /// 3. Handles the API request
  async handle(request: Request, env: Env, _ctx: unknown) {
    const guidelinesName = new URL(request.url).searchParams.get("guidelinesName") as Guideline;
    console.log('guidelines Name', guidelinesName)

    const getGuidelines: Record<Guideline, string> = {
      "graph_mermaid": `${diagramTypeGuidelines["graph"]} 
      ${syntaxGuidelines["mermaid"]["graph"]}`,
      "use-case_plantuml": `${diagramTypeGuidelines["use-case"]} 
      ${syntaxGuidelines["plantuml"]["use-case"]}`,
      "timeline-diagram_mermaid": `${diagramTypeGuidelines["timeline-diagram"]} 
      ${syntaxGuidelines["mermaid"]["timeline-diagram"]}`,
      "mindmap_mermaid": `${diagramTypeGuidelines["mindmap"]} 
      ${syntaxGuidelines["mermaid"]["mindmap"]}`
    }

    const guidelines = getGuidelines[guidelinesName]

    // TODO: Refactor this repeated code: print headers
    // Print headers
    const headers = Object.fromEntries(request.headers)
    console.log('headers', headers)

    const track = getTrack(headers, env)

    void track('get-guidelines', {
      'guideline': guidelinesName,
    })

    const responseBody =
      {
        guidelines
      }

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


