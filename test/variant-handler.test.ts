import { createGenerator } from '@unocss/core'
import { describe, expect, it } from 'vitest'
import { variantMatcher } from '@unocss/preset-mini/utils'

describe('variants', () => {
  it('variant context is propagated', async () => {
    const uno = createGenerator({
      rules: [
        ['foo', { name: 'bar' }],
      ],
      variants: [
        {
          match(input) {
            const match = input.match(/^var:/)
            if (match) {
              return {
                matcher: input.slice(match[0].length),
                handle: (input, next) => next({
                  prefix: ':prefix > ',
                  selector: '.selector',
                  pseudo: '::pseudo',
                  entries: input.entries.map((entry) => {
                    entry[1] += ' !important'
                    return entry
                  }),
                  parent: '@supports',
                  layer: 'variant',
                }),
              }
            }
          },
        },
      ],
    })

    const { css } = await uno.generate([
      'foo',
      'var:foo',
    ].join(' '), { preflights: false })

    expect(css).toMatchSnapshot()
  })

  it('selector section is merged in order', async () => {
    const uno = createGenerator({
      rules: [
        ['foo', { name: 'bar' }],
      ],
      variants: [
        variantMatcher('pre', () => ({ prefix: '.prefix ' })),
        variantMatcher('main', () => ({ selector: '.replaced' })),
        variantMatcher('back', () => ({ pseudo: '::pseudo' })),
      ],
    })

    const { css } = await uno.generate([
      'pre:main:foo',
      'pre:back:foo',
      'main:back:foo',
      'pre:main:back:foo',
      'back:main:pre:foo',
    ].join(' '), { preflights: false })

    expect(css).toMatchSnapshot()
  })

  it('noMerge on variant', async () => {
    const uno = createGenerator({
      rules: [
        ['foo', { name: 'bar' }],
      ],
      variants: [
        {
          match(input) {
            const match = input.match(/^(var-([abc])):/)
            if (match) {
              return {
                matcher: input.slice(match[0].length),
                handle: (input, next) => next({
                  ...input,
                  pseudo: `${input.pseudo}::${match[2]}`,
                  noMerge: match[2] === 'c',
                }),
              }
            }
          },
        },
      ],
    })

    const { css } = await uno.generate([
      'foo',
      'var-a:foo',
      'var-b:foo',
      'var-c:foo',
    ].join(' '), { preflights: false })

    expect(css).toMatchSnapshot()
  })

  it('noMerge variant with shortcut', async () => {
    const uno = createGenerator({
      rules: [
        ['foo', { name: 'bar' }],
      ],
      shortcuts: [
        ['bar', 'var-a:foo var-b:foo var-c:foo'],
      ],
      variants: [
        {
          match(input) {
            const match = input.match(/^(var-([abc])):/)
            if (match) {
              return {
                matcher: input.slice(match[0].length),
                handle: (input, next) => next({
                  ...input,
                  pseudo: `${input.pseudo}::${match[2]}`,
                  noMerge: match[2] === 'c',
                }),
              }
            }
          },
        },
      ],
    })

    const { css } = await uno.generate([
      'bar',
    ].join(' '), { preflights: false })

    expect(css).toMatchSnapshot()
  })

  it('selector match can be ordered', async () => {
    const uno = createGenerator({
      rules: [
        ['foo', { name: 'bar' }],
      ],
      variants: [
        variantMatcher('pre', () => ({ selector: '.gone' })),
        {
          ...variantMatcher('pre', () => ({ selector: '.override' })),
          order: -1,
        },
      ],
    })

    const { css } = await uno.generate([
      'pre:foo',
    ].join(' '), { preflights: false })

    expect(css).toMatchSnapshot()
  })
})
