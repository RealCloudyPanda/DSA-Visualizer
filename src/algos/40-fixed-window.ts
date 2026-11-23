import { Algo, Tracer, C, nums, arr, randNums, range } from '../core'
export default {
  name: 'Fixed Sliding Window', cat: 'Sliding Window', input: '2, 1, 5, 1, 3, 2, 7, 1 | 3', hint: 'values | window size k',
  problems: ['Maximum Average Subarray I (643)', 'Permutation in String (567)', 'Find All Anagrams in a String (438)', 'Sliding Window Maximum (239)'],
  code: ['win = sum(a[0..k-1]); best = win', 'for i in k..n-1:', '  win += a[i] - a[i-k]', '  best = max(best, win)'],
  rand: () => `${randNums(10, 1, 9)} | 3`,
  run(s) {
    const [p, q] = s.split('|'); const a = nums(p); const k = Math.max(1, Number(q) || 3); const tr = new Tracer()
    let win = a.slice(0, k).reduce((x, y) => x + y, 0), best = win, bi = 0
    tr.add(1, `First window sum = ${win}`, arr(a, range(0, k - 1, C.act), { L: 0, R: k - 1 }), { win, best })
    for (let i = k; i < a.length; i++) {
      win += a[i] - a[i - k]
      tr.add(3, `Add ${a[i]}, drop ${a[i - k]}: sum = ${win}`, arr(a, { ...range(i - k + 1, i, C.act), [i - k]: C.dim }, { L: i - k + 1, R: i }), { win, best })
      if (win > best) { best = win; bi = i - k + 1; tr.add(4, `New best ${best}`, arr(a, range(bi, i, C.done), { L: bi, R: i }), { win, best }) }
    }
    tr.add(4, `Best window sum = ${best}`, arr(a, range(bi, bi + k - 1, C.done)), { best }); return tr.frames
  },
} satisfies Algo
