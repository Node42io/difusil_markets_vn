# CLAUDE.md — Project instructions for the @node42/ui-kit

React + TypeScript UI Kit generated from a Figma design system.
Components: `src/components/<Name>/{<Name>.tsx, <Name>.module.css, <Name>.stories.tsx, index.ts}`.
Tokens: `src/styles/tokens.css` — 3 levels (brand → alias → mapped). **Never invent tokens.** If a needed color/space/type isn't mapped, stop and ask the user which existing token to use.

Storybook is the canonical playground (`npm run storybook` → http://localhost:6006). Build with `npm run build`, typecheck with `npm run typecheck`, lint with `npm run lint`.

---

## Component validation workflow (MANDATORY)

**Trigger:** every time a component under `src/components/` is created or modified, run the loop below **before** declaring the work done or proposing a commit.

The loop spawns a 2-agent team and iterates with Playwright until the implementation matches the Figma source.

### Step 0 — Anchor on Figma
- Read the user's current Figma selection via the Figma Dev Mode MCP: design context, variable definitions, and a reference screenshot.
- If no frame is selected, **stop and ask** which Figma node is the target. Do not guess.
- Save the reference screenshot to `tests/visual/__figma__/<Component>-<variant>.png` for diffing.

### Step 1 — Spawn the team (in parallel, single message, two `Agent` calls)

**Agent A — Front-end expert** (`subagent_type: claude`, name: `fe-expert`)
- Persona: senior React/TS engineer who knows this repo's conventions (CSS Modules, token usage, CSF stories, `index.ts` re-exports, `src/index.ts` barrel).
- Input: paths to current component files + the Figma context payload (variables, screenshot, layout/spec) collected in Step 0.
- Output: a prioritized diff list — spacing, color tokens, typography, radii, shadows, states (default/hover/focus-visible/active/disabled), props API, a11y attributes. Each item names the Figma value and the code value.

**Agent B — QA tester, bad mood** (`subagent_type: claude`, name: `qa-grumpy`)
- Persona: hostile, sarcastic QA who assumes the dev cut corners. No praise, blunt language, never satisfied until nothing breaks.
- Task: drive **Playwright** against Storybook:
  1. Ensure Storybook is running at http://localhost:6006 (start it in the background if not).
  2. For every story variant of the component, navigate to its iframe URL and screenshot at 1×, then hover/focus/active/disabled.
  3. Compare each screenshot against the Figma reference in `tests/visual/__figma__/`. Save diffs to `tests/visual/__diff__/`.
  4. Check a11y basics: role, accessible name, keyboard reachability (`Tab`/`Shift+Tab`/`Enter`/`Space`), visible focus ring, contrast on text vs background.
- Output: a ruthless bug report — one entry per defect with story name, selector, screenshot path, "Figma says X / code renders Y". If genuinely perfect, the report is the single line: `"fine, I couldn't break it."`

### Step 2 — Merge & apply
- Apply every Figma-grounded item from Agent A and every blocker from Agent B.
- Skip Agent B's nits only when they conflict with a Figma-grounded fix from Agent A (note the skip).

### Step 3 — Loop
Re-run Steps 0–2 until **both**: Agent A returns zero diffs AND Agent B's report is `"fine, I couldn't break it."`

### Stopping conditions
- Both agents empty → done. Propose a commit.
- Same finding survives 3 iterations → stop and surface it to the user; do not silently give up.
- Figma source unavailable, ambiguous, or no selection → stop and ask.
- A fix would require a new design token → stop and ask the user which existing token to use.

---

## Playwright bootstrap (first run only)

Playwright isn't a dev dependency yet. When the loop first needs it:

```
npm i -D @playwright/test pixelmatch pngjs
npx playwright install --with-deps chromium
```

Lay out:
- `tests/visual/<Component>.spec.ts` — Playwright spec per component.
- `tests/visual/__figma__/` — reference screenshots from Figma (committed).
- `tests/visual/__diff__/` — diff output (gitignored).
- `playwright.config.ts` at repo root, `baseURL: 'http://localhost:6006'`.

The published package already restricts `files` to `dist/`, so `tests/` won't ship to npm.

---

## House rules (do not violate)
- One folder per component; always add a `.stories.tsx` covering every variant/state visible in Figma.
- Re-export new components from `src/index.ts`.
- CSS Modules only; class names lowercase-kebab; all values come from `tokens.css`.
- Never add tokens autonomously — ask first.
- Don't cite MCP tool names in user-facing messages (say "reading from the selection", not "calling get_design_context").
- Italian or English in chat: follow the user's last message.
