# Contributing

Thanks for helping improve the Glubean docs.

This docs repo accepts community contributions, but not every kind of change should start as a pull request. The rule is simple:

- Open PRs for accuracy and clarity
- Open issues first for structure and direction

## Good direct PRs

These are usually safe to submit directly:

- typos, grammar, wording cleanup
- broken links
- outdated commands or file paths
- incorrect code samples
- missing prerequisites or missing setup steps
- small clarifications that help a page read faster
- FAQ additions tied to a real user confusion

## Open an issue first

Please open an issue before writing code for changes like these:

- top-level navigation changes
- homepage or landing page rewrites
- new top-level sections
- major IA changes
- product positioning or comparison language
- large multi-page rewrites

These changes affect how users understand the product, so they need alignment before implementation.

## What we optimize for

The docs are intentionally opinionated. We optimize for:

- fast time to first successful verification
- a task-first reading path
- VS Code extension as the primary entry point
- Node-first workflows
- minimal duplication across pages

## Writing rules

When editing docs, keep these rules in mind:

- One page should answer one main question.
- Start with what the page helps the user do.
- Put steps before rationale.
- Prefer the shortest runnable example over the most complete example.
- Link to canonical pages instead of re-explaining the same concept.
- Keep the default workflow aligned with the current product:
  - local entry point: VS Code extension
  - project init: `npx @glubean/cli init`
  - project config: `package.json` with a `glubean` field

## Local development

Install dependencies:

```bash
npm install
```

Run the docs site locally:

```bash
npm run dev
```

Run checks before opening a PR:

```bash
npm run check:links
npm run build
```

If `next build` is slow on your machine, at minimum run `npm run check:links` and mention that you did not run the full build.

## Pull request expectations

A good PR should make it obvious:

- what changed
- why it changed
- which user confusion or failure it fixes
- whether it changes product direction or only improves clarity

If your change affects screenshots, navigation, or user flows, include a short explanation in the PR.

## Review policy

We generally merge PRs that:

- improve correctness
- reduce ambiguity
- preserve the task-first structure
- keep examples aligned with the current Node-based workflow

We may close or redirect PRs that introduce a different documentation direction without prior discussion.

## Community standards

Be respectful, specific, and user-focused. If you are unsure whether something should be a PR or an issue, open an issue first.
