---
name: start-lab
description: Rewrite a vague task into a structured, phased laboratory approach before executing it
argument-hint: "[optional: task description]"
---

# Start Lab

Transform vague or ambitious tasks into structured, measurable laboratory workflows — then execute them.

## Workflow

### Step 1: Get the task

If `$ARGUMENTS` is provided, use that as the raw task. Otherwise, use AskUserQuestion to ask:

**"What do you want to accomplish?"** — Free-text description of the goal.

### Step 2: Rewrite the task

Take the user's raw task and rewrite it into a structured laboratory plan. The rewrite must follow this pattern:

1. **Restate the goal** in one clear sentence.
2. **Phase 1 — Instrumentation / Understanding**: Before touching any code, build the ability to measure or fully understand the current state. This could mean:
   - Building a benchmark harness (for performance work)
   - Pulling and studying a design (for UI work)
   - Reading and mapping the existing code (for refactors)
   - Documenting current behavior (for bug fixes)
   - Record baselines or capture the "before" state.
3. **Phase 2 — Diagnosis / First Pass**: Analyze what was gathered. Identify the key problems, differences, or unknowns. Form hypotheses or build a rough first attempt. This is expected to be imperfect.
4. **Phase 3 — Iteration Loop**: Work through fixes/improvements one at a time. After each change, re-measure or re-compare against the baseline. Keep what works, revert what doesn't. Commit after each successful change.
5. **Phase 4 — Report / Verification**: Summarize what was done with before/after evidence. This could be a performance report, side-by-side screenshots, a diff summary, or a test suite.
6. **Escape hatches**: Flag anything that requires a larger architectural change or user decision. Ask rather than guess.

Adapt the phase names and specifics to the task domain. The examples below show how different types of tasks get rewritten.

#### Example rewrites

**Performance optimization task:**
- Phase 1 — Instrumentation: Build timing utilities, capture baseline metrics for critical paths.
- Phase 2 — Diagnosis: Analyze benchmarks, identify top 3-5 bottlenecks, write hypotheses, search for known library gotchas.
- Phase 3 — Iteration: Fix one bottleneck at a time, re-benchmark after each, commit successful changes.
- Phase 4 — Report: Generate before/after comparison with charts.

**Design implementation task:**
- Phase 1 — Study: Pull the design from Figma MCP, understand layout, components, and visual details.
- Phase 2 — First Pass: Build a rough implementation. It will be wrong. That's expected.
- Phase 3 — Refinement Loop: Screenshot the implementation, compare to Figma source, list every difference (spacing, color, typography, radius, shadows, alignment), fix one by one, verify each fix.
- Phase 4 — Verification: Loop until no differences remain. Be obsessive about details.

**Bug fix task:**
- Phase 1 — Reproduce: Set up a reliable reproduction of the bug. Document exact steps, expected vs actual behavior.
- Phase 2 — Diagnosis: Trace the code path, identify root cause, form a hypothesis for the fix.
- Phase 3 — Fix & Verify: Apply the fix, verify the reproduction case passes, check for regressions.
- Phase 4 — Report: Document what caused the bug and what fixed it.

**Refactoring task:**
- Phase 1 — Map: Read and document the current architecture, dependencies, and test coverage.
- Phase 2 — Plan: Identify the target structure, break it into safe incremental steps.
- Phase 3 — Migrate: Execute one step at a time, run tests after each, commit after each green run.
- Phase 4 — Verify: Confirm all tests pass, no regressions, document the new structure.

### Step 3: Confirm with user

Present the rewritten plan to the user. Format it clearly with the phases. Ask: **"Does this plan look good? Any adjustments before I start?"**

Wait for confirmation. If the user requests changes, revise and re-confirm.

### Step 4: Execute

Once confirmed, execute the plan phase by phase. Use TodoWrite to track each phase as a task. Report progress between phases.
