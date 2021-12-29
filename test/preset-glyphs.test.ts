import { createGenerator } from '@unocss/core'
import presetGlyphs from '@unocss/preset-glyphs'
import presetUno from '@unocss/preset-uno'
import { describe, expect, test } from 'vitest'

describe('preset-glyphs', () => {
  const fixture1 = `
<button class="g-fontname-uno hover:g-fontname-cs">unocss</button>
`

  const uno = createGenerator({
    presets: [
      presetGlyphs({
        fonts: {
          fontname: '', //
        },
      }),
      presetUno(),
    ],
  })

  test('fixture1', async() => {
    const { css, layers } = await uno.generate(fixture1)
    expect(layers).toEqual(['glyphs', 'default'])
    expect(css).toMatchSnapshot()
  })
})
