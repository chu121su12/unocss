import { warnOnce } from '@unocss/core'
import type { Rule, RuleContext } from '@unocss/core'
import type { Theme } from '../theme'
import { h } from '../utils'

const directions: Record<string, string> = {
  '': '',
  'x': 'column-',
  'col': 'column-',
  'y': 'row-',
  'row': 'row-',
}

function handleGap([, d = '', s]: string[], { theme }: RuleContext<Theme>) {
  const v = theme.spacing?.[s] ?? h.bracket.cssvar.global.rem(s)
  if (v != null) {
    return {
      [`${directions[d]}gap`]: v,
    }
  }
}

export const gaps: Rule[] = [
  [/^(?:flex-|grid-)?gap-?()(.+)$/, handleGap, { autocomplete: ['gap-$spacing', 'gap-<num>'] }],
  [/^(?:flex-|grid-)?gap-([xy])-?(.+)$/, (...args) => {
    warnOnce('The rule gap with x/y modifier is deprecated and will be removed in future version. Please use the col/row modifier instead')
    return handleGap(...args)
  }, { autocomplete: ['gap-(x|y)-$spacing', 'gap-(x|y)-<num>'] }],
  [/^(?:flex-|grid-)?gap-(col|row)-?(.+)$/, handleGap, { autocomplete: ['gap-(col|row)-$spacing', 'gap-(col|row)-<num>'] }],
]
