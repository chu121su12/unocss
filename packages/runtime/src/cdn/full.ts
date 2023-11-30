import presetAttributify from '@unocss/preset-attributify'
import presetUno from '@unocss/preset-uno'
import presetTypography from '@unocss/preset-typography'
import presetTagify from '@unocss/preset-tagify'
import init from '../index'
import { warnOnce } from '@unocss/core'

(() => {
  warnOnce('Using the full build directly is deprecated. Please refer to the docs on how to use presets.')
  init({
    defaults: {
      presets: [
        presetAttributify(),
        presetUno(),
        presetTypography(),
        presetTagify(),
      ],
    },
  })
})

