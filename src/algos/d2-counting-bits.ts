import { Algo, Tracer, C, arr, GridView, ri } from '../core'
export default {
  name: 'Counting Bits', cat: 'Bit Manipulation', input: '10', hint: 'n', problems: ['Counting Bits (338)', 'Number of 1 Bits (191)', 'Power of Two (231)'],
  code: ['dp = [0]*(n+1)', 'for i in 1..n:', '  dp[i] = dp[i >> 1] + (i & 1)'],
  rand: () => String(ri(6, 16)),
  run(s) {
    const n = Math.min(32, Math.max(1, Number(s) || 8)); const dp = Array(n + 1).fill(0); const tr = new Tracer()
    const g = (i: number): GridView => ({ kind: 'grid', rows: [i, i >> 1], cols: [16, 8, 4, 2, 1], cells: [i, i >> 1].map(x => x.toString(2).padStart(5, '0').split('')), colors: { '0,4': C.cmp } })
    for (let i = 1; i <= n; i++) { dp[i] = dp[i >> 1] + (i & 1); tr.add(3, `dp[${i}] = dp[${i >> 1}] + ${i & 1} = ${dp[i]}`, [g(i), arr(dp, { [i >> 1]: C.cmp, [i]: C.act }, { i })]) }
    return tr.frames
  },
} satisfies Algo
