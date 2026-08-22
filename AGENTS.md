# Examples UI Changes

## Problem
All interfaces are different. In a web-component world they should
be exactly like eachother.

## Base
the Vanilla will be the base one for all the others because the viewport
shoudn't need a scroll.

1. Orbz on top left screen: ok
2. Label on top right side o the scree. Every example should display the same text "Vanilla Example, React Example and so on".
3. "Native Web Component" inside the card: Erase it! make the Orbz gain more space at the top
4. "Give your assistant a pulse." -> "One voice component. Every framework."
5. "One <orb-z>, driven entirely through its public attributes and properties—no framework required." -> "One <orb-z>, controlled directly from a standalone web-component."
6. Bellow the Orbz, react example wins: "Assistant is idle "space between" 300 px · 1.00×"
7. Svelte wins on the right aside: "Live controls Tune the behavior" and "Speak" button pn the right.
8. State: The vue approach.
9. "Orb size 320px Motion speed 1.00×" - Svelte wins, side by side, sliders.
10. 
```
Pause motion
Keep the current visual state

Elevated
Add a subtle, centered shadow

Reduced motion
Respect accessibility preferences
```
Here vanilla layout is the best.

11. "palette" prop will be called "preset" -> Vanilla example style (Remove the year and try one word color name).
12. Individual colors: Vanilla style (here we call "Custom palette").
13. Card content done.
14. content bellow the card: "Framework-native controls · Shadow DOM isolation · No adapter required" (CENTERED).
15. Check contrast ratio of background colors and text colors.
17. THE MOST IMPORTANT RULE (NON NEGOTIABLE). All examples interfaces should look like the same with the same instructions provided above. web-components follows this premiss. Only pure CSS allowed (they can share a "styles" folder with the same rules "DRY").
18. Last but not least. No text above the card like in "Next.js", "Svelte" and "Vue".

## Source organization

The canonical package source rules are defined in [`agents/rules/source-organization.md`](./agents/rules/source-organization.md).
