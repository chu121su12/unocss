import type { Variant } from '@unocss/core'
import { getBracket, h, variantGetBracket, variantGetParameter } from '../utils'

export const variantSelector: Variant = {
  name: 'selector',
  match(matcher, ctx) {
    const variant = variantGetBracket('selector-', matcher, ctx.generator.config.separators)
    if (variant) {
      const [match, rest] = variant
      const selector = h.bracket(match)
      if (selector) {
        return {
          matcher: rest,
          handle: input => ({ ...input, selector }),
        }
      }
    }
  },
}

export const variantCssLayer: Variant = {
  name: 'layer',
  match(matcher, ctx) {
    const variant = variantGetParameter('layer-', matcher, ctx.generator.config.separators)
    if (variant) {
      const [match, rest] = variant
      const layer = h.bracket(match) ?? match
      if (layer) {
        return {
          matcher: rest,
          handle: input => ({
            ...input,
            parent: `${input.parent ? `${input.parent} $$ ` : ''}@layer ${layer}`,
          }),
        }
      }
    }
  },
}

export const variantInternalLayer: Variant = {
  name: 'uno-layer',
  match(matcher, ctx) {
    const variant = variantGetParameter('uno-layer-', matcher, ctx.generator.config.separators)
    if (variant) {
      const [match, rest] = variant
      const layer = h.bracket(match) ?? match
      if (layer) {
        return {
          matcher: rest,
          layer,
        }
      }
    }
  },
}

export const variantScope: Variant = {
  name: 'scope',
  match(matcher, ctx) {
    const variant = variantGetBracket('scope-', matcher, ctx.generator.config.separators)
    if (variant) {
      const [match, rest] = variant
      const scope = h.bracket(match)
      if (scope) {
        return {
          matcher: rest,
          handle: input => ({ ...input, selector: `${scope} $$ ${input.selector}` }),
        }
      }
    }
  },
}

export const variantVariables: Variant = {
  name: 'variables',
  match(matcher, ctx) {
    if (!matcher.startsWith('['))
      return

    const [match, rest] = getBracket(matcher, '[', ']') ?? []
    if (!(match && rest))
      return

    let newMatcher: string | undefined
    for (const separator of ctx.generator.config.separators) {
      if (rest.startsWith(separator)) {
        newMatcher = rest.slice(separator.length)
        break
      }
    }

    if (newMatcher == null)
      return

    const variant = h.bracket(match) ?? ''
    const useParent = variant.startsWith('@')
    if (!(useParent || variant.includes('&')))
      return

    return {
      matcher: newMatcher,
      handle(input) {
        const updates = useParent
          ? {
              parent: `${input.parent ? `${input.parent} $$ ` : ''}${variant}`,
            }
          : {
              selector: variant.replace(/&/g, input.selector),
            }
        return {
          ...input,
          ...updates,
        }
      },
    }
  },
  multiPass: true,
}
