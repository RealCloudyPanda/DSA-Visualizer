import { Algo, Tracer, C, GridView, ri } from '../core'
export default {
  name: '0/1 Knapsack', cat: 'Dynamic Programming', input: '1:1 3:4 4:5 5:7 | 7', hint: 'items as weight:value | capacity',
  problems: ['Partition Equal Subset Sum (416)', 'Target Sum (494)', 'Last Stone Weight II (1049)', 'Ones and Zeroes (474)'],
  code: ['dp[i][w] = best value using first i items, capacity w', 'for i in 1..n: for w in 0..W:', '  dp[i][w] = dp[i-1][w]  # skip item', '  if wt[i] <= w:', '    dp[i][w] = max(dp[i][w], dp[i-1][w-wt[i]] + val[i])  # take'],
  rand: () => Array.from({ length: 4 }, () => `${ri(1, 5)}:${ri(1, 9)}`).join(' ') + ` | ${ri(5, 10)}`,
  run(s) {
    const [p, q] = s.split('|'); const items = p.trim().split(/\s+/).map(t => t.split(':').map(Number)); const W = Math.min(15, Number(q) || 0); const n = items.length
    const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0)); const tr = new Tracer()
    const v = (col: Record<string, string>): GridView => ({ kind: 'grid', cells: dp.map(r => [...r]), rows: ['none', ...items.map(([w, val]) => `w${w} v${val}`)], cols: Array.from({ length: W + 1 }, (_, i) => i), colors: col })
    tr.add(1, 'Row 0: no items, value 0', v({}))
    for (let i = 1; i <= n; i++) for (let w = 0; w <= W; w++) {
      const [wt, val] = items[i - 1]; dp[i][w] = dp[i - 1][w]
      if (wt <= w && dp[i - 1][w - wt] + val > dp[i][w]) { dp[i][w] = dp[i - 1][w - wt] + val; tr.add(5, `Take item ${i}: ${dp[i - 1][w - wt]} + ${val} = ${dp[i][w]}`, v({ [`${i - 1},${w - wt}`]: C.cmp, [`${i - 1},${w}`]: C.dim, [`${i},${w}`]: C.done })) }
      else tr.add(3, `Skip item ${i} at w=${w}: ${dp[i][w]}`, v({ [`${i - 1},${w}`]: C.cmp, [`${i},${w}`]: C.act }))
    }
    tr.add(1, `Best value = ${dp[n][W]}`, v({ [`${n},${W}`]: C.done })); return tr.frames
  },
} satisfies Algo
