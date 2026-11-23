import { Algo, Tracer, C, nums, arr, randNums, range } from '../core'
export default {
  name: "Kadane's Max Subarray", cat: 'Arrays & Hashing', input: '-2, 1, -3, 4, -1, 2, 1, -5, 4', problems: ['Maximum Subarray (53)', 'Maximum Product Subarray (152)', 'Gas Station (134)'],
  code: ['cur = best = a[0]', 'for i in 1..n-1:', '  cur = max(a[i], cur + a[i])', '  best = max(best, cur)'],
  rand: () => randNums(10, -9, 9),
  run(s) {
    const a = nums(s); const tr = new Tracer(); let cur = a[0], best = a[0], st = 0, bs = 0, be = 0
    tr.add(1, 'Start with the first element', arr(a, { 0: C.act }, { i: 0 }), { cur, best })
    for (let i = 1; i < a.length; i++) {
      if (a[i] > cur + a[i]) { cur = a[i]; st = i } else cur += a[i]
      tr.add(3, st === i ? `Restart window at ${i}` : `Extend window to ${i}`, arr(a, { ...range(bs, be, C.done), ...range(st, i, C.act) }, { i }), { cur, best })
      if (cur > best) { best = cur; bs = st; be = i; tr.add(4, `New best ${best}`, arr(a, range(bs, be, C.done), { i }), { cur, best }) }
    }
    tr.add(4, `Max sum = ${best}`, arr(a, range(bs, be, C.done)), { best }); return tr.frames
  },
} satisfies Algo
