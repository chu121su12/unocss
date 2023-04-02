import { createGenerator } from '@unocss/core'
import { describe, expect, test } from 'vitest'
import presetMini from '@unocss/preset-mini'

describe('unocss generator', () => {
  test('generator can enable noMerge option', async () => {
    const uno = createGenerator({
      presets: [
        presetMini(),
      ],
    })

    const tokens = [
      'left-0',
      'active:left-0',
      'focus:left-0',
      'hover:left-0',
      'active:focus:left-0',
      'group-focus:left-0',
      'group-hover:left-0',
    ].join(' ')

    const { css: css1 } = await uno.generate(tokens, { preflights: false, noMerge: false })
    expect(css1).toMatchSnapshot()
    const { css: css2 } = await uno.generate(tokens, { preflights: false, noMerge: true })
    expect(css2).toMatchSnapshot()
  })
})
