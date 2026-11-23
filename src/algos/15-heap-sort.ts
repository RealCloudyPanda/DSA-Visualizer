import { Algo, Tracer, C, nums, bars, randNums, range, GraphView } from '../core'
const heapView = (a: number[], n: number, col: Record<number, string>): GraphView => {
  const nodes = a.slice(0, n).map((v, i) => { const d = Math.floor(Math.log2(i + 1)); const p = i + 1 - 2 ** d; return { id: i, x: ((p + 0.5) * 640) / 2 ** d, y: 30 + d * 60, label: v, color: col[i] } })
  return { kind: 'graph', title: 'heap (tree view)', nodes, edges: nodes.slice(1).map(nd => ({ a: (Number(nd.id) - 1) >> 1, b: nd.id })) }
}
export default {
  name: 'Heap Sort', cat: 'Sorting', input: '4, 10, 3, 5, 1, 8, 7', problems: ['Sort an Array (912)', 'Kth Largest Element in an Array (215)'],
  code: ['build max-heap (sift down from n/2-1 to 0)', 'for end in n-1..1:', '  swap(a[0], a[end])', '  sift_down(0, end)', 'sift_down(i, n):', '  c = larger child of i', '  if a[c] > a[i]: swap, continue at c'],
  rand: () => randNums(10),
  run(s) {
    const a = nums(s); const n = a.length; const tr = new Tracer()
    const snap = (line: number, msg: string, col: Record<number, string>, size: number) => tr.add(line, msg, [bars(a, { ...range(size, n - 1, C.done), ...col }), heapView(a, size, col)], { heapSize: size })
    const sift = (i: number, size: number) => {
      for (;;) {
        let c = 2 * i + 1; if (c >= size) return
        if (c + 1 < size && a[c + 1] > a[c]) c++
        snap(6, `Compare ${a[i]} with larger child ${a[c]}`, { [i]: C.act, [c]: C.cmp }, size)
        if (a[c] <= a[i]) return
        [a[i], a[c]] = [a[c], a[i]]; snap(7, 'Swap down', { [i]: C.swap, [c]: C.swap }, size); i = c
      }
    }
    for (let i = (n >> 1) - 1; i >= 0; i--) sift(i, n)
    snap(1, 'Max-heap built', {}, n)
    for (let end = n - 1; end > 0; end--) {
      [a[0], a[end]] = [a[end], a[0]]; snap(3, `Move max ${a[end]} to index ${end}`, { 0: C.swap, [end]: C.swap }, end); sift(0, end)
    }
    snap(2, 'Sorted', range(0, n - 1, C.done), 0); return tr.frames
  },
} satisfies Algo
