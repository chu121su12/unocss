import { createGenerator, mergeDeep } from '@unocss/core'
import type { Theme } from '@unocss/preset-mini';
import { presetMini } from 'unocss';
import { expect, test } from 'vitest'

const mergeTheme = (toMerge: any): Theme => {
  return createGenerator({
    presets: [presetMini()],
    theme: toMerge,
  }).config.theme ?? {}
}

test('utils object mergeDeep', () => {
  expect(mergeDeep({}, {})).eql({})
  expect(mergeDeep({ a: 1 }, { a: 2 })).eql({ a: 2 })
  expect(mergeDeep({ a: { b: 1, c: 2 } }, { a: { b: 3 } })).eql({ a: { b: 3, c: 2 } })
  expect(mergeDeep({ a: { b: 1, c: 2 } }, { a: () => ({ c: 3 }) })).eql({ a: { c: 3 } })
  expect(mergeDeep({ a: { b: 1, c: 2 } }, { a: bc => ({ a: 0, ...bc, c: 3 }) })).eql({ a: { a: 0, b: 1, c: 3 } })

  expect(Object.entries(mergeTheme({}).breakpoints ?? {})).eql([
    ['sm', '640px'],
    ['md', '768px'],
    ['lg', '1024px'],
    ['xl', '1280px'],
    ['2xl', '1536px'],
  ])

  expect(Object.entries(mergeTheme({
    breakpoints: {
      'large': '1000px',
    },
  }.breakpoints ?? {})).eql([
    ['sm', '640px'],
    ['md', '768px'],
    ['lg', '1024px'],
    ['xl', '1280px'],
    ['2xl', '1536px'],
    ['large', '1000px'],
  ])

  expect(Object.entries(mergeTheme('breakpoints', {
    breakpoints: () => ({
      'large': '1000px',
    }),
  }.breakpoints ?? {})).eql([
    ['large', '1000px'],
  ])

  expect(Object.entries(mergeTheme('breakpoints', {
    breakpoints: (prev: any) => ({
      'large': '1000px',
      'xl': prev.xl,
      'larger': '2000px',
    }),
  }.breakpoints ?? {})).eql([
    ['large', '1000px'],
    ['xl', '1280px'],
    ['larger', '2000px'],
  ])

  expect(Object.entries(mergeTheme('breakpoints', {
    breakpoints: () => ({
      'large': '1000px',
    }),
  }.breakpoints ?? {})).eql([
    ['large', '1000px'],
  ])

  expect(Object.entries(mergeTheme('breakpoints', {
    breakpoints: (prev: any) => ({
      'large': '1000px',
      'xl': prev.xl,
      'larger': '2000px',
    }),
  }.breakpoints ?? {})).eql([
    ['large', '1000px'],
    ['xl', '1280px'],
    ['larger', '2000px'],
  ])
})
