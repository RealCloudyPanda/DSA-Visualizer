import { Algo, Tracer, C, nums, bars, randNums, range } from '../core'
export default {
  name: 'Container With Most Water', cat: 'Two Pointers', input: '1, 8, 6, 2, 5, 4, 8, 3, 7', problems: ['Container With Most Water (11)', 'Trapping Rain Water (42)'],
  code: ['l, r = 0, n-1; best = 0', 'while l < r:', '  best = max(best, (r-l) * min(h[l], h[r]))', '  if h[l] < h[r]: l += 1', '  else: r -= 1'],
  rand: () => randNums(10, 1, 12),
  run(s) {
    const h = nums(s); const tr = new Tracer(); let l = 0, r = h.length - 1, best = 0
    while (l < r) {
      const area = (r - l) * Math.min(h[l], h[r]); best = Math.max(best, area)
      tr.add(3, `Area = ${r - l} × ${Math.min(h[l], h[r])} = ${area}`, bars(h, { ...range(l + 1, r - 1, C.soft), [l]: C.act, [r]: C.act }, { l, r }), { area, best })
      if (h[l] < h[r]) { l++; tr.add(4, 'Left wall is shorter: move l', bars(h, {}, { l, r }), { best }) } else { r--; tr.add(5, 'Right wall is shorter or equal: move r', bars(h, {}, { l, r }), { best }) }
    }
    tr.add(2, `Max area = ${best}`, bars(h), { best }); return tr.frames
  },
} satisfies Algo
