import { Algo, Tracer, C, GridView } from '../core'
export default {
  name: 'Longest Common Subsequence (2D DP)', cat: 'Dynamic Programming', input: 'abcde | ace', hint: 'text1 | text2',
  problems: ['Longest Common Subsequence (1143)', 'Edit Distance (72)', 'Distinct Subsequences (115)', 'Interleaving String (97)', 'Unique Paths (62)', 'Longest Palindromic Substring (5)'],
  code: ['dp = (m+1) x (n+1) zeros', 'for i in 1..m: for j in 1..n:', '  if s[i-1] == t[j-1]: dp[i][j] = dp[i-1][j-1] + 1', '  else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])', 'return dp[m][n]'],
  rand: () => [...'abcdefg'].sort(() => Math.random() - 0.5).slice(0, 6).join('') + ' | ' + [...'abcdefg'].sort(() => Math.random() - 0.5).slice(0, 5).join(''),
  run(s) {
    const [x, y] = s.split('|').map(t => t.trim()); const m = x.length, n = (y ?? '').length; const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0)); const tr = new Tracer()
    const v = (col: Record<string, string>): GridView => ({ kind: 'grid', cells: dp.map(r => [...r]), rows: ['', ...x], cols: ['', ...(y ?? '')], colors: col })
    tr.add(1, 'Empty prefixes have LCS 0', v({}))
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
      if (x[i - 1] === y[j - 1]) { dp[i][j] = dp[i - 1][j - 1] + 1; tr.add(3, `'${x[i - 1]}' matches: diagonal + 1 = ${dp[i][j]}`, v({ [`${i - 1},${j - 1}`]: C.cmp, [`${i},${j}`]: C.done })) }
      else { dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); tr.add(4, `'${x[i - 1]}' ≠ '${y[j - 1]}': max(up, left) = ${dp[i][j]}`, v({ [`${i - 1},${j}`]: C.cmp, [`${i},${j - 1}`]: C.cmp, [`${i},${j}`]: C.act })) }
    }
    tr.add(5, `LCS length = ${dp[m][n]}`, v({ [`${m},${n}`]: C.done })); return tr.frames
  },
} satisfies Algo
