import type { VariantObject } from '@unocss/core'
import type { TagifyOptions } from './types'
import { MARKER } from './extractor'

export function variantTagify(options: TagifyOptions): VariantObject {
  const { extraProperties } = options
  const prefix = `${MARKER}${options.prefix ?? ''}`

  return {
    name: 'tagify',
    match(input) {
      if (!input.startsWith(prefix))
        return

      const matcher = input.slice(prefix.length)

      if (extraProperties) {
        return {
          matcher,
          handle: input => ({
            ...input,
            selector: input.selector.slice(MARKER.length + 1),
            entries: typeof extraProperties === 'function'
              ? [...input.entries, ...Object.entries(extraProperties(matcher) ?? {})]
              : [...input.entries, ...Object.entries(extraProperties)],
          }),
        }
      }

      return {
        matcher,
        handle: input => ({ ...input, selector: input.selector.slice(MARKER.length + 1) }),
      }
    },
  }
}
