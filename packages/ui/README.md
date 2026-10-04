# @racktrack/ui

Shared React components, theme tokens, and Storybook. Source-only: the web app
bundles it directly, there is no build step.

## Commands

```bash
pnpm storybook                              # from repo root, port 6006
pnpm --filter @racktrack/ui typecheck
pnpm --filter @racktrack/ui build-storybook
```

## Layout

- `src/<group>/Foo.tsx`: component
- `stories/<group>/Foo.stories.tsx`: its stories (kept out of `src`)
- `src/styles/theme.css`: design tokens (Tailwind `@theme`)
- `src/theme/colors.ts`: same palette as raw hex, for non-Tailwind contexts
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
5. **Native props.** Wrap native elements by extending
   `React.ComponentProps<'button'>` (etc.) and spreading the rest.
6. **Every component gets stories** covering each variant and state.

## Tailwind

Consumers must scan this package for classes. Web does so in `index.css`:

```css
@import "@racktrack/ui/theme.css";
@source "../../../packages/ui/src";
```
