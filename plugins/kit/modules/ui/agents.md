## UI review (for agents without the ui-craft skills)

Before calling UI work done: screenshot every theme at ≈1280px and 375px, loading and loaded. Check that cards are visibly separated in each theme (border in light, luminance in dark), there are no nested cards, ≤2 type styles per component, focus is visible, hover changes border colour rather than position, and the loading → loaded swap moves nothing (compare `getBoundingClientRect()` or a performance trace's CLS).
