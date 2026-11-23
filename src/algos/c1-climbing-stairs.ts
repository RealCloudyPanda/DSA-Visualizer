import { Algo, Tracer, C, arr, ri } from '../core'
export default {
  name: 'Climbing Stairs (1D DP)', cat: 'Dynamic Programming', input: '7', hint: 'n stairs, 1 or 2 steps at a time',
  problems: ['Climbing Stairs (70)', 'Min Cost Climbing Stairs (746)', 'House Robber (198)', 'House Robber II (213)', 'Decode Ways (91)', 'Fibonacci Number (509)'],
  code: ['dp[0] = 1; dp[1] = 1', 'for i in 2..n:', '  dp[i] = dp[i-1] + dp[i-2]', 'return dp[n]'],
  rand: () => String(ri(4, 12)),
  run(s) {
    const n = Math.min(30, Math.max(1, Number(s) || 5)); const dp: (number | string)[] = Array(n + 1).fill(''); dp[0] = 1; dp[1] = 1; const tr = new Tracer()
    tr.add(1, 'Base cases', arr(dp, { 0: C.done, 1: C.done }))
    for (let i = 2; i <= n; i++) { dp[i] = (dp[i - 1] as number) + (dp[i - 2] as number); tr.add(3, `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i]}`, arr(dp, { [i - 1]: C.cmp, [i - 2]: C.cmp, [i]: C.act }, { i })) }
    tr.add(4, `${dp[n]} ways`, arr(dp, { [n]: C.done })); return tr.frames
  },
} satisfies Algo
