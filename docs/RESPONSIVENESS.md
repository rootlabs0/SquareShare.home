# Responsiveness & Performance

## Grid Scaling Logic
The Bento Grid layout is designed to degrade gracefully across screen sizes, ensuring a seamless experience.

- **Desktop (Large Screens)**: 3 to 4 columns. Complex asymmetric arrangements (1x1, 2x1, 2x2).
- **Tablet (Medium Screens)**: 2 columns. Blocks naturally reflow to fit the constrained width.
- **Mobile (Small Screens)**: 1 column stacked. All blocks expand to 100% width for optimal legibility.

## Mobile UX Priorities
- **Touch Targets**: All interactive elements (buttons, inputs) must have a minimum touch target area of `48x48px` to ensure usability on mobile devices.
- **Input Fields**: Form fields should prevent automatic zoom on iOS by using a minimum font size of `16px`.

## Performance Constraints
- **Framer Motion**: Heavy animations, specifically the scroll-triggered pixel shatter effects, will be **disabled or significantly simplified on mobile devices**. This prevents scroll lag, battery drain, and poor performance on lower-tier hardware.
- Mobile experiences should rely on native scrolling and CSS transitions where possible.
