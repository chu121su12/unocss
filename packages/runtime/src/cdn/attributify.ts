import presetUno from '@unocss/preset-uno'
import presetAttributify from '@unocss/preset-attributify'
import init from '../index'
import { warnOnce } from '@unocss/core'

(() => {
  warnOnce('Using attributify build directly is deprecated. Please refer to the docs on how to use presets.')
  init({
    defaults: {
      presets: [
        presetUno(),
        presetAttributify(),
      ],
    },
  })
})
