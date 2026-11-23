import { Algo, Tracer, C, nums, arr, randNums, range } from '../core'
export default {
  name: 'Prefix Sum', cat: 'Arrays & Hashing', input: '3, 1, 4, 1, 5, 9, 2 | 2 5', hint: 'values | query l r (inclusive)',
  problems: ['Range Sum Query - Immutable (303)', 'Product of Array Except Self (238)', 'Subarray Sum Equals K (560)', 'Range Sum Query 2D (304)'],
  code: ['P = [0] * (n+1)', 'for i in 0..n-1: P[i+1] = P[i] + a[i]', 'sum(l, r) = P[r+1] - P[l]'],
  rand: () => `${randNums(8, 1, 9)} | 2 5`,
  run(s) {
    const [p, q] = s.split('|'); const a = nums(p); const [l, r] = nums(q ?? '0 0'); const P = Array(a.length + 1).fill(0); const tr = new Tracer()
    tr.add(1, 'P[0] = 0', [arr(a, {}, {}, 'a'), arr(P, { 0: C.act }, {}, 'P')])
    for (let i = 0; i < a.length; i++) { P[i + 1] = P[i] + a[i]; tr.add(2, `P[${i + 1}] = P[${i}] + a[${i}] = ${P[i + 1]}`, [arr(a, { [i]: C.cmp }, {}, 'a'), arr(P, { [i]: C.cmp, [i + 1]: C.act }, {}, 'P')]) }
    tr.add(3, `sum(${l}, ${r}) = P[${r + 1}] - P[${l}] = ${P[r + 1] - P[l]}`, [arr(a, range(l, r, C.done), {}, 'a'), arr(P, { [l]: C.vis, [r + 1]: C.act }, {}, 'P')], { sum: P[r + 1] - P[l] })
    return tr.frames
  },
} satisfies Algo
