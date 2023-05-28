import { DiagramLanguage, DiagramType } from "./utils";

type DiagramLanguageDocumentationURL = string
type DiagramTypeDocumentationURL = string
export const supportedDiagrams:
  {
    diagramLanguage: DiagramLanguage,
    documentationURL: DiagramLanguageDocumentationURL,
    types: {
      diagramType: DiagramType,
      documentationURL: DiagramTypeDocumentationURL
    }[]
  }[] = [
  {
    diagramLanguage: "mermaid",
    documentationURL: "https://mermaid.js.org/",
    types: [
      {
        diagramType: "graph",
        documentationURL: "https://mermaid.js.org/syntax/flowchart.html"
      },
      {
        diagramType: "sequence",
        documentationURL: "https://mermaid.js.org/syntax/sequenceDiagram"
      },
      {
        diagramType: "class",
        documentationURL: "https://mermaid.js.org/syntax/classDiagram"
      },
      {
        diagramType: "state",
        documentationURL: "https://mermaid.js.org/syntax/stateDiagram"
      },
      {
        diagramType: "entity-relationship",
        documentationURL: "https://mermaid.js.org/syntax/entityRelationshipDiagram"
      },
      {
        diagramType: "user-journey",
        documentationURL: "https://mermaid.js.org/syntax/userJourney"
      },
      {
        diagramType: "gantt",
        documentationURL: "https://mermaid.js.org/syntax/gantt"
      },
      {
        diagramType: "pie-chart",
        documentationURL: "https://mermaid.js.org/syntax/pie"
      },
      {
        diagramType: "requirement",
        documentationURL: "https://mermaid.js.org/syntax/requirementDiagram"
      },
      {
        diagramType: "gitgraph",
        documentationURL: "https://mermaid.js.org/syntax/gitgraph"
      },
      {
        diagramType: "mindmap",
        documentationURL: "https://mermaid.js.org/syntax/mindmap"
      },
      {
        diagramType: "timeline",
        documentationURL: "https://mermaid.js.org/syntax/timeline"
      },
    ]
  },
  {
    diagramLanguage: "plantuml",
    documentationURL: "https://plantuml.com/",
    types: [
      {
        diagramType: "sequence",
        documentationURL: "https://plantuml.com/sequence-diagram"
      },
      {
        diagramType: "use-case",
        documentationURL: "https://plantuml.com/use-case-diagram"
      },
      {
        diagramType: "class",
        documentationURL: "https://plantuml.com/class-diagram"
      },
      {
        diagramType: "object",
        documentationURL: "https://plantuml.com/object-diagram"
      },
      {
        diagramType: "activity",
        documentationURL: "https://plantuml.com/activity-diagram-beta"
      },
      {
        diagramType: "component",
        documentationURL: "https://plantuml.com/component-diagram"
      },
      {
        diagramType: "deployment",
        documentationURL: "https://plantuml.com/deployment-diagram"
      },
      {
        diagramType: "state",
        documentationURL: "https://plantuml.com/state-diagram"
      },
      {
        diagramType: "timing",
        documentationURL: "https://plantuml.com/timing-diagram"
      },
      {
        diagramType: "entity-relationship",
        documentationURL: "https://plantuml.com/ie-diagram"
      },
      {
        diagramType: "gantt",
        documentationURL: "https://plantuml.com/gantt-diagram"
      },
      {
        diagramType: "mindmap",
        documentationURL: "https://plantuml.com/mindmap-diagram"
      },
      {
        diagramType: "network",
        documentationURL: "https://plantuml.com/nwdiag"
      },
      {
        diagramType: "json",
        documentationURL: "https://plantuml.com/json"
      },
      {
        diagramType: "yaml",
        documentationURL: "https://plantuml.com/yaml"
      },
      {
        diagramType: "ebnf",
        documentationURL: "https://plantuml.com/ebnf"
      },
      {
        diagramType: "salt-wireframe",
        documentationURL: "https://plantuml.com/salt"
      },
    ]
  },
  {
    diagramLanguage: "d2",
    documentationURL: "https://d2lang.com",
    types: [
      {
        diagramType: "sequence",
        documentationURL: "https://d2lang.com/tour/sequence-diagrams"
      },
      {
        diagramType: "class",
        documentationURL: "https://d2lang.com/tour/uml-classes"
      },
      {
        diagramType: "graph",
        documentationURL: "https://d2lang.com/tour/intro"
      },
      {
        diagramType: "entity-relationship",
        documentationURL: "https://d2lang.com/tour/sql-tables"
      },
      {
        diagramType: "grid",
        documentationURL: "https://d2lang.com/tour/grid-diagrams"
      },
    ]
  },
  {
    diagramLanguage: "nomnoml",
    documentationURL: "https://www.nomnoml.com",
    types: [
      {
        diagramType: "class",
        documentationURL: "https://www.nomnoml.com"
      },
      {
        diagramType: "activity",
        documentationURL: "https://www.nomnoml.com"
      },
      {
        diagramType: "graph",
        documentationURL: "https://www.nomnoml.com"
      },
      {
        diagramType: "entity-relationship",
        documentationURL: "https://www.nomnoml.com"
      },
      {
        diagramType: "uml",
        documentationURL: "https://www.nomnoml.com"
      },
    ]
  },
  {
    diagramLanguage: "graphviz",
    documentationURL: "https://graphviz.org/Gallery/",
    types: [
      {
        diagramType: "graph",
        documentationURL: "https://graphviz.org/Gallery/directed/unix"
      },
      {
        diagramType: "entity-relationship",
        documentationURL: "https://graphviz.org/Gallery/neato/ER"
      },
      {
        diagramType: "mindmap",
        documentationURL: "https://graphviz.org/Gallery/twopi/happiness"
      },
      {
        diagramType: "uml",
        documentationURL: "https://graphviz.org/Gallery/directed/UML_Class_diagram"
      },
    ]
  },
  {
    diagramLanguage: "actdiag",
    documentationURL: "http://blockdiag.com/en/actdiag",
    types: [
      {
        diagramType: "activity",
        documentationURL: "http://blockdiag.com/en/actdiag/examples.html"
      },
    ]
  },
  {
    diagramLanguage: "blockdiag",
    documentationURL: "http://blockdiag.com/en/blockdiag",
    types: [
      {
        diagramType: "block",
        documentationURL: "http://blockdiag.com/en/blockdiag/examples.html"
      },
    ]
  },
  {
    diagramLanguage: "nwdiag",
    documentationURL: "http://blockdiag.com/en/nwdiag",
    types: [
      {
        diagramType: "network",
        documentationURL: "http://blockdiag.com/en/nwdiag/nwdiag-examples.html"
      },
    ]
  },
  {
    diagramLanguage: "rackdiag",
    documentationURL: "http://blockdiag.com/en/nwdiag/rackdiag-examples.html",
    types: [
      {
        diagramType: "rack",
        documentationURL: "http://blockdiag.com/en/nwdiag/rackdiag-examples.html"
      },
    ]
  },
  {
    diagramLanguage: "dbml",
    documentationURL: "https://dbml.dbdiagram.io/home/",
    types: [
      {
        diagramType: "dbml",
        documentationURL: "https://dbml.dbdiagram.io/home/"
      },
    ]
  },
  {
    diagramLanguage: "erd",
    documentationURL: "https://github.com/BurntSushi/erd",
    types: [
      {
        diagramType: "entity-relationship",
        documentationURL: "https://github.com/BurntSushi/erd"
      },
    ]
  },
  {
    diagramLanguage: "ditaa",
    documentationURL: "https://ditaa.sourceforge.net/",
    types: [
      {
        diagramType: "ascii",
        documentationURL: "https://ditaa.sourceforge.net/"
      },
    ]
  },
  {
    diagramLanguage: "svgbob",
    documentationURL: "https://ivanceras.github.io/svgbob-editor/",
    types: [
      {
        diagramType: "ascii",
        documentationURL: "https://ivanceras.github.io/svgbob-editor/"
      },
    ]
  },
  {
    diagramLanguage: "wavedrom",
    documentationURL: "https://wavedrom.com/tutorial.html",
    types: [
      {
        diagramType: "digital-timing",
        documentationURL: "https://wavedrom.com/tutorial.html"
      },
    ]
  },
  {
    diagramLanguage: "vegalite",
    documentationURL: "https://vega.github.io/vega-lite/examples/",
    types: [
      {
        diagramType: "bar-chart",
        documentationURL: "https://vega.github.io/vega-lite/examples/bar.html"
      },
      {
        diagramType: "histogram",
        documentationURL: "https://vega.github.io/vega-lite/examples/bar_binned_data.html"
      },
      {
        diagramType: "line-chart",
        documentationURL: "https://vega.github.io/vega-lite/examples/line_dashed_part.html"
      },
      {
        diagramType: "pie-chart",
        documentationURL: "https://vega.github.io/vega-lite/examples/arc_pie.html"
      },
    ]
  },
]
