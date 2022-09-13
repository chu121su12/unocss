import { describe, expect, it } from 'vitest'
import { handler as h } from '@unocss/preset-mini/utils'

describe('value handler', () => {
  it('bracket math function', () => {
    expect(h.bracket('[calc(1-2)]')).eql('calc(1 - 2)')
    expect(h.bracket('[min(1-2)]')).eql('min(1 - 2)')
    expect(h.bracket('[max(1-2)]')).eql('max(1 - 2)')
    expect(h.bracket('[clamp(1-2)]')).eql('clamp(1 - 2)')

    expect(h.bracket('[calc(1+2)]')).eql('calc(1 + 2)')
    expect(h.bracket('[calc(1/2)]')).eql('calc(1 / 2)')
    expect(h.bracket('[calc(1*2)]')).eql('calc(1 * 2)')
  })

  it('bracket curly', () => {
    expect(h.bracket('[foo][bar]')).eql(undefined)
    expect(h.bracket('[[]]')).eql('[]')
    expect(h.bracket('[]]')).eql(undefined)
    expect(h.bracket('[]][[]]]]')).eql(undefined)
    expect(h.bracket('[[][[[]]]]')).eql('[][[[]]]')
  })

  it('bracket underscore', () => {
    expect(h.bracket('[a_b]')).eql('a b')
    expect(h.bracket('[a\\_b]')).eql('a_b')
    expect(h.bracket('[url(a_b)]')).eql('url(a_b)')
    expect(h.bracket('[url(a\\_b)]')).eql('url(a\\_b)')
    expect(h.bracket('[var(--A_B)]')).eql('var(--A B)')
    expect(h.bracket('[var(--A\\_B)]')).eql('var(--A_B)')
  })

  it('color bracket attempts to resolve color value', () => {
    expect(h.bracket('[color:#f00]')).eql(undefined)
    expect(h.bracketOfColor('[color:#f00]')).eql('rgba(255,0,0)')
    expect(h.bracketOfColor('[color:rgb(var(--red)_10%)]')).eql('rgb(var(--red) 10%)')
    expect(h.bracketOfColor('[color:rgb(var(--red)/50%)]')).eql('rgba(var(--red),50%)')
    expect(h.bracketOfColor('[color:oklab(var(--red)_var(--maybe\\_op))]')).eql('oklab(var(--red) var(--maybe_op))')
    expect(h.bracketOfColor('[color:oklab(var(--red)/var(--op))]')).eql('oklab(var(--red) / var(--op))')
  })
})
