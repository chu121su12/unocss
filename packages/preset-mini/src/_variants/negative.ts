import type { Variant } from '@unocss/core'
import { getStringComponent } from '@unocss/rule-utils'
import { CONTROL_MINI_NO_NEGATIVE, cssMathFnRE } from '../utils'

const numberRE = /-?[0-9.]+(?:[a-z]+|%)?/

const ignoreProps = [
  /\b(opacity|color|flex|backdrop-filter|^filter|transform)\b/,
]

function negateMathFunction(value: string) {
  const match = value.match(cssMathFnRE)
  if (match) {
    const [fnBody, rest] = getStringComponent(`(${match[2]})${match[3]}`, '(', ')', ' ') ?? []
    if (fnBody)
      return `calc(${match[1]}${fnBody} * -1)${rest ? ` ${rest}` : ''}`
  }
}

const negateFunctionBodyRE = /\b(hue-rotate|translate[XYZ]|rotate[XYZ]|scale[XYZ]|skew[XY])\s*(\(.*)/
function negateFunctionBody(value: string) {
  const match = value.match(negateFunctionBodyRE)
  if (match) {
    const [fnBody, rest] = getStringComponent(match[2], '(', ')', ' ') ?? []
    if (fnBody) {
      const body = numberRE.test(fnBody)
        ? fnBody.replace(numberRE, i => i.startsWith('-') ? i.slice(1) : `-${i}`)
        : `(calc(${fnBody} * -1))`
      return `${match[1]}${body}${rest ? ` ${rest}` : ''}`
    }
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
          if (ignoreProps.some(i => i.test(v[0])))
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
          if (numberRE.test(value)) {
            v[1] = value.replace(numberRE, i => i.startsWith('-') ? i.slice(1) : `-${i}`)
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
