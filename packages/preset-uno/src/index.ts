import type { Preset } from '@unocss/core'
import type { PresetMiniOptions, Theme } from '@unocss/preset-mini'
import { rules, shortcuts, theme, variants } from '@unocss/preset-wind'
import { preflights } from '@unocss/preset-mini'
import { variantColorMix } from './variants/mix'
import { listRule } from './rules/list'

export type { Theme }

export interface PresetUnoOptions extends PresetMiniOptions {}

export const presetUno = (options: PresetUnoOptions = {}): Preset<Theme> => {
  options.dark = options.dark ?? 'class'
  options.attributifyPseudo = options.attributifyPseudo ?? false
  options.preflight = options.preflight ?? true

  return {
    name: '@unocss/preset-uno',
    theme,
    rules: [
      ...rules,
      listRule,
    ],
    shortcuts,
    variants: [
      ...variants(options),
      variantColorMix,
    ],
    options,
    preflights: options.preflight ? preflights : [],
    prefix: options.prefix,
  }
}

export default presetUno
