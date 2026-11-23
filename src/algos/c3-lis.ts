import { Algo, Tracer, C, nums, arr, randNums } from '../core'
export default {
  name: 'Longest Increasing Subsequence', cat: 'Dynamic Programming', input: '10, 9, 2, 5, 3, 7, 101, 18', problems: ['Longest Increasing Subsequence (300)', 'Partition Equal Subset Sum (416)', 'Number of LIS (673)', 'Russian Doll Envelopes (354)'],
  code: ['dp = [1]*n  # LIS ending at i', 'for i in 0..n-1:', '  for j in 0..i-1:', '    if a[j] < a[i]: dp[i] = max(dp[i], dp[j]+1)', 'return max(dp)'],
  rand: () => randNums(9, 1, 30),
  run(s) {
    const a = nums(s); const dp = a.map(() => 1); const tr = new Tracer()
    for (let i = 0; i < a.length; i++) for (let j = 0; j < i; j++) {
      const up = a[j] < a[i] && dp[j] + 1 > dp[i]; if (up) dp[i] = dp[j] + 1
      tr.add(4, `${a[j]} ${a[j] < a[i] ? '<' : '>='} ${a[i]}${up ? `: dp[${i}] = ${dp[i]}` : ''}`, [arr(a, { [i]: C.act, [j]: C.cmp }, { i, j }, 'a'), arr(dp, { [i]: up ? C.done : C.act, [j]: C.cmp }, {}, 'dp')])
    }
    tr.add(5, `LIS length = ${Math.max(...dp)}`, [arr(a, {}, {}, 'a'), arr(dp, {}, {}, 'dp')]); return tr.frames
  },
} satisfies Algo
