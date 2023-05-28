import {
  compressAndEncodeBase64,
  DiagramLanguage,
  DiagramType,
  getSVG,
  HACK_postMermaidDiagram,
  RenderResult
} from "./utils";
import { mermaidEditorLink, mermaidFormat } from "./mermaid";
import { plantumlEditorLink } from "./plantuml";
import { graphvizEditorLink } from "./graphviz";
import { vegaLiteEditorLink } from "./vega-lite";

type DiagramDetails = {
  editorLink: string,
  isValid: boolean,
  diagramSVG?: string | null,
  error?: "kroki timed out" | "invalid syntax" | "kroki failed",
};

export async function diagramDetails(diagram: string, diagramLanguage: DiagramLanguage, diagramType: DiagramType): Promise<DiagramDetails> {
  type DiagramFunctions = {
    format: ((diagram: string, diagramType: DiagramType) => string) | null,
    editorLink: (diagram: string) => string | null
  };

  const getDiagramFunctions: Partial<Record<DiagramLanguage, DiagramFunctions>> = {
    "mermaid": {
      format: mermaidFormat,
      editorLink: mermaidEditorLink,
    },
    "plantuml": {
      format: null,
      editorLink: plantumlEditorLink,
    },
    "graphviz": {
      format: null,
      editorLink: graphvizEditorLink,
    },
    "vegalite": {
      format: null,
      editorLink: vegaLiteEditorLink,
    },
    // TODO: add other diagram languages
  }

  const defaultDiagramFunctions: DiagramFunctions = {
    format: null,
    editorLink: () => null,
  }
  const diagramFunctions = getDiagramFunctions[diagramLanguage] ?? defaultDiagramFunctions

  const formattedDiagram = diagramFunctions.format?.(diagram, diagramType) ?? diagram;

  let rednerResult: RenderResult
  if (diagramLanguage === "mermaid") {
    console.log("HACK: bypassing kroki.io for mermaid diagrams, going directly to kroki-mermaid.fly.dev")
    rednerResult = await HACK_postMermaidDiagram(formattedDiagram)
  } else {
    const imageUrl =
      'https://kroki.io/' +
      diagramLanguage +
      '/svg/' +
      compressAndEncodeBase64(formattedDiagram)

    console.log("imageUrl", imageUrl);

    rednerResult = await getSVG(imageUrl);
  }


  // We always include an editor link, as most likely the issue with with rendering
  // The user will still see the diagram in the editor

  if (rednerResult.error) {
    return {
      editorLink: diagramFunctions.editorLink?.(formattedDiagram) ?? "",
      isValid: false,
      error: rednerResult.error,
    }
  } else {
    return {
      editorLink: diagramFunctions.editorLink?.(formattedDiagram) ?? "",
      isValid: true,
      diagramSVG: rednerResult.svg,
    }
  }

}
