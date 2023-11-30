import presetMini from '@unocss/preset-mini'
import presetAttributify from '@unocss/preset-attributify'
import init from '../index'
import { warnOnce } from '@unocss/core'

(() => {
  warnOnce('Using the mini build directly is deprecated. Please refer to the docs on how to use presets.')
  init({
    defaults: {
      presets: [
        presetMini(),
        presetAttributify(),
      ],
    },
  })
})
