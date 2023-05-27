import * as pako from 'pako'

export function compressAndEncodeBase64(input: string) {
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

export function encodeBase64(input: string) {
  // Convert the input string to a Uint8Array
  const textEncoder = new TextEncoder()
  const inputUint8Array = textEncoder.encode(input)

  // Encode the compressed Uint8Array to a Base64 string
  const base64Encoded = btoa(String.fromCharCode.apply(null, inputUint8Array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  return base64Encoded
}

export const diagramLanguages = [
  "blockdiag",
  "bpmn",
  "bytefield",
  "seqdiag",
  "actdiag",
  "nwdiag",
  "packetdiag",
  "rackdiag",
  "c4-with-plantuml",
  "d2",
  "dbml",
  "ditaa",
  "erd",
  "excalidraw",
  "graphviz",
  "mermaid",
  "nomnoml",
  "pikchr",
  "plantuml",
  "structurizr",
  "svgbob",
  "umlet",
  "vega",
  "vega-lite",
  "wavedrom",
  "wireviz",
] as const;

export type DiagramLanguage = typeof diagramLanguages[number];

export const diagramTypes = [
  "sequence",
  "use-case",
  "class",
  "object",
  "activity",
  "component",
  "deployment",
  "state",
  "timing",
  "graph",
  "entity-relationship",
  "user-journey",
  "gantt",
  "pie-chart",
  "requirement",
  "gitgraph",
  "mindmap",
  "timeline-diagram",
  "block",
  "network",
  "json",
  "yaml",
  "ebnf",
  "salt-wireframe",
  "rack",
  "grid",
  "dbml",
  "uml",
  "ascii",
  "digital-timing",
  "line-chart",
  "bar-chart",
  "histogram"
] as const

export type DiagramType = typeof diagramTypes[number]

type DiagramDocumentationBaseURL = string
type DiagramTypeDocumentationPath = string
export const supportedDiagramLanguagesAndTypes:
  [
    [DiagramLanguage, DiagramDocumentationBaseURL],
    [DiagramType, DiagramTypeDocumentationPath][]
  ][] = [
  [
    ["mermaid", "https://mermaid.js.org/syntax/"],
    [
      ["sequence", "sequenceDiagram.html"],
      ["class", "classDiagram.html"],
      ["state", "stateDiagram.html"],
      ["graph", "flowchart.html"],
      ["entity-relationship", "entityRelationshipDiagram.html"],
      ["user-journey", "userJourney.html"],
      ["gantt", "gantt.html"],
      ["pie-chart", "pie.html"],
      ["requirement", "requirementDiagram.html"],
      ["gitgraph", "gitgraph.html"],
      ["mindmap", "mindmap.html"],
      ["timeline-diagram", "timeline.html"]
    ]
  ],
  [
    ["plantuml", "https://plantuml.com/"],
    [
      ["sequence", "sequence-diagram"],
      ["use-case", "use-case-diagram"],
      ["class", "class-diagram"],
      ["object", "object-diagram"],
      ["activity", "activity-diagram-beta"],
      ["component", "component-diagram"],
      ["deployment", "deployment-diagram"],
      ["state", "state-diagram"],
      ["timing", "timing-diagram"],
      ["entity-relationship", "ie-diagram"],
      ["gantt", "gantt-diagram"],
      ["mindmap", "mindmap-diagram"],
      ["network", "nwdiag"],
      ["json", "json"],
      ["yaml", "yaml"],
      ["ebnf", "ebnf"],
      ["salt-wireframe", "salt"]
    ]
  ],
  [
    ["d2", "https://d2lang.com/tour/"],
    [
      ["sequence", "sequence-diagrams"],
      ["class", "uml-classes"],
      ["graph", "intro"],
      ["entity-relationship", "sql-tables"],
      ["grid", "grid-diagrams"]
    ]
  ],
  [
    ["nomnoml", "https://www.nomnoml.com/"],
    [
      ["class", ""],
      ["activity", ""],
      ["graph", ""],
      ["entity-relationship", ""],
      ["uml", ""]
    ]
  ],
  [
    ["graphviz", "https://graphviz.org/Gallery/"],
    [
      ["graph", "directed/unix.html"],
      ["entity-relationship", "neato/ER.html"],
      ["mindmap", "twopi/happiness.html"],
      ["uml", "directed/UML_Class_diagram.html"],
    ]
  ],
  [["actdiag", "http://blockdiag.com/en/actdiag/examples.html"], [["activity", ""]]],
  [["blockdiag", "http://blockdiag.com/en/blockdiag/examples.html"], [["block", ""]]],
  [["nwdiag", "http://blockdiag.com/en/nwdiag/nwdiag-examples.html"], [["network", ""]]],
  [["rackdiag", "http://blockdiag.com/en/nwdiag/rackdiag-examples.html"], [["rack", ""]]],
  [["dbml", "https://dbml.dbdiagram.io/home/"], [["dbml", ""]]],
  [["erd", "https://github.com/BurntSushi/erd"], [["entity-relationship", ""]]],
  [["ditaa", "https://ditaa.sourceforge.net/"], [["ascii", ""]]],
  [["svgbob", "https://ivanceras.github.io/svgbob-editor/"], [["ascii", ""]]],
  [["wavedrom", "https://wavedrom.com/tutorial.html"], [["digital-timing", ""]]],
  [
    ["vega-lite", "https://vega.github.io/vega-lite/examples/"],
    [
      ["bar-chart", "bar.html"],
      ["histogram", "bar_binned_data.html"],
      ["line-chart", "line_dashed_part.html"],
      ["pie-chart", "arc_pie.html"]
    ]
  ],
]

async function fetchSVG(link: string): Promise<string> {
  const response = await fetch(link);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.text();

  if (data.includes("Syntax error in graph")) {
    throw new Error('SVG contains "Syntax error in graph"');
  }

  return data;
}

// TODO: Add a timeout to the fetchSVG function

async function racePromise<T>(timeout: number, promise: Promise<T>): Promise<T> {
  const timeoutPromise = new Promise<T>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Promise timed out after ${timeout}ms`));
    }, timeout);
  });

  return Promise.race([promise, timeoutPromise]);
}

export interface RenderResult {
  svg?: string,
  error?: "kroki timed out" | "invalid syntax" | "kroki failed"
}

export async function getSVG(imageUrl: string): Promise<RenderResult> {
  try {
    const svg = await racePromise(4000, fetchSVG(imageUrl))

    console.error(
      `Rendered successfully
      Image url: ${imageUrl}
      `)

    return { svg }
  } catch (error) {
    console.error(
      `Error rendering or fetching svg: ${error}
      Image url: ${imageUrl}
      `)

    if (error.message.includes("Promise timed out after")) {
      return { error: "kroki timed out" }
    } else if (error.message.includes('SVG contains "Syntax error in graph"')) {
      return { error: "invalid syntax" }
    } else {
      return { error: "kroki failed" }
    }
  }
}

// Write a similar function for making a post to https://kroki-mermaid.fly.dev/svg
// with the contents of the mermaid diagram as the body in plain text
// HACK
// https://github.com/bra1nDump/show-me-chatgpt-plugin/issues/26
export async function HACK_postMermaidDiagram(diagram: string): Promise<{
  svg?: string,
  error?: "kroki timed out" | "invalid syntax" | "kroki failed"
}> {
  try {
    const response = await racePromise(4000, fetch('https://kroki-mermaid.fly.dev/svg', {
      method: 'POST',
      body: diagram,
      headers: {
        'Content-Type': 'text/plain',
      },
    }));

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();

    if (data.includes("Syntax error in graph")) {
      return { error: "invalid syntax" };
    }

    return { svg: data };
  } catch (error) {
    console.error(
      `Error rendering or fetching svg: ${error}
      Mermaid diagram: ${diagram}
      `);

    if (error.message.includes("Promise timed out after")) {
      return { error: "kroki timed out" };
    } else {
      return { error: "kroki failed" };
    }
  }
}
