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
\`\`\`
graph TB
  U["User"] -- "File Operations" --> FO["File Operations"]
  U -- "Code Editor" --> CE["Code Editor"]
  FO -- "Manipulation of Files" --> FS["FileSystem"]
  FS -- "Write/Read" --> D["Disk"]
  FS -- "Compress/Decompress" --> ZL["ZipLib"]
  FS -- "Read" --> IP["INIParser"]
  CE -- "Create/Display/Edit" --> WV["Webview"]
  CE -- "Language/Code Analysis" --> VCA["VSCodeAPI"]
  VCA -- "Talks to" --> VE["ValidationEngine"]
  WV -- "Render UI" --> HC["HTMLCSS"]
  VE -- "Decorate Errors" --> ED["ErrorDecoration"]
  VE -- "Analyze Document" --> TD["TextDocument"]
\`\`\`

User asks: "Draw me a mindmap for beer brewing. Maximum of 4 nodes"
\`\`\`
graph TB
  B["Beer"]
  B --> T["Types"]
  B --> I["Ingredients"]
  B --> BP["Brewing Process"]
\`\`\`

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

\`\`\`
graph TB
  A["Web Browser"] -- "HTTP API Request" --> B["Load Balancer"]
  B -- "HTTP Request" --> C["Crossover"]
  C -- "Talks to" --> D["Redis"]
  C -- "Talks to" --> E["MySQL"]
  C -- "Downstream API Request" --> F["Multiplex"]
  F -- "Returns Job ID" --> C
  C -- "Long Poll API Request" --> G["Evaluator"]
  G -- "API Call" --> F
  G -- "API Call" --> H["Result-Fetcher"]
  H -- "Downloads Results" --> I["S3 or GCP Cloud Buckets"]
  I -- "Results Stream" --> G
  G -- "Results Stream" --> C
  C -- "API Response" --> A
\`\`\`

Sometimes you will need to revise the same diagram based on user feedback.
For the last example the user might make a followup request:

User followup ask:
"Crossover post processes the result and returns the API response to the client through the load balancer.

Draw the crossover node in green"

\`\`\`
query: "graph TB
  A["Web Browser"] -- "HTTP API Request" --> B["Load Balancer"]
  B -- "HTTP Request" --> C["Crossover"]
  style C fill:#99cc99
  C -- "Talks to" --> D["Redis"]
  C -- "Talks to" --> E["MySQL"]
  C -- "Downstream API Request" --> F["Multiplex"]
  F -- "Returns Job ID" --> C
  C -- "Long Poll API Request" --> G["Evaluator"]
  G -- "API Call" --> F
  G -- "API Call" --> H["Result-Fetcher"]
  H -- "Downloads Results" --> I["S3 or GCP Cloud Buckets"]
  I -- "Results Stream" --> G
  G -- "Results Stream" --> C
  C -- "API Response" --> B
  B -- "API Response" --> A
\`\`\`
`,
    "timeline": `
Examples:
User asks: "Generate a timeline visualisation illustrating the inception dates of major social media platforms such as LinkedIn, Facebook, Google, YouTube, and Twitter"
\`\`\`
timeline
  title Inception Dates of Major Social Media Platforms
  2002 : LinkedIn
  2004 : Facebook
  : Google
  2005 : Youtube
  2006 : Twitter
\`\`\`

User asks: "Show me a timeline of Industrial Revolution"
\`\`\`
timeline
  title Timeline of Industrial Revolution
  section 17th-20th century
    Industry 1.0 : Machinery, Water power, Steam power
    Industry 2.0 : Electricity, Internal combustion engine, Mass production
    Industry 3.0 : Electronics, Computers, Automation
  section 21st century
    Industry 4.0 : Internet, Robotics, Internet of Things
    Industry 5.0 : Artificial intelligence, Big data,3D printing
\`\`\`

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
\`\`\`
mindmap
  root((mindmap))
    Origins
      Long history
      Popularisation
        British popular psychology author Tony Buzan
    Research
      On effectiveness and features
      On Automatic creation
        Uses
            Creative techniques
            Strategic planning
            Argument mapping
    Tools
      Pen and paper
      Mermaid
\`\`\`
`,
    "state": `
Important rules when creating the state diagram in mermaid syntax:
- When making a choice between two or more paths prefer using <<choice>> than a node called Check

Examples:

Simple sample
\`\`\`
stateDiagram-v2
    [*] --> Still
    Still --> [*]

    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
\`\`\`

Choice
Sometimes you need to model a choice between two or more paths, you can do so using <<choice>>.
\`\`\`
stateDiagram-v2
    state if_state <<choice>>
    [*] --> IsPositive
    IsPositive --> if_state
    if_state --> False: if n < 0
    if_state --> True : if n >= 0
\`\`\`    
`,
    "user-journey": `
Examples:
\`\`\`
journey
    title My working day
    section Go to work
      Make tea: 5: Me
      Go upstairs: 3: Me
      Do work: 1: Me, Cat
    section Go home
      Go downstairs: 5: Me
      Sit down: 5: Me
\`\`\`
    `,
    "requirement": `
Syntax for requirement diagram in mermaid syntax:
- There are three types of components to a requirement diagram: requirement, element, and relationship.
- The grammar for defining each is defined below. Words denoted in angle brackets, such as <word>, are enumerated keywords that have options elaborated in a table. user_defined_... is use in any place where user input is expected.
- An important note on user text: all input can be surrounded in quotes or not. For example, both Id: "here is an example" and Id: here is an example are both valid. However, users must be careful with unquoted input. The parser will fail if another keyword is detected.

Requirement:
A requirement definition contains a requirement type, name, id, text, risk, and verification method. The syntax follows:
\`\`\`
<type> user_defined_name {
    id: user_defined_id
    text: user_defined text
    risk: <risk>
    verifymethod: <method>
}
\`\`\`

Type, risk, and method are enumerations defined in SysML:
Keyword | Options
Type | requirement, functionalRequirement, interfaceRequirement, performanceRequirement, physicalRequirement,
designConstraint
Risk | Low, Medium, High
VerificationMethod | Analysis, Inspection, Test, Demonstration

Element:
- An element definition contains an element name, type, and document reference. These three are all user defined. The element feature is intended to be lightweight but allow requirements to be connected to portions of other documents.
\`\`\`
element user_defined_name {
    type: user_defined_type
    docref: user_defined_ref
}
\`\`\`

Relationship:
- Relationships are comprised of a source node, destination node, and relationship type.
- Each follows the definition format of "{name of source} - <type> -> {name of destination}" or "{name of destination} <- <type> - {name of source}"
"name of source" and "name of destination" should be names of requirement or element nodes defined elsewhere.
- A relationship type can be one of contains, copies, derives, satisfies, verifies, refines, or traces.
- Each relationship is labeled in the diagram.
        

Examples:
\`\`\`
requirementDiagram
    requirement test_req {
    id: 1
    text: the test text.
    risk: high
    verifymethod: test
    }

    element test_entity {
    type: simulation
    }

    test_entity - satisfies -> test_req
\`\`\`
    `,
    gitgraph: `
Examples:

\`\`\
gitGraph
   commit
   commit
   branch develop
   checkout develop
   commit
   commit
   checkout main
   merge develop
   commit
   commit
\`\`\

Using custom commit id, also called commit messages:
\`\`\
gitGraph
   commit id: "Alpha"
   commit id: "Beta"
   commit id: "Gamma"
\`\`\
    `
  },
  "plantuml": {
    "use-case": `
Important rules when creating the use case diagram in plantuml syntax:
- Do not show underscores as spaces between the words, use a space instead. For example use "Online Shopping Website" instead of "Online_Shopping_Website"
- When connecting use cases with actors use the undirected edge like "e -- UC1". Don't connect an use case with another use case, avoid using "UC1 -- UC2".

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

Examples:
User asks: "Show me how a food critic can interact with a restaurant"
\`\`\`
@startuml
left to right direction
  actor "Food Critic" as fc
  rectangle Restaurant {
    usecase "Eat Food" as UC1
    usecase "Pay for Food" as UC2
    usecase "Write Review" as UC3
  }
  fc -- UC1
  fc -- UC2
  fc -- UC3
@enduml
\`\`\`
`
  },
  "d2": {
    "sequence": `
Examples:

\`\`\`
shape: sequence_diagram
alice -> bob: What does it mean\nto be well-adjusted?
bob -> alice: The ability to play bridge or\ngolf as if they were games.
\`\`\` 
`

  },
  "vegalite": {
    "bar-chart": `
Examples:
User asks: "Draw me a simple chart with embedded data"
\`\`\`
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "description": "A simple bar chart with embedded data.",
  "data": {
    "values": [
      {"a": "A", "b": 28},
      {"a": "B", "b": 55},
      {"a": "C", "b": 43},
      {"a": "D", "b": 91},
      {"a": "E", "b": 81},
      {"a": "F", "b": 53},
      {"a": "G", "b": 19},
      {"a": "H", "b": 87},
      {"a": "I", "b": 52}
    ]
  },
  "mark": "bar",
  "encoding": {
    "x": {"field": "a", "type": "nominal", "axis": {"labelAngle": 0}},
    "y": {"field": "b", "type": "quantitative"}
  }
}
\`\`\`
`
  }
}
