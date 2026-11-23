import { Algo, Tracer, C, nums, arr, randNums } from '../core'
import { heapTree } from './90-min-heap'
export default {
  name: 'Top K with a Heap', cat: 'Heaps', input: '3, 2, 1, 5, 6, 4, 8, 7 | 3', hint: 'values | k. Keep a min-heap of size k',
  problems: ['Kth Largest Element in an Array (215)', 'Top K Frequent Elements (347)', 'K Closest Points to Origin (973)', 'Merge k Sorted Lists (23)'],
  code: ['heap = []', 'for x in a:', '  heappush(heap, x)', '  if len(heap) > k: heappop(heap)  # drop smallest', 'return heap[0]  # kth largest'],
  rand: () => `${randNums(9, 1, 50)} | 3`,
  run(s) {
    const [p, q] = s.split('|'); const a = nums(p); const k = Number(q) || 3; const h: number[] = []; const tr = new Tracer()
    const up = () => { let i = h.length - 1; while (i > 0 && h[(i - 1) >> 1] > h[i]) { const pi = (i - 1) >> 1; [h[i], h[pi]] = [h[pi], h[i]]; i = pi } }
    const down = () => { let i = 0; for (;;) { let c = 2 * i + 1; if (c >= h.length) return; if (c + 1 < h.length && h[c + 1] < h[c]) c++; if (h[c] >= h[i]) return; [h[i], h[c]] = [h[c], h[i]]; i = c } }
    a.forEach((x, i) => {
      h.push(x); up(); tr.add(3, `Push ${x}`, [arr(a, { [i]: C.act }, { i }), heapTree(h, { 0: C.vis })], { heap: [...h] })
      if (h.length > k) { const m = h[0]; h[0] = h.pop()!; down(); tr.add(4, `Size > ${k}: pop smallest ${m}`, [arr(a, { [i]: C.act }, { i }), heapTree(h, { 0: C.vis })]) }
    })
    tr.add(5, `Kth largest = ${h[0]}`, [arr(a), heapTree(h, { 0: C.done })]); return tr.frames
  },
} satisfies Algo
