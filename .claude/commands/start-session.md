---
name: start-session
description: Ask for session goal, create a new branch, and switch to it
argument-hint: "[optional: branch name]"
---

# Start Session

Initialize a new working session by clarifying the goal and setting up a fresh git branch.

## Workflow

### Step 1: Ask for the session goal

Use AskUserQuestion to ask the user:

1. **What is the goal of this session?** — Free-text description of what they want to accomplish.
2. **Branch name** — If `$ARGUMENTS` is provided, use that as the branch name. Otherwise, suggest a branch name based on their goal (e.g., `feat/add-auth`, `fix/resume-export-bug`) and let them confirm or change it.

### Step 2: Verify clean working state

Run `git status` to check for uncommitted changes. If there are uncommitted changes:
- Warn the user and ask if they want to stash changes before switching, commit them first, or proceed anyway.

### Step 3: Create and switch to the new branch

1. Run `git checkout -b <branch-name>` to create and switch to the new branch from the current branch.
2. Confirm success by running `git branch --show-current`.

### Step 4: Summarize

Print a short summary:
- Session goal
- Branch name
- Base branch it was created from
- Any stashed changes (if applicable)

Wish the user good luck and remind them they can use `/commit` when ready to save progress.

## Branch Naming Conventions

- Use lowercase with hyphens: `feat/my-feature`, `fix/bug-name`, `chore/cleanup`
- Prefix with type: `feat/`, `fix/`, `chore/`, `refactor/`, `docs/`
- Keep it short but descriptive

## Success Criteria

- [ ] Session goal is captured
- [ ] Branch is created and checked out
- [ ] User is on the new branch and ready to work
