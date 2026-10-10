---
name: ui-craft
description: Use when building, restyling or reviewing any user interface (web or app, any stack) — a new screen, component, card, list, form, theme, dark mode, empty state or landing section — so the result reads as deliberately designed instead of generic AI output. Covers surfaces and light/dark themes, card nesting, anti-AI patterns, typography, interaction states and layout stability.
---

# UI craft

Rules learned shipping real products, each with the reason behind it. They are stack-agnostic: they talk about roles (page, surface, raised, floating) rather than a CSS framework.

Before building, read the references that apply. They are short; read the whole file, not a skim.

| Working on | Read |
|---|---|
| Any card, panel, list item, sidebar, modal, dropdown, theme or dark mode | `references/surfaces-and-themes.md`, `references/nesting.md` |
| Anything new, or anything that "looks AI-made" | `references/anti-ai-patterns.md` |
| Titles, labels, text hierarchy | `references/typography.md` |
| Hover, focus, selection, motion | `references/interaction.md` |
| Anything that loads data, counts, images, or variable-length text | `references/layout-stability.md`, then the `loading-skeletons` skill if a placeholder is involved |

## Working order

1. **Reuse first.** Look in the project's generic components and tokens before writing a control or a colour. A new hex or pixel value in a component is a smell: add or reuse a token.
2. **Decide the surface map** before styling: which role (page, surface, raised, floating) each region takes, in every theme. Most "ugly" UIs are a muddled surface map.
3. **Write the real content first.** Real labels, real lengths, the longest plausible name. Lorem ipsum hides wrapping and hierarchy problems.
4. **Cut.** Remove every label, divider, icon and box that doesn't carry information. Then remove one more.
5. **Verify in a real browser** with the `ui-review` skill: every theme, desktop and phone width, loading and loaded. JSDOM and reading CSS can't judge aesthetics.

For a brand-new product or screen that needs an aesthetic direction (palette, typeface, personality), use the `frontend-design` skill for direction, then apply these rules to execute it.
