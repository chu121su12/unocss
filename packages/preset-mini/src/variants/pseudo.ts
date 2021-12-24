import type { CSSEntries, VariantFunction, VariantHandler, VariantObject } from '@unocss/core'
import { escapeRegExp, toArray } from '@unocss/core'
import type { PresetMiniOptions } from '..'

export const CONTROL_BYPASS_PSEUDO_CLASS = '$$no-pseudo'

export const PseudoClasses: Record<string, string | undefined> = Object.fromEntries([
  // location
  'any-link',
  'link',
  'visited',
  'target',

  // user action
  'hover',
  'active',
  'focus-visible',
  'focus-within',
  'focus',

  // input
  'autofill',
  'enabled',
  'disabled',
  'read-only',
  'read-write',
  'placeholder-shown',
  'default',
  'checked',
  'indeterminate',
  'valid',
  'invalid',
  'required',
  'optional',

  // tree-structural
  'root',
  'empty',
  ['even-of-type', 'nth-of-type(even)'],
  ['even', 'nth-child(even)'],
  ['odd-of-type', 'nth-of-type(odd)'],
  ['odd', 'nth-child(odd)'],
  'first-of-type',
  ['first', 'first-child'],
  'last-of-type',
  ['last', 'last-child'],
  'only-child',
  'only-of-type',
].map(toArray))

const PseudoElements = [
  'placeholder',
  'before',
  'after',
  'first-letter',
  'first-line',
  'selection',
]

const PartClassesRE = /(part-\[(.+)]:)(.+)/
const PseudoElementsRE = new RegExp(`^(${PseudoElements.join('|')})[:-]`)

const PseudoClassesStr = Object.keys(PseudoClasses).join('|')
const PseudoClassesRE = new RegExp(`^(${PseudoClassesStr})[:-]`)
const PseudoClassesNotRE = new RegExp(`^not-(${PseudoClassesStr})[:-]`)

function shouldAdd(entires: CSSEntries) {
  return !entires.find(i => i[0] === CONTROL_BYPASS_PSEUDO_CLASS) || undefined
}

function taggedPseudoClassMatcher(tag: string, parent: string, combinator: string) {
  const re = new RegExp(`^${tag}-((not-)?(${PseudoClassesStr}))[:-]`)
  const rawRe = new RegExp(`^${escapeRegExp(parent)}:`)
  return (input: string): VariantHandler | undefined => {
    const match = input.match(re)
    if (match) {
      let pseudo = PseudoClasses[match[3]] || match[3]
      if (match[2])
        pseudo = `not(:${pseudo})`
      return {
        matcher: input.slice(match[1].length + tag.length + 2),
        selector: (s, body) => {
          return shouldAdd(body) && rawRe.test(s)
            ? s.replace(rawRe, `${parent}:${pseudo}:`)
            : `${parent}:${pseudo}${combinator}${s}`
        },
      }
    }
  }
}

export const variantPseudoElements: VariantFunction = (input: string) => {
  const match = input.match(PseudoElementsRE)
  if (match) {
    return {
      matcher: input.slice(match[1].length + 1),
      selector: s => `${s}::${match[1]}`,
    }
  }
}

export const variantPseudoClasses: VariantObject = {
  match: (input: string) => {
    let match = input.match(PseudoClassesRE)
    if (match) {
      const pseudo = PseudoClasses[match[1]] || match[1]
      return {
        matcher: input.slice(match[1].length + 1),
        selector: (s, body) => shouldAdd(body) && `${s}:${pseudo}`,
      }
    }

    match = input.match(PseudoClassesNotRE)
    if (match) {
      const pseudo = PseudoClasses[match[1]] || match[1]
      return {
        matcher: input.slice(match[1].length + 5),
        selector: (s, body) => shouldAdd(body) && `${s}:not(:${pseudo})`,
      }
    }
  },
  multiPass: true,
}

export const variantTaggedPseudoClasses = (options: PresetMiniOptions = {}): VariantObject => ({
  match: (input: string) => {
    const attributify = !!options?.attributifyPseudo

    const g = taggedPseudoClassMatcher('group', attributify ? '[group=""]' : '.group', ' ')(input)
    if (g)
      return g

    const p = taggedPseudoClassMatcher('peer', attributify ? '[peer=""]' : '.peer', '~')(input)
    if (p)
      return p
  },
  multiPass: true,
})

export const partClasses: VariantObject = {
  match: (input: string) => {
    const match = input.match(PartClassesRE)
    if (match) {
      const part = `part(${match[2]})`
      return {
        matcher: input.slice(match[1].length),
        selector: (s, body) => {
          return shouldAdd(body) && `${s}::${part}`
        },
      }
    }
  },
  multiPass: true,
}