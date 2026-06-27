# Agent Instructions — Square Share

Read this before touching the codebase. It encodes the house style and a set of guardrails against the ways AI coding agents typically go wrong. Follow it even when the request doesn't mention it.

---

## 1. Project at a glance

- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · framer-motion + GSAP · Supabase (waitlist) · deployed on Cloudflare Pages (`@cloudflare/next-on-pages`).
- **What it is:** a single marketing/landing page with a waitlist. It is not an app with routing-heavy flows. Keep it lean.
- **Brand:** pure-black surfaces (`#000000`), one accent — electric purple `#a855f7` (the `acid` token). Fonts: Space Grotesk (display), Inter (sans), JetBrains Mono (mono). Sharp corners (`--radius: 0rem`), pixel/grid motif.

Run before declaring anything done:
```bash
npm run lint
npm run build
```

---

## 2. Writing & copy style (applies to UI text, comments, commits, docs)

- **No em dashes (—).** Do not use them anywhere: not in copy, not in comments, not in commit messages. Use a period, a comma, or parentheses. Rewrite the sentence if needed. (Em dashes are a tell of machine-written text and the user does not want them.)
- No en dashes (–) as a substitute either. For ranges write "10 to 20" or "10-20" with a hyphen.
- Avoid the "It's not just X, it's Y" construction and other LLM tics ("In today's fast-paced world", "Let's dive in", "robust", "seamless", "elevate", "unlock", "leverage" as a verb, "delve").
- Don't open headings or sentences with filler. Say the thing.
- Sentence case for UI labels and headings unless the brand explicitly uses another case. Match what's already on the page.
- Keep marketing copy concrete. No vague superlatives. If a claim can't be backed, cut it.
- American spelling, Oxford comma, straight quotes in code; curly quotes only in rendered copy if the rest of the page uses them.

---

## 3. Visual & design rules

- **No ugly gradients.** Specifically banned:
  - Rainbow / multi-hue gradients (purple to pink to orange, etc.).
  - High-contrast diagonal "stripe" gradients that band visibly.
  - Gray-to-transparent fades that turn muddy on black.
  - Any gradient added as decoration with no purpose.
- Gradients are allowed **only** when they are subtle and on-brand: black to near-black, or a low-opacity wash of the single `acid` purple. The existing `gradient-wave-text` and `SoftAurora` are the reference for "tasteful." Match their restraint or don't add one.
- **One accent color.** Purple `#a855f7` is the only chroma. Do not introduce new brand colors (no teal, no blue, no green) without being asked. Everything else is black / white / gray.
- Respect existing design tokens in [globals.css](src/app/globals.css) and the `@theme` block. Use `var(--color-acid)`, `bg-background`, `text-foreground`, etc. Do not hardcode hex values that duplicate a token.
- Keep corners sharp (`--radius: 0rem`) unless a component already rounds.
- **Motion:** always honor `prefers-reduced-motion`. Every animation must have a reduced-motion fallback (see the existing `@media (prefers-reduced-motion: reduce)` rule). No autoplaying motion that can't be stopped. No layout shift from animation.
- No drop shadows beyond the established `--shadow-btn-glow`. No glassmorphism, no neumorphism, no emoji in UI unless the design already uses them.
- Maintain WCAG AA contrast. White text on black is fine; gray-on-black must stay readable. Don't put purple text on black at small sizes.

---

## 4. AI failure modes — and how to avoid them here

These are the documented, recurring ways coding agents produce bad output. Each has a rule.

### 4.1 Inventing things that don't exist (hallucination)
- Do not import packages, components, hooks, env vars, or Tailwind classes that you have not confirmed exist. Check [package.json](package.json) and the actual files first.
- Do not invent Supabase columns, table names, or API shapes. Read [src/lib/supabase.ts](src/lib/supabase.ts) and [src/app/api/waitlist/route.ts](src/app/api/waitlist/route.ts) before changing waitlist logic.
- If you're unsure whether an API/prop exists, grep for it. Don't guess and hope.

### 4.2 Overconfidence / claiming success without checking
- Never say "done", "fixed", or "this works" unless you ran `npm run build` (and `npm run lint`) and they passed. If you couldn't run them, say so explicitly.
- Report failures honestly. If the build breaks or a test fails, show the output. Do not paper over it.
- Distinguish what you verified from what you assume.

### 4.3 Scope creep / doing too much
- Change only what the task asks for. Do not refactor, rename, reformat, or "improve" unrelated code in the same pass.
- Do not reformat whole files (no mass quote/indent changes) — it buries the real diff and breaks blame.
- Don't add dependencies to solve something the existing stack already handles. We already have framer-motion, GSAP, radix-ui, shadcn, lucide icons, sonner. Use them before reaching for something new.
- If you spot a real adjacent problem, mention it; don't silently fix it.

### 4.4 Sycophancy / agreeing with bad ideas
- If the user asks for something that will break the build, hurt accessibility, leak a secret, or contradict this file, say so and propose the better path. Don't just comply.
- "You're absolutely right" is not a substitute for being right. Push back when the facts warrant it.

### 4.5 Lost context / forgetting constraints
- Re-read this file's rules before large changes. The no-em-dash and single-accent rules apply to every edit, not just the first one.
- Match the conventions of the file you're editing (imports style, `cn()` helper from [src/lib/utils.ts](src/lib/utils.ts), component structure) rather than your defaults.

### 4.6 Security & secrets
- Never hardcode Supabase keys, tokens, or any secret. Use env vars. `NEXT_PUBLIC_*` is shipped to the browser — only public keys go there; service-role keys never do.
- Don't commit `.env*` files. Validate and sanitize anything that reaches the waitlist endpoint.
- Don't log PII (email addresses) to the console in production paths.

### 4.7 Plausible-but-wrong code
- Prefer the boring, correct solution over the clever one. Clever code is where subtle agent bugs hide.
- Handle the empty / loading / error states for any async UI (waitlist submit). Don't ship only the happy path.
- Watch React 19 / Next 16 specifics: Server vs Client Components (`"use client"`), no hooks in server components, `async` server components are fine. Don't add `"use client"` to a file that doesn't need it.

### 4.8 Performance regressions
- This is a landing page; it must stay fast. No giant client bundles, no shipping GSAP/framer to a component that only needs CSS.
- Lazy-load heavy/below-the-fold visuals. Don't load animation libs for static sections.
- Use `next/image` for raster images. Don't ship unoptimized large assets.

---

## 5. Code conventions

- TypeScript strict. No `any` unless genuinely unavoidable, and comment why if so.
- Use the `cn()` class merger; don't concatenate class strings by hand.
- Co-locate component-specific CSS the way existing files do (e.g. `SideRays.tsx` + `SideRays.css`).
- Keep components focused. The `howItWorks/` folder shows the pattern: split a section into small pieces under a named folder.
- Prefer Tailwind utilities over new CSS. Add to `globals.css` only for things utilities can't express (keyframes, complex gradients-text).
- Don't leave commented-out code, `console.log`, or TODO debris in committed work.

---

## 6. Before you finish — checklist

- [ ] No em dashes anywhere in the diff (copy, comments, commit message).
- [ ] No new gradients unless subtle, single-hue, and purposeful.
- [ ] No new brand colors beyond the purple accent.
- [ ] `prefers-reduced-motion` handled for any new motion.
- [ ] `npm run lint` clean.
- [ ] `npm run build` succeeds.
- [ ] Diff is scoped to the request; no drive-by reformatting.
- [ ] No secrets, no `.env` committed, no PII logged.
- [ ] Async UI handles loading + error + empty states.
- [ ] You stated honestly what you did and did not verify.
