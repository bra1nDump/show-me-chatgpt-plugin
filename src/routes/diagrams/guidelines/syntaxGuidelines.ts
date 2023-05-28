import { DiagramLanguage, DiagramType } from "../utils";

export const syntaxGuidelines: Partial<Record<DiagramLanguage, Partial<Record<DiagramType, string>>>> = {
  "mermaid": {
    "graph": `
Important rules when creating the graph diagram in mermaid syntax:
- Prefer using graph TB types of diagrams.
- Never use the ampersand (&) symbol in the diagram, it will break the diagram. Use the word "and" instead. For example use "User and Admin" instead of "User & Admin".
- Never use round brackets () in the node identifiers, node labels and edge labels, it will break the diagram. Use a coma instead. For example use "User, Admin" instead of "User (Admin)".
- Don't use empty labels "" for edges, instead don't label the edge at all. For example U["User"] --> A["Admin"].

Rules when using graph diagrams in mermaid syntax:
- Use short node identifiers, for example U for User or FS for File System.
- Always use double quotes for node labels, for example U["User"].
- Always use double quotes for edge labels, for example U["User"] -- "User enters email" --> V["Verification"].
- Indentation is very important, always indent according to the examples below.

Rules when using graph diagrams with subgraphs in mermaid syntax:
Never refer to the subgraph root node from within the subgraph itself.

For example this is wrong subgraph usage:
\`\`\`
graph TB
  subgraph M["Microsoft"]
    A["Azure"]
    M -- "Invested in" --> O
  end
  
  subgraph O["AI"]
    C["Chat"]
  end
\`\`\`

In this diagram M is referenced from within the M subgraph, this will break the diagram.
Never reference the subgraph node identifier from within the subgraph itself.
Instead move any edges that connect the subgraph with other nodes or subgraphs outside of the subgraph like so.

Correct subgraph usage:
\`\`\`
graph TB
  subgraph M["Microsoft"]
    A["Azure"]
  end

  M -- "Invested in" --> O
  
  subgraph O["OpenAI"]
    C["ChatGPT"]
  end
\`\`\`

Examples:
User asks: "Show me how vscode internals work."
Your call to the api:
{
  query: "graph TB\\n  U[\\"User\\"] -- \\"File Operations\\" --> FO[\\"File Operations\\"]\\n  U -- \\"Code Editor\\" --> CE[\\"Code Editor\\"]\\n  FO -- \\"Manipulation of Files\\" --> FS[\\"FileSystem\\"]\\n  FS -- \\"Write/Read\\" --> D[\\"Disk\\"]\\n  FS -- \\"Compress/Decompress\\" --> ZL[\\"ZipLib\\"]\\n  FS -- \\"Read\\" --> IP[\\"INIParser\\"]\\n  CE -- \\"Create/Display/Edit\\" --> WV[\\"Webview\\"]\\n  CE -- \\"Language/Code Analysis\\" --> VCA[\\"VSCodeAPI\\"]\\n  VCA -- \\"Talks to\\" --> VE[\\"ValidationEngine\\"]\\n  WV -- \\"Render UI\\" --> HC[\\"HTMLCSS\\"]\\n  VE -- \\"Decorate Errors\\" --> ED[\\"ErrorDecoration\\"]\\n  VE -- \\"Analyze Document\\" --> TD[\\"TextDocument\\"]\\n"
}

User asks: "Draw me a mindmap for beer brewing. Maximum of 4 nodes"
Your call to the api:
{
  query: "graph TB\\n  B[\"Beer\"]\\n  B --> T[\"Types\"]\\n  B --> I[\"Ingredients\"]\\n  B --> BP[\"Brewing Process\"]"
}

User asks:
"Computing backend data services is a distributed system made of multiple microservices.

A web browser sends an HTTP api request to the load balancer.
The load balancer sends the http request to the crossover service.
Crossover talks to redis and mysql database.
Crossover makes a downstream API request to multiplex to submit the query which returns a job id to crossover.
Then crossover makes a long poll API request to evaluator to get the results of the job.
Then evaluator makes an API call to multiplex to check the status of the job.
Once evaluator gets a successful status response from multiplex, then evaluator makes a third API call to result-fetcher service to download the job results from S3 or GCP cloud buckets.
The result is streamed back through evaluator to crossover.

Crossover post processes the result and returns the API response to the client.

Draw me a diagram of this system"

Your call to the api:
{
  query: "graph TB\\n  A[\\"Web Browser\\"] -- \\"HTTP API Request\\" --> B[\\"Load Balancer\\"]\\n  B -- \\"HTTP Request\\" --> C[\\"Crossover\\"]\\n  C -- \\"Talks to\\" --> D[\\"Redis\\"]\\n  C -- \\"Talks to\\" --> E[\\"MySQL\\"]\\n  C -- \\"Downstream API Request\\" --> F[\\"Multiplex\\"]\\n  F -- \\"Returns Job ID\\" --> C\\n  C -- \\"Long Poll API Request\\" --> G[\\"Evaluator\\"]\\n  G -- \\"API Call\\" --> F\\n  G -- \\"API Call\\" --> H[\\"Result-Fetcher\\"]\\n  H -- \\"Downloads Results\\" --> I[\\"S3 or GCP Cloud Buckets\\"]\\n  I -- \\"Results Stream\\" --> G\\n  G -- \\"Results Stream\\" --> C\\n  C -- \\"API Response\\" --> A\\n"
}

Sometimes you will need to revise the same diagram based on user feedback.
For the last example the user might make a followup request:

User followup ask:
"Crossover post processes the result and returns the API response to the client through the load balancer.

Draw the crossover node in green"

Your call to the api:
{
  query: "graph TB\\n  A[\\"Web Browser\\"] -- \\"HTTP API Request\\" --> B[\\"Load Balancer\\"]\\n  B -- \\"HTTP Request\\" --> C[\\"Crossover\\"]\\n  style C fill:#99cc99\\n  C -- \\"Talks to\\" --> D[\\"Redis\\"]\\n  C -- \\"Talks to\\" --> E[\\"MySQL\\"]\\n  C -- \\"Downstream API Request\\" --> F[\\"Multiplex\\"]\\n  F -- \\"Returns Job ID\\" --> C\\n  C -- \\"Long Poll API Request\\" --> G[\\"Evaluator\\"]\\n  G -- \\"API Call\\" --> F\\n  G -- \\"API Call\\" --> H[\\"Result-Fetcher\\"]\\n  H -- \\"Downloads Results\\" --> I[\\"S3 or GCP Cloud Buckets\\"]\\n  I -- \\"Results Stream\\" --> G\\n  G -- \\"Results Stream\\" --> C\\n  C -- \\"API Response\\" --> B\\n  B -- \\"API Response\\" --> A\\n"
}
`,
    "timeline": `
Examples:
User asks: "Generate a timeline visualisation illustrating the inception dates of major social media platforms such as LinkedIn, Facebook, Google, YouTube, and Twitter"
Your call to the api:
{
  diagram: "timeline\\n    title Inception Dates of Major Social Media Platforms\\n    2002 : LinkedIn\\n    2004 : Facebook\\n    : Google\\n    2005 : Youtube\\n    2006 : Twitter\\n"
}

User asks: "Show me a timeline of Industrial Revolution"
Your call to the api:
{
  diagram: "timeline\\n    title Timeline of Industrial Revolution\\n    section 17th-20th century\\n        Industry 1.0 : Machinery, Water power, Steam power\\n        Industry 2.0 : Electricity, Internal combustion engine, Mass production\\n        Industry 3.0 : Electronics, Computers, Automation\\n section 21st century\\n        Industry 4.0 : Internet, Robotics, Internet of Things\\n        Industry 5.0 : Artificial intelligence, Big data,3D printing\\n" 
}
Description: You can group time periods in sections/ages. This is done by adding a line with the keyword section followed by the section name. All subsequent time periods will be placed in this section until a new section is defined. If no section is defined, all time periods will be placed in the default section.
    `,
    "mindmap": `
Rules when using mindmap diagrams in mermaid syntax:
- Mermaid mindmaps can show nodes using different shapes. When specifying a shape for a node the syntax is similar to flowchart nodes, with an id followed by the shape definition and with the text within the shape delimiters. Where possible try to keep the same shapes as for flowcharts, even though they are not all supported from the start.

- Mindmap can show the following shapes:
\`\`\`
mindmap
    id[I am a square]
    id(I am a rounded square)
    id((I am a circle))
    id))I am a bang((
    id)I am a cloud(
    id{{I am a hexagon}}
    I am the default shape
\`\`\` 

- The "Markdown Strings" feature enhances mind maps by offering a more versatile string type, which supports text formatting options such as bold and italics, and automatically wraps text within labels.
\`\`\`
mindmap
    id1["\`**Root** with
a second line
Unicode works too: 🤓\`"]
      id2["\`The dog in **the** hog... a *very long text* that wraps to a new line\`"]
      id3[Regular labels still works]
\`\`\` 

- Formatting: For bold text, use double asterisks ** before and after the text. For italics, use single asterisks * before and after the text. With traditional strings, you needed to add tags for text to wrap in nodes. However, markdown strings automatically wrap text when it becomes too long and allows you to start a new line by simply using a newline character instead of a tag.
 
Examples:
User asks: "Show me a mindmap about a mindmap"
Your call to the api:
{
  diagram: "mindmap\\n  root((mindmap))\\n    Origins\\n      Long history\\n      Popularisation\\n        British popular psychology author Tony Buzan\\n    Research\\n      On effectiveness and features\\n      On Automatic creation\\n        Uses\\n            Creative techniques\\n            Strategic planning\\n            Argument mapping\\n    Tools\\n      Pen and paper\\n      Mermaid"
}
    `
  },
  "plantuml": {
    "use-case": `
Important rules when creating the use case diagram in plantuml syntax:
- Do not show underscores as spaces between the words, use a space instead. For example use "Online Shopping Website" instead of "Online_Shopping_Website"

Tips when using the use case diagram in plantuml syntax:
- Prefer using "left to right direction" to make the diagram more readable, it makes the diagram separate into three columns. The left column must contain actors like clients or customers who purchase goods or services. The central column should contain the use cases. The right column must contain actors that make the organization work like employees, managers or systems. To make the actors in the left or the right side of the three columns, in the following example, the employee "e" is in the left column (e -- UC4) but the manager "b" and the payroll system "ps" are in the right column(UC1 -- ps, UC3 -- b):
\`\`\`
@startuml
left to right direction
rectangle "Payroll Processing" { 
usecase "Calculate Pay" as UC1
usecase "Issue Paycheck" as UC2
usecase "Deposit Paycheck" as UC3
usecase "Receive Paycheck" as UC4
}
actor "Employee" as e
actor "Payroll System" as ps <<system>>
actor "Manager" as b
UC1 -- ps 
UC2 -- ps  
UC3 -- b
e -- UC4
@enduml
\`\`\`

- When connecting use cases with actors use the undirected edge like "e -- UC1". Don't connect an use case with another use case, avoid using "UC1 -- UC2".

   
Examples:
User asks: "Show me how a food critic can interact with a restaurant"
Your call to the api:
{
  diagram: "@startuml\\n left to right direction\\n actor \\"Food Critic\\" as fc\\n rectangle Restaurant {\\n usecase \\"Eat Food\\" as UC1\\n usecase \\"Pay for Food\\" as UC2\\n usecase \\"Drink\\" as UC3\\n }\\n fc -- UC1\\n fc -- UC2\\n fc -- UC3\\n @enduml"
}
`
  },
  "d2": {
    "sequence": `
Examples:

\`\`\`
shape: sequence_diagram
alice -> bob: What does it mean\\nto be well-adjusted?
bob -> alice: The ability to play bridge or\\ngolf as if they were games.
\`\`\` 
`

  },
  "vegalite": {
    "bar-chart": `
Examples:
User asks: "Draw me a simple chart with embedded data"
Your call to the api:
{
  query: "{"$schema": "https://vega.github.io/schema/vega-lite/v5.json",\\n "description": "description",\\n "data": {\\n "values": [\\n {"a": "A", "b": 28}, {"a": "B", "b": 55}, {"a": "C", "b": 43},\\n {"a": "D", "b": 91}, {"a": "E", "b": 81}, {"a": "F", "b": 53},\\n {"a": "G", "b": 19}, {"a": "H", "b": 87}, {"a": "I", "b": 52}\\n ]\\n },\\n "mark": "bar",\\n "encoding": {\\n "x": {"field": "a", "type": "nominal", "axis": {"labelAngle": 0}},\\n "y": {"field": "b", "type": "quantitative"}\\n }\\n }"
}     `
  }
}
