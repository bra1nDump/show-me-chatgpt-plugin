import { DiagramType } from "../utils";

export const diagramTypeGuidelines = {
  "graph": `
Guidelines when creating the graph diagram in any diagram language:
- Avoid linear diagrams when possible, diagrams should be hierarchical and have multiple branches when applicable.
- Don't add the label if its the same as the destination node.
`,
  "use-case": `
Guidelines when creating the use case diagram in any diagram language:
- Start with a strong verb: Each use case should be named starting with a strong, active verb to make it clear what action is being performed. Examples include "Withdraw Funds", "Open Account", and "Register Student". Avoid weak verbs like "process", "perform", or "do".
- Focus on user perspective: Make sure to create use cases like "Book Flight Ticket" rather than "Execute Flight Booking Function". The former provides a clear, user-oriented perspective that makes it easier for stakeholders to relate to the use case.
- Imply Timing Considerations: While use case diagrams don't depict chronological order, arranging use cases to hint at typical sequence can enhance readability. For example, a banking system might show "Open Account" above "Deposit Funds", "Withdraw Funds", and "Close Account", indicating common timing.
- Identify actors: Clearly identifying who interacts with the system is vital. For instance, in a Library Management System, actors might include "Borrower", "Librarian", or "Book Supplier" instead of just generic terms like "User" or "Supplier".
- Associate each actor with use cases: Every actor involved in the system should correspond with at least one use case, and every use case should be connected to at least one actor.
- Avoid depicting interactions between actors: Avoid allowing actors to engage directly with each other. The specifics of how two actors interact should be documented in the use case text, rather than being visually represented.
- Add time actor for regular events: If events happen periodically, introduce an actor called "Time". This indicates when certain actions are triggered in the system. For instance, in a payroll system, the "Time" actor could initiate the "Issue Paychecks" use case, demonstrating this happens at regular intervals, like every two weeks.
- Use <<system>> for system actors: In diagrams reflecting architectural decisions, use the <<system>> stereotype for system actors. For example, label a payment system as <<system>> Payment Processor to highlight it as a system entity, not a human or organization. This isn't suitable for technology-independent diagrams.
- Use system boundary box: Enclose all use cases within a rectangular boundary box, inside it the use cases should be placed vertically from top to bottom
`,
  "timeline-diagram": `
A timeline is a kind of graphical representation that lays out the sequence of events, dates, or spans of time. Generally, it visually demonstrates the progression of time and is arranged in sequential order. At its most basic level, a timeline displays a series of occurrences organized based on their occurrence dates. Furthermore, a timeline is an effective tool for illustrating connections between events, such as the interrelation of various life events of an individual.
`,
  "mindmap": `
A mind map is a diagram used to visually organize information into a hierarchy, showing relationships among pieces of the whole. It is often created around a single concept, drawn as an image in the center of a blank page, to which associated representations of ideas such as images, words and parts of words are added. Major ideas are connected directly to the central concept, and other ideas branch out from those major ideas
`
} as const satisfies Partial<Record<DiagramType, string>>

