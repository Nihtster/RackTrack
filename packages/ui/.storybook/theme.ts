import { create } from 'storybook/theming'
import { colors } from '../src/theme/colors'

// Storybook chrome and docs pages, matched to the RackTrack palette.
export const racktrackTheme = create({
  base: 'dark',
  brandTitle: 'RackTrack UI',

  appBg: colors.app,
  appContentBg: colors.app,
  appPreviewBg: colors.app,
  appBorderColor: colors.border,
  barBg: colors.surface,

  textColor: colors.ink,
  textMutedColor: colors.inkMuted,
  barTextColor: colors.inkMuted,
  barSelectedColor: colors.accentBright,

  colorPrimary: colors.accent,
  colorSecondary: colors.accent,

  inputBg: colors.surface,
  inputBorder: colors.border,
  inputTextColor: colors.ink,
})
