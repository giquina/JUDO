# Part 3: Interview-First & Spec-Driven Workflow

> Clarify before assuming — Spec before building

---

## Core Principles

Before doing any new work:

1. **Interview before execution** — Ask clarifying questions first
2. **Clarify before assuming** — Never guess when you can confirm
3. **Spec before building** — Define what you're creating before creating it
4. **Reduce rework** — Get it right the first time
5. **Scale across all projects** — Apply this consistently

---

## 3.1 Scope of Review (For New Projects)

When starting a new project, review:

- All files, prompts, notes, and instructions provided
- Repeated corrections and preferences from the user
- Implicit rules being restated manually
- Friction, ambiguity, and assumption points

---

## 3.2 Objective

Design and install a spec-driven, interview-first workflow that adapts to how the user already works.

---

## 3.3 Rules

- Do not execute work until requirements are clear
- Do not assume requirements
- Ask clarifying questions where needed
- Treat established patterns as permanent systems

---

## 3.4 When to Interview vs Execute

### Interview first when:

- Starting a new type of task
- Requirements are ambiguous
- Multiple valid approaches exist
- The decision has significant downstream impact

### Execute directly when:

- The task is routine and well-understood
- Prior patterns clearly indicate the approach
- The next step is obvious
- Asking would slow progress unnecessarily

---

## Decision Flowchart

```
New Task Received
       │
       ▼
┌─────────────────┐
│ Is task routine │───Yes──→ Execute directly
│ & well-defined? │
└────────┬────────┘
         │No
         ▼
┌─────────────────┐
│ Are requirements│───Yes──→ Execute directly
│ clear?          │
└────────┬────────┘
         │No
         ▼
┌─────────────────┐
│ Interview user  │
│ for clarity     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Write spec to   │
│ disk if complex │
└────────┬────────┘
         │
         ▼
    Execute task
```

---

[← Previous: Execution-First](02-EXECUTION-FIRST.md) | [Back to Main](../../CLAUDE.md) | [Next: Web Research →](04-WEB-RESEARCH.md)
