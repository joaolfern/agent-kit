---
name: adr
description: Use when a decision with lasting consequences is made or changed — choosing a platform, service, data model, API shape, caching or sync strategy, or reversing an earlier choice — to record it as a numbered architecture decision record in docs/architecture/decisions/. Also use when the user asks "why is it like this" and the answer should be written down.
---

# Architecture decision records

ADRs live in `docs/architecture/decisions/NNNN-kebab-title.md`, numbered in order, never renumbered. They answer "why does it look like this?" for the next person (or agent) who reads the code.

## When

- A choice that would be expensive to reverse, or that a newcomer would question: platform, storage, ownership of data, API contract, sync/caching strategy, a deliberate limitation.
- Not for routine implementation details; those belong in the code and commit messages.

## Format

```markdown
# 0007. Short decision as a noun phrase

- Status: accepted            (proposed | accepted | superseded by 0009)
- Date: YYYY-MM-DD

## Context

What forces are at play: the problem, constraints (limits, costs, privacy, deadlines), what the user needs. Facts, no decision yet.

## Decision

What we do, concretely: endpoints, status codes, storage keys, timings, limits. Bullets are fine. Concrete enough that the code can be checked against it.

## Consequences

What becomes true because of this, good and bad: trade-offs accepted, what is now harder, follow-ups. Name the fallback for failure cases.
```

## Rules

- One decision per record. Superseding: write a new ADR and set the old one's status to `superseded by NNNN`; don't rewrite history.
- Write for someone without this conversation: no "as discussed", no session references.
- Link the ADR from the code only where the code would otherwise look wrong (one short comment: `// ADR 0004: ranking counts unique visitors per day`).
- If the project has an architecture README or diagrams index, add the ADR there.
- Work the owner must do by hand (accounts, DNS, secrets, publishing) goes to `docs/owner-todo.md`, not into the ADR.
