import { Enumeration, Bool, OpenAPIRoute, Query, Str } from '@cloudflare/itty-router-openapi'

import { Env } from '..';
import { DiagramLanguage, DiagramType } from "./diagrams/utils";
import { diagramTypeGuidelines } from "./diagrams/guidelines/diagramTypeGuidelines";
import { syntaxGuidelines } from "./diagrams/guidelines/syntaxGuidelines";
import { getTrack } from "./utils";
import { supportedDiagrams } from "./diagrams/supportedDiagrams";

const supportedDiagramLanguagesAndDiagramTypes = (supportedDiagrams
    .map(({ diagramLanguage, documentationURL, types }) =>
      `${diagramLanguage}({${documentationURL}}): ${types.map(({
                                                                 diagramType,
                                                                 documentationURL
                                                               }) => `${diagramType}(${documentationURL})`).join(", ")}`
    )

).join("\n")

type DiagramTypeSyntax = `${DiagramLanguage}_${DiagramType}`

const guidelinesName = supportedDiagrams
  .flatMap(({ diagramLanguage, types }) =>
    types
      .map(({ diagramType }) => `${diagramLanguage}_${diagramType}`)
  ) as DiagramTypeSyntax[]

type Guideline = typeof guidelinesName[number]

export class InformationRoute extends OpenAPIRoute {
  static schema = {
    tags: ["Information", "Guidelines", "Supported Diagrams"],
    summary: "Get information to help rendering more effective diagrams",
    parameters: {
      getDiagramGuidelines: Query(new Enumeration({
          description: 'Get guidelines for a kind of diagram, includes syntax and best practices',
          required: false,
          values: Object.fromEntries(
            guidelinesName.map(guidelinesName => [guidelinesName, guidelinesName])
          ),
        }),
        {
          required: false,
        }),
      getSupportedDiagrams: Query(new Bool({
        description: 'Get list of supported diagram languages and diagram types',
      }), {
        required: false
      }),
    },
    responses: {
      "200": {
        schema: {
          diagramGuidelines: new Str({
            description: "The requested guidelines",
            required: false
          }),
          supportedDiagrams: new Str({
            description: "The requested list of supported diagrams",
            required: false
          }),
        },
      },
    },
  }

  /// 3. Handles the API request
  async handle(request: Request, env: Env, _ctx: unknown) {
    const getDiagramGuidelines = new URL(request.url).searchParams.get("getDiagramGuidelines") as Guideline | undefined;
    const getSupportedDiagrams = (new URL(request.url).searchParams.get("getSupportedDiagrams") as string) === "true";

    console.log('get diagram guidelines: ', getDiagramGuidelines)
    console.log('get supported guidelines: ', getSupportedDiagrams)

    const getGuidelines = () => {
      if (getDiagramGuidelines) {
        const diagramLanguage = getDiagramGuidelines.split("_")[0] as DiagramLanguage
        const diagramType = getDiagramGuidelines.split("_")[1] as DiagramType

        const guidelines = `${diagramTypeGuidelines[diagramType] ?? ""}${syntaxGuidelines[diagramLanguage]?.[diagramType] ?? ""}`

        return guidelines.length > 0 ? guidelines : "there are no guidelines for this diagram type"
      } else {
        return null
      }
    }

    const diagramGuidelines = getGuidelines()

    const headers = Object.fromEntries(request.headers)
    console.log('headers', headers)

    const track = getTrack(headers, env)

    void track('get-guidelines', {
      'getDiagramGuidelines': getDiagramGuidelines,
      'getSupportedDiagrams': getSupportedDiagrams,
    })

    const responseBody =
      {
        ...diagramGuidelines && { diagramGuidelines },
        ...getSupportedDiagrams && {
          supportedDiagrams: `
List of supported diagram languages and diagram types:
- When the user generates additional diagram types not listed in this list, inform them that it may be possible to create them. However, since these have not undergone testing, they should be considered experimental. For example: vega lite is not listed so you should inform the user that it is experimental.
- Read each item of the list as: "<<diagramLanguage>>(<<diagramLanguageDocumentationURL>>): <<diagramType>>(<<DiagramTypeDocumentationURL>>)", if the user asks about what kind of diagrams you support list them like "diagramLanguage: * [diagramType](join diagramDocumentationBaseURL and diagramTypeDocumentationPath)". Do not create a link for the diagramLanguage. When creating the links you should join the baseURL with the path like "https://mermaid.js.org/syntax/sequenceDiagram.html". Do not create a link with just the base "https://mermaid.js.org/syntax/" or just the path "sequenceDiagram.html".
${supportedDiagramLanguagesAndDiagramTypes}`
        }
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


