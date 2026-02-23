---
name: lfg
description: Full workflow — ask for goal, rewrite it into a structured lab plan, set up a git branch, confirm, then execute
argument-hint: "[optional: task description]"
---

# LFG

Combines goal gathering, lab-style task rewriting, and git branch setup into one workflow. Ask once, plan properly, then go.

## Workflow

### Step 1: Get the goal

If `$ARGUMENTS` is provided, use that as the raw task. Otherwise, use AskUserQuestion to ask:

**"What do you want to accomplish this session?"** — Free-text description of the goal.

### Step 2: Rewrite the task into a lab plan

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

Adapt the phase names and specifics to the task domain. See examples below.

#### Example rewrites

**Performance optimization:**
- Phase 1 — Instrumentation: Build timing utilities, capture baseline metrics for critical paths.
- Phase 2 — Diagnosis: Analyze benchmarks, identify top 3-5 bottlenecks, write hypotheses, search for known library gotchas.
- Phase 3 — Iteration: Fix one bottleneck at a time, re-benchmark after each, commit successful changes.
- Phase 4 — Report: Generate before/after comparison with charts.

**Design implementation:**
- Phase 1 — Study: Pull the design from Figma MCP, understand layout, components, and visual details.
- Phase 2 — First Pass: Build a rough implementation. It will be wrong. That's expected.
- Phase 3 — Refinement Loop: Screenshot the implementation, compare to Figma source, list every difference (spacing, color, typography, radius, shadows, alignment), fix one by one, verify each fix.
- Phase 4 — Verification: Loop until no differences remain. Be obsessive about details.

**Bug fix:**
- Phase 1 — Reproduce: Set up a reliable reproduction. Document exact steps, expected vs actual behavior.
- Phase 2 — Diagnosis: Trace the code path, identify root cause, form a hypothesis for the fix.
- Phase 3 — Fix & Verify: Apply the fix, verify the reproduction case passes, check for regressions.
- Phase 4 — Report: Document what caused the bug and what fixed it.

**Refactoring:**
- Phase 1 — Map: Read and document the current architecture, dependencies, and test coverage.
- Phase 2 — Plan: Identify the target structure, break it into safe incremental steps.
- Phase 3 — Migrate: Execute one step at a time, run tests after each, commit after each green run.
- Phase 4 — Verify: Confirm all tests pass, no regressions, document the new structure.

### Step 3: Suggest a branch name

Based on the goal, suggest a branch name following these conventions:
- Lowercase with hyphens: `feat/my-feature`, `fix/bug-name`, `chore/cleanup`
- Prefix with type: `feat/`, `fix/`, `chore/`, `refactor/`, `docs/`, `perf/`
- Keep it short but descriptive

### Step 4: Present plan and confirm

Present everything together to the user for confirmation:
1. The rewritten lab plan (all phases)
2. The suggested branch name

Ask: **"Here's the plan and branch. Does this look good, or any adjustments before I start?"**

Wait for confirmation. If the user requests changes, revise and re-confirm.

### Step 5: Set up git branch

Once confirmed:

1. Run `git status` to check for uncommitted changes. If there are uncommitted changes:
   - Warn the user and ask if they want to stash, commit first, or proceed anyway.
2. Run `git checkout -b <branch-name>` to create and switch to the new branch.
3. Confirm success by running `git branch --show-current`.

### Step 6: Execute

Print a short launch summary:
- Session goal (one sentence)
- Branch name and base branch
- Phase count

Then execute the plan phase by phase. Use TodoWrite to track each phase as a task. Report progress between phases. Commit after each successful phase.

If you hit something that requires a larger architectural change or user decision, flag it and ask rather than guessing.
