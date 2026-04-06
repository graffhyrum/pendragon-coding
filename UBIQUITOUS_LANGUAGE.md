# Ubiquitous Language

## Quality and verification

| Term                   | Definition                                                                                       | Aliases to avoid                   |
| ---------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------- |
| **Quality Gate** (new) | A mandatory check that must pass with exit code 0 before work is considered complete.            | Non-blocking check, optional check |
| **Escalation** (new)   | A required explicit handoff to the user when an issue cannot be auto-fixed safely.               | Ignore, defer silently             |
| **Issue** (new)        | A concrete defect or warning in code quality, typing, formatting, or tests that requires action. | Noise, acceptable warning          |

## Work tracking and delivery

| Term                  | Definition                                                                                             | Aliases to avoid               |
| --------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------ |
| **Bead** (new)        | The smallest independently executable unit of tracked engineering work in this repo workflow.          | Task blob, misc ticket         |
| **Changeset** (new)   | A versioning entry that records release-impacting changes for changelog and publish flow.              | Release note stub, random note |
| **Post-mortem** (new) | A structured retrospective artifact that captures outcomes, failures, and improvements from a session. | Debrief note, diary            |

## Agent workflow

| Term                  | Definition                                                                                       | Aliases to avoid       |
| --------------------- | ------------------------------------------------------------------------------------------------ | ---------------------- |
| **Session** (new)     | One bounded assistant-user interaction timeline with shared context and outputs.                 | Chat blob, run         |
| **Subagent** (new)    | A delegated specialized executor used to convert complex work into explicit actionable outputs.  | Helper bot, side task  |
| **Code Review** (new) | A risk-first evaluation of changes focused on regressions, security, correctness, and test gaps. | Quick scan, style pass |

## Relationships

- A **Session** may produce zero or more **Beads**, **Changesets**, and **Post-mortems**.
- Every **Bead** should satisfy all **Quality Gates** before close.
- An **Issue** either gets fixed directly or moved to **Escalation**.
- A **Code Review** should validate **Quality Gate** outcomes and surface unresolved **Issue** items.

## Example dialogue

> **Dev:** "This **Bead** passes locally, can I close it?"
> **Domain expert:** "Only after every **Quality Gate** passes with zero output."
> **Dev:** "I found a flaky warning I cannot auto-fix."
> **Domain expert:** "Log it as an **Issue** and raise an **Escalation** with concrete options."
> **Dev:** "Should that go into this **Session** notes?"
> **Domain expert:** "Yes, then capture final decisions in the **Post-mortem**."

## Flagged ambiguities

- "review" is overloaded; use **Code Review** for code risk analysis and avoid using "review" alone.
- "issue" is overloaded between tracker items and defects; use **Bead** for tracker work unit and **Issue** for concrete quality defect.
- "session" can mean terminal process or assistant timeline; use **Session** only for assistant-user workflow context.
