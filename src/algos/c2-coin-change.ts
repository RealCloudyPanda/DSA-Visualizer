import { Algo, Tracer, C, nums, arr, ri } from '../core'
export default {
  name: 'Coin Change (Unbounded DP)', cat: 'Dynamic Programming', input: '1, 2, 5 | 11', hint: 'coins | amount',
  problems: ['Coin Change (322)', 'Coin Change II (518)', 'Perfect Squares (279)', 'Word Break (139)', 'Combination Sum IV (377)'],
  code: ['dp = [inf]*(amount+1); dp[0] = 0', 'for a in 1..amount:', '  for c in coins:', '    if c <= a: dp[a] = min(dp[a], dp[a-c] + 1)', 'return dp[amount] or -1'],
  rand: () => `1, ${ri(2, 4)}, ${ri(5, 8)} | ${ri(8, 20)}`,
  run(s) {
    const [p, q] = s.split('|'); const coins = nums(p); const amt = Math.min(40, Number(q) || 0); const dp = Array(amt + 1).fill(Infinity); dp[0] = 0; const tr = new Tracer()
    const show = (line: number, msg: string, col: Record<number, string>) => tr.add(line, msg, arr(dp.map(x => (x === Infinity ? '∞' : x)), col))
    show(1, 'dp[0] = 0, everything else ∞', { 0: C.done })
    for (let a = 1; a <= amt; a++) for (const c of coins) {
      if (c > a) continue
      const cand = dp[a - c] + 1; const better = cand < dp[a]; if (better) dp[a] = cand
      show(4, `a=${a}, coin ${c}: dp[${a - c}]+1 = ${cand === Infinity ? '∞' : cand}${better ? ' (better)' : ''}`, { [a - c]: C.cmp, [a]: better ? C.act : C.vis })
    }
    show(5, `Answer: ${dp[amt] === Infinity ? -1 : dp[amt]}`, { [amt]: C.done }); return tr.frames
  },
} satisfies Algo
