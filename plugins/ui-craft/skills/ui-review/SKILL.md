---
name: ui-review
description: Use before calling any UI change done, after a redesign, or when the user says something "looks off", "ugly", "AI-looking" or "idk what's wrong" — a real-browser review pass with screenshots in every theme and at phone width, a layout-shift check, and the ui-craft rules as a checklist.
---

# UI review

JSDOM and reading CSS can't judge how a page looks. This pass uses a real browser (Chrome DevTools MCP; Playwright MCP as a fallback).

## 1. Capture

1. Use the user's running dev server if there is one; otherwise start one in the background on a free port (with mocks if the project has them). Headless unless the user asked to watch.
2. For each changed screen, take screenshots:
   - every theme the app has (switch through the app's own toggle or its stored preference, not by editing CSS)
   - desktop (≈1280px) and phone (375px, `emulate` or `resize_page`)
   - loading state and loaded state, plus empty and error states if the change touches them
3. Look at the screenshots yourself before reading any code. Describe what a person would notice first.

## 2. Check

Walk this list against the screenshots; open the matching `ui-craft` reference when something fails.

- **Surfaces:** every region has one clear role (page/surface/raised/floating). Cards are visibly separated in *each* theme: by border in light, by luminance in dark. Floating layers are opaque.
- **Nesting:** no card inside a card; at most page → surface → raised.
- **Anti-AI:** no eyebrow + number + subtitle stats; ≤2 type styles per component; no decorative gradients/emoji/icon circles; one primary action.
- **Type:** titles balanced, no orphans; long real content clamps instead of overflowing.
- **States:** focus visible (keyboard Tab through it), hover changes border not position, touch targets ≥44px.
- **Stability:** the swap from loading to loaded doesn't move anything (trace or bounding boxes); counts don't flash 0; no horizontal scroll at 375px.
- **Tokens:** the diff adds no raw hex/pixel values in components.

## 3. Report and fix

- List concrete findings with the screenshot they came from, most visible first. Fix them, re-capture, and compare.
- Ignore console noise unrelated to the change (font preload races, third-party scripts, network warnings).
- Stop any server you started and delete screenshots you saved inside the repo.
