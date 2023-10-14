import type { Variant } from '@unocss/core'
import { getStringComponent } from '@unocss/rule-utils'
import { CONTROL_MINI_NO_NEGATIVE, cssMathFnRE } from '../utils'
import { numberWithUnitRE } from '../_utils/handlers/regex'

const ignoreProps = [
  /\b(opacity|color|flex|backdrop-filter|^filter|transform)\b/,
]

function negateMathFunction(value: string) {
  const match = value.match(cssMathFnRE)
  if (match) {
    const [fnBody, rest] = getStringComponent(match[2], '(', ')', ' ') ?? []
    if (fnBody)
      return `calc(${match[1]}${fnBody} * -1)${rest ? ` ${rest}` : ''}`
  }
}

const negateFunctionBodyRE = /\b(hue-rotate|translate[XYZ]|rotate[XYZ]|scale[XYZ]|skew[XY])\s*(\(.*)/
function negateFunctionBody(value: string) {
  const match = value.match(negateFunctionBodyRE)
  if (match) {
    const [fnBody, rest] = getStringComponent(match[2], '(', ')', ' ') ?? []
    if (fnBody)
      return `${match[1]}(calc(${fnBody} * -1))${rest ? ` ${rest}` : ''}`
  }
}

export const variantNegative: Variant = {
  name: 'negative',
  match(matcher) {
    if (!matcher.startsWith('-'))
      return

    return {
      matcher: matcher.slice(1),
      body: (body) => {
        if (body.find(v => v[0] === CONTROL_MINI_NO_NEGATIVE))
          return
        let changed = false
        body.forEach((v) => {
          const value = v[1]?.toString()
          if (!value || value === '0')
            return
          if (ignoreProps.some(i => v[0].match(i)))
            return
          const negatedFn = negateMathFunction(value)
          if (negatedFn) {
            v[1] = negatedFn
            changed = true
            return
          }
          const negatedBody = negateFunctionBody(value)
          if (negatedBody) {
            v[1] = negatedBody
            changed = true
            return
          }
          if (numberWithUnitRE.test(value)) {
            v[1] = value.replace(numberWithUnitRE, i => `-${i}`)
            changed = true
          }
        })
        if (changed)
          return body
        return []
      },
    }
  },
}
