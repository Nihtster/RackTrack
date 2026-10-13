# @racktrack/ui

Shared React components, theme tokens, and Storybook. Source-only: the web app
bundles it directly, there is no build step.

## Commands

```bash
pnpm storybook                              # from repo root, port 6006
pnpm --filter @racktrack/ui typecheck
pnpm --filter @racktrack/ui build-storybook
```

## What belongs here

This package is **base components only**: nothing in it knows what a firearm,
round, ammo type, or route is. Everything arrives through props. Test: could it
drop into an unrelated app unchanged? If so it belongs here.

Product-specific components (`FirearmForm`, a "Total Rounds" dashboard tile, the
firearms table) live in `apps/web`: `src/components/` when several pages use
them, next to the page (`pages/<area>/`) when one does. They compose these base
components. Promote one to this package once two or more pages use it and no
domain knowledge is left in it.

## Layout

- `src/<group>/Foo.tsx`: component, flat inside its group. Groups:
  - `core/`: controls and small primitives (Button, Badge, ToggleGroup, Menu, Tooltip)
  - `layout/`: structure and surfaces (Card, StatTile, PageHeader)
  - `nav/`: navigation (Sidebar, Tabs)
  - `feedback/`: loading and empty states (Spinner, Loading, Skeleton, EmptyState)
  - `forms/`: Field (label, hint, error wiring), Input, Textarea, Select, SearchInput, Calendar, RangeCalendar, DatePicker, DateRangePicker
  - `data/`: Table (sortable headers, empty state), Pagination, ProgressBar
  - add `overlays/` as those components land
- `stories/<group>/Foo.stories.tsx`: its stories (kept out of `src`); the
  Storybook title uses the same group (`Core/Button`)
- `src/hooks/`: shared internals (e.g. `useRovingSelection`), not exported
- `src/styles/theme.css`: design tokens (Tailwind `@theme`)
- `src/theme/colors.ts`: same palette as raw hex, for non-Tailwind contexts
- `src/theme/control.ts`: shared sizing, focus ring, and disabled style for
  interactive controls (Button, ToggleGroup, ...). New controls should reuse it
  so heights line up.
- `src/theme/intent.ts`: shared tinted status colors (neutral, accent, success,
  warning, critical) for non-solid elements like Badge
- Public API: everything must be exported from `src/index.ts`

## Rules

1. **No app dependencies.** Never import from `apps/web`, the router, or app
   data/types. Lint enforces this. Pass data, links, and handlers as props.
2. **Tokens, not raw palette.** Use `text-ink`, `bg-surface`, `border-border`,
   `text-accent`, etc. from `theme.css`, not `slate-*` / hex. Need a new color?
   Add a token in `theme.css` and `colors.ts` together.
3. **`className` passthrough.** Accept `className` and apply it last via
   `cn(defaults, className)` so consumers can override. `cn` is exported.
4. **Refs.** React 19: take `ref` as a normal prop, no `forwardRef`.
5. **Native props.** Wrap native elements by extending their props type
   (e.g. `ButtonHTMLAttributes<HTMLButtonElement>`) and spreading the rest.
6. **Every component gets stories** covering each variant and state.

## Sizes

Components that come in sizes use `sm` / `md` / `lg`. Controls (Button,
ToggleGroup) share `theme/control.ts`; Card and StatTile have their own scale,
with `lg` the original roomy layout and `md` the default. Sizes are explicit
props; container-query driven sizing can be layered on later if clusters of
components need to adapt to their container.

## Menu vs Select

`Menu` is a list of actions opened from a trigger (row "⋯", split-button
chevron, user menu); picking an item runs it and nothing stays selected. A
control that holds a chosen value in a form is a `Select` (form fields), not a
`Menu`.

## Dark-mode extensions

Extensions like Dark Reader can recolor the translucent badge tints. Whitelist
Storybook and the app in the extension rather than changing component styles.

## Tailwind

Consumers must scan this package for classes. Web does so in `index.css`:

```css
@import "@racktrack/ui/theme.css";
@source "../../../packages/ui/src";
```
