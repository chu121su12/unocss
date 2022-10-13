import type { CSSEntries, Rule } from '@unocss/core'
import { handler as h } from '@unocss/preset-mini/utils'
import { varEmpty } from '@unocss/preset-mini/rules'

export const listRule: Rule
= [/^lists-(\d+)-(.+?)(?:-(\[.+?\]))?$/, ([, c, property, s]) => {
  const count = parseInt(c, 10)
  if (count > 0) {
    const arr = [...Array(count)]
    return [
      ...arr.map((_, i) => [`--un-${property}-${i + 1}`, varEmpty]),
      [property, arr.map((_, i) => `var(--un-${property}-${i + 1})`).join(h.bracket(s) ?? ', ')],
    ] as CSSEntries
  }
}]
