import { Enumeration, OpenAPIRoute, Query, Str } from '@cloudflare/itty-router-openapi'

import { Env } from '..';
import { DiagramLanguage, DiagramType } from "./diagrams/utils";
import { diagramTypeGuidelines } from "./diagrams/guidelines/diagramTypeGuidelines";
import { syntaxGuidelines } from "./diagrams/guidelines/syntaxGuidelines";
import { supportedDiagrams } from "./diagrams/supportedDiagrams";
import { createTrackerForRequest } from "../mixpanel";

type DiagramTypeSyntax = `${DiagramLanguage}_${DiagramType}`

const diagramGuidelinesParams = supportedDiagrams
  .flatMap(({ diagramLanguage, types }) =>
    types
      .map(({ diagramType }) => `${diagramLanguage}_${diagramType}`)
  ) as DiagramTypeSyntax[]

type GuidelineParam = typeof diagramGuidelinesParams[number]

export class DiagramGuidelinesRoute extends OpenAPIRoute {
  static schema = {
    tags: ["Diagram Guidelines"],
    summary: "Diagram guidelines to help rendering more effective diagrams",
    parameters: {
      diagramGuidelines: Query(new Enumeration({
          description: 'Guidelines and syntax for a type of diagram',
          required: true,
          default: "mermaid_graph" as GuidelineParam,
          values: Object.fromEntries(
            diagramGuidelinesParams.map(param => [param, param])
          ),
        }),
        {
          required: true,
        }),
    },
    responses: {
      "200": {
        schema: {
          diagramGuidelines: new Str({
            description: "The requested diagram guidelines. Make sure to follow the guidelines before rendering a diagram",
            required: false
          }),
        },
      },
    },
  }

  async handle(request: Request, env: Env, _ctx: unknown) {
    const diagramGuidelinesParam = new URL(request.url).searchParams.get("diagramGuidelines") as GuidelineParam;

    console.log('diagram guidelines param: ', diagramGuidelinesParam)

    const diagramLanguage = diagramGuidelinesParam.split("_")[0] as DiagramLanguage
    const diagramType = diagramGuidelinesParam.split("_")[1] as DiagramType

    const diagramGuidelines = `${diagramTypeGuidelines[diagramType] ?? ""}${syntaxGuidelines[diagramLanguage]?.[diagramType] ?? ""}` || "No specific guidelines are required for this diagram type"

    const track = createTrackerForRequest(request, env)

    void track('diagram-guidelines', {
      'diagramGuidelinesParam': diagramGuidelinesParam,
    })

    const responseBody =
      {
        diagramGuidelines
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


