import { mergeDeep } from '@unocss/core'
import { expect, test } from 'vitest'

test('utils object mergeDeep', () => {
  expect(mergeDeep({}, {})).eql({})
  expect(mergeDeep({ a: 1 }, { a: 2 })).eql({ a: 2 })
  expect(mergeDeep({ a: { b: 1, c: 2 } }, { a: { b: 3 } })).eql({ a: { b: 3, c: 2 } })
  expect(mergeDeep({ a: { b: 1, c: 2 } }, { a: () => ({ c: 3 }) })).eql({ a: { c: 3 } })
  expect(mergeDeep({ a: { b: 1, c: 2 } }, { a: bc => ({ a: 0, ...bc, c: 3 }) })).eql({ a: { a: 0, b: 1, c: 3 } })
})
