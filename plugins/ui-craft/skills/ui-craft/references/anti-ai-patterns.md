# Patterns that make UI look AI-generated

If you are about to write one of these, stop and do the alternative.

## The stat card trio

- **Don't:** an uppercase letter-spaced eyebrow label, over a big number, over a muted subtitle. The label and the subtitle almost always restate each other ("TOTAL VISITS / 1,204 / visits this month").
- **Do:** one number and one short description ("1,204 visits this month"). Stop there.

## Too many type styles

- Keep a component to **one or two** font sizes/weights. Don't introduce an extra size, weight, letter-spacing or uppercase just to label something.
- If a piece of text needs a label to be understood, rewrite the text so it doesn't. "Status: Active" → "Active".

## Decoration standing in for design

- No gradients, glows, emoji, or icon-per-heading by default. Use them only when they carry meaning or are part of a chosen brand direction.
- No icon inside a tinted circle beside every list item or feature.
- No "hero + three feature cards + testimonial grid + CTA band" landing template unless the content really is that.

## Loud by default

- Prefer neutral over alarming: a low-key action ("report a problem") is a neutral control, not red. Red is for destructive or failed.
- One primary action per view. Secondary actions are one neutral control (e.g. a single "Share" that opens the options), so they don't compete with the primary.
- Don't put a badge, chip or pill on everything. A chip is for something the user can act on or filter by.

## Generic copy

- Labels describe the user's thing in their words; never "Lorem", "Item 1", "Welcome to your dashboard".
- Buttons say what happens ("Send for review"), not "Submit" or "OK".
- Empty states say what is missing and what to do next, in one line, with the action right there.

## Forms

- Don't add `gap`/vertical margins on the form or on input wrappers; vertical rhythm comes from the field component itself, so every form spaces identically.
- Reserve the error/help line's height so fields below never jump when a message appears.
