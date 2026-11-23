import { Algo, Tracer, C, nums, bars, randNums, range } from '../core'
export default {
  name: 'Quick Sort', cat: 'Sorting', input: '10, 80, 30, 90, 40, 50, 70', problems: ['Sort an Array (912)', 'Kth Largest Element in an Array (215) via quickselect', 'Sort Colors (75)'],
  code: ['qs(lo, hi):', '  if lo >= hi: return', '  pivot = a[hi]; i = lo', '  for j in lo..hi-1:', '    if a[j] < pivot: swap(a[i], a[j]); i += 1', '  swap(a[i], a[hi])  # pivot in place', '  qs(lo, i-1); qs(i+1, hi)'],
  rand: () => randNums(10),
  run(s) {
    const a = nums(s); const tr = new Tracer(); const fixed: Record<number, string> = {}
    const qs = (lo: number, hi: number) => {
      if (lo > hi) return
      if (lo === hi) { fixed[lo] = C.done; return }
      const p = a[hi]; let i = lo
      tr.add(3, `Pivot = ${p}`, bars(a, { ...fixed, [hi]: C.vis }, { lo, hi }), { lo, hi, pivot: p })
      for (let j = lo; j < hi; j++) {
        tr.add(4, `Compare ${a[j]} < ${p}?`, bars(a, { ...fixed, ...range(lo, i - 1, C.act), [j]: C.cmp, [hi]: C.vis }, { i, j }), { i, j, pivot: p })
        if (a[j] < p) { [a[i], a[j]] = [a[j], a[i]]; tr.add(5, `Swap into smaller side`, bars(a, { ...fixed, [i]: C.swap, [j]: C.swap, [hi]: C.vis }, { i, j }), { i, j }); i++ }
      }
      [a[i], a[hi]] = [a[hi], a[i]]; fixed[i] = C.done
      tr.add(6, `Pivot ${p} placed at ${i}`, bars(a, { ...fixed }, { i }), { i })
      qs(lo, i - 1); qs(i + 1, hi)
    }
    qs(0, a.length - 1); tr.add(7, 'Sorted', bars(a, range(0, a.length - 1, C.done))); return tr.frames
  },
} satisfies Algo
