---
name: lfg-bri
description: Full workflow with quality gates — ask for goal, rewrite into a lab plan, set up a git branch, confirm, then execute using the Builder-Reviewer-Integrator workflow
argument-hint: "[optional: task description]"
---

# LFG-BRI

Like `/lfg` but every phase runs through a three-pass Builder-Reviewer-Integrator quality loop. Use this for complex features where polish matters more than speed.

## Workflow

### Step 1: Get the goal

If `$ARGUMENTS` is provided, use that as the raw task. Otherwise, use AskUserQuestion to ask:

**"What do you want to accomplish this session?"** — Free-text description of the goal.

### Step 2: Rewrite the task into a lab plan

Take the user's raw task and rewrite it into a structured laboratory plan:

1. **Restate the goal** in one clear sentence.
2. **Phase 1 — Instrumentation / Understanding**: Before touching any code, measure or fully understand the current state.
   - Building a benchmark harness (performance work)
   - Pulling and studying a design (UI work)
   - Reading and mapping existing code (refactors)
   - Documenting current behavior (bug fixes)
   - Record baselines or capture the "before" state.
3. **Phase 2 — Diagnosis / First Pass**: Analyze what was gathered. Identify key problems, differences, or unknowns. Form hypotheses or build a rough first attempt.
4. **Phase 3 — Iteration Loop**: Work through fixes/improvements one at a time. Re-measure after each change. Keep what works, revert what doesn't. Commit after each successful change.
5. **Phase 4 — Report / Verification**: Summarize with before/after evidence.
6. **Escape hatches**: Flag anything requiring a larger architectural change or user decision. Ask rather than guess.

Adapt phase names to the task domain.

### Step 3: Suggest a branch name

Based on the goal, suggest a branch name:
- Lowercase with hyphens: `feat/my-feature`, `fix/bug-name`, `chore/cleanup`
- Prefix with type: `feat/`, `fix/`, `chore/`, `refactor/`, `docs/`, `perf/`

### Step 4: Present plan and confirm

Present the rewritten lab plan and suggested branch name together. Ask:

**"Here's the plan and branch. Does this look good, or any adjustments before I start?"**

Wait for confirmation. Revise if requested.

### Step 5: Set up git branch

1. Run `git status` — if uncommitted changes exist, warn and ask whether to stash, commit, or proceed.
2. Run `git checkout -b <branch-name>`.
3. Confirm with `git branch --show-current`.

### Step 6: Execute with Builder-Reviewer-Integrator

For each phase in the lab plan, run the three-pass B-R-I loop:

#### Pass 1 — Builder

Focus: Get it working. Build the phase's deliverable.

- Use the `builder` subagent (Task tool, subagent_type: `builder`)
- Provide the phase goal and relevant context
- Don't overthink — just build

#### Pass 2 — Reviewer

Focus: Find problems. Do NOT make changes.

- Use the `reviewer` subagent (Task tool, subagent_type: `reviewer`)
- Review what the Builder produced
- Check for:
  - TypeScript errors and type safety
  - Logic bugs and edge cases
  - Missing error handling and loading states
  - Performance issues
  - Accessibility (ARIA, keyboard nav)
  - Code organization and reusability
  - Security issues (auth checks, validation)
- Output categorized feedback:
  1. **Critical Issues** (must fix)
  2. **Important Issues** (should fix)
  3. **Suggestions** (nice to have)

#### Pass 3 — Integrator

Focus: Produce the final polished version.

- Use the `integrator` subagent (Task tool, subagent_type: `integrator`)
- Provide both the Builder's implementation and the Reviewer's feedback
- Fix all critical issues, address important issues, incorporate valuable suggestions
- Commit after the Integrator finishes each phase

#### After the final phase

Run validation:
- Use `build-validator` subagent to verify the project builds
- Use `verify-app` subagent to confirm the app works at runtime

### Step 7: Summary

Print a final report:
- What was accomplished (goal restated)
- Phases completed
- Issues found and fixed by the Reviewer
- Build and verification status
- Branch name and commit count
