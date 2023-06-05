import { DiagramLanguage, DiagramType } from "./utils";

export const supportedDiagrams:
  {
    diagramLanguage: DiagramLanguage,
    types: {
      diagramType: DiagramType,
    }[]
  }[] = [
  {
    diagramLanguage: "mermaid",
    types: [
      {
        diagramType: "graph",
      },
      {
        diagramType: "sequence",
      },
      {
        diagramType: "class",
      },
      {
        diagramType: "state",
      },
      {
        diagramType: "entity-relationship",
      },
      {
        diagramType: "user-journey",
      },
      {
        diagramType: "gantt",
      },
      {
        diagramType: "pie-chart",
      },
      {
        diagramType: "requirement",
      },
      {
        diagramType: "gitgraph",
      },
      {
        diagramType: "mindmap",
      },
      {
        diagramType: "timeline",
      },
    ]
  },
  {
    diagramLanguage: "plantuml",
    types: [
      {
        diagramType: "sequence",
      },
      {
        diagramType: "use-case",
      },
      {
        diagramType: "class",
      },
      {
        diagramType: "object",
      },
      {
        diagramType: "activity",
      },
      {
        diagramType: "component",
      },
      {
        diagramType: "deployment",
      },
      {
        diagramType: "state",
      },
      {
        diagramType: "timing",
      },
      {
        diagramType: "entity-relationship",
      },
      {
        diagramType: "gantt",
      },
      {
        diagramType: "mindmap",
      },
      {
        diagramType: "network",
      },
      {
        diagramType: "json",
      },
      {
        diagramType: "yaml",
      },
      {
        diagramType: "salt-wireframe",
      },
    ]
  },
  {
    diagramLanguage: "d2",
    types: [
      {
        diagramType: "sequence",
      },
      {
        diagramType: "class",
      },
      {
        diagramType: "graph",
      },
      {
        diagramType: "entity-relationship",
      },
      {
        diagramType: "grid",
      },
    ]
  },
  {
    diagramLanguage: "nomnoml",
    types: [
      {
        diagramType: "class",
      },
      {
        diagramType: "activity",
      },
      {
        diagramType: "graph",
      },
      {
        diagramType: "entity-relationship",
      },
    ]
  },
  {
    diagramLanguage: "graphviz",
    types: [
      {
        diagramType: "graph",
      },
      {
        diagramType: "entity-relationship",
      },
      {
        diagramType: "mindmap",
      },
    ]
  },
  {
    diagramLanguage: "actdiag",
    types: [
      {
        diagramType: "activity",
      },
    ]
  },
  {
    diagramLanguage: "blockdiag",
    types: [
      {
        diagramType: "block",
      },
    ]
  },
  {
    diagramLanguage: "nwdiag",
    types: [
      {
        diagramType: "network",
      },
    ]
  },
  {
    diagramLanguage: "rackdiag",
    types: [
      {
        diagramType: "rack",
      },
    ]
  },
  {
    diagramLanguage: "dbml",
    types: [
      {
        diagramType: "dbml",
      },
    ]
  },
  {
    diagramLanguage: "erd",
    types: [
      {
        diagramType: "entity-relationship",
      },
    ]
  },
  {
    diagramLanguage: "ditaa",
    types: [
      {
        diagramType: "ascii",
      },
    ]
  },
  {
    diagramLanguage: "svgbob",
    types: [
      {
        diagramType: "ascii",
      },
    ]
  },
  {
    diagramLanguage: "wavedrom",
    types: [
      {
        diagramType: "digital-timing",
      },
    ]
  },
  {
    diagramLanguage: "vegalite",
    types: [
      {
        diagramType: "bar-chart",
      },
      {
        diagramType: "histogram",
      },
      {
        diagramType: "line-chart",
      },
      {
        diagramType: "pie-chart",
      },
    ]
  },
]

// Languages Per Diagram Type List
// graph: mermaid, d2, nomnoml, etc
// sequence: mermaid, plantuml, d2, etc
export const languagesPerDiagramType = Object.entries(
  supportedDiagrams.reduce((acc: Record<string, string[]>, { diagramLanguage, types }) => {
    types.forEach(({ diagramType }) => {
      if (!acc[diagramType]) {
        acc[diagramType] = [];
      }
      acc[diagramType].push(diagramLanguage);
    });
    return acc;
  }, {})
)
  .map(([diagramType, diagramLanguages]) => `${diagramType}: ${(diagramLanguages).join(', ')}`).join("\n")
