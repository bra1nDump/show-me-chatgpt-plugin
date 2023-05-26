import { compressAndEncodeBase64, DiagramLanguage, getSVG } from "./utils";
import { mermaidEditorLink, mermaidFormat } from "./mermaid";
import { plantumlEditorLink } from "./plantuml";

type DiagramDetails = {
  editorLink: string,
  isValid: boolean,
  diagramSVG?: string,
  error?: "kroki timed out" | "invalid syntax" | "kroki failed",
};

export async function diagramDetails(diagram: string, diagramLanguage: DiagramLanguage): Promise<DiagramDetails> {
  type DiagramFunctions = {
    format: ((diagram: string) => string) | null,
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
    // TODO: add other diagram languages
  }

  const defaultDiagramFunctions: DiagramFunctions = {
    format: null,
    editorLink: null,
  }
  const diagramFunctions = getDiagramFunctions[diagramLanguage] ?? defaultDiagramFunctions

  const formattedDiagram = diagramFunctions.format?.(diagram) ?? diagram;

  const imageUrl =
    'https://kroki.io/' +
    diagramLanguage +
    '/svg/' +
    compressAndEncodeBase64(formattedDiagram)

  const rednerResult = await getSVG(imageUrl);

  // We always include an editor link, as most likely the issue with with rendering
  // The user will still see the diagram in the editor
  
  if (rednerResult.error && rednerResult.error === "invalid syntax") {
    return {
      editorLink: diagramFunctions.editorLink?.(formattedDiagram) ?? "",
      isValid: false,
      error: rednerResult.error,
    }
  } else if (rednerResult.error) {
    return {
      editorLink: diagramFunctions.editorLink?.(formattedDiagram) ?? "",
      isValid: false,
      error: rednerResult.error,
    }
  } else if (rednerResult.svg) {
    return {
      editorLink: diagramFunctions.editorLink?.(formattedDiagram) ?? "",
      isValid: true,
      diagramSVG: rednerResult.svg,
    }
  }
  
}

