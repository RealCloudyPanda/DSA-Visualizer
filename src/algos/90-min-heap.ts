import { Algo, Tracer, C, nums, arr, randNums, GraphView } from '../core'
export const heapTree = (a: number[], col: Record<number, string>): GraphView => {
  const nodes = a.map((v, i) => { const d = Math.floor(Math.log2(i + 1)); const p = i + 1 - 2 ** d; return { id: i, x: ((p + 0.5) * 640) / 2 ** d, y: 30 + d * 60, label: v, color: col[i] } })
  return { kind: 'graph', title: 'heap as a tree', nodes, edges: nodes.slice(1).map(nd => ({ a: (Number(nd.id) - 1) >> 1, b: nd.id })) }
}
export default {
  name: 'Min-Heap Push / Pop', cat: 'Heaps', input: '5, 3, 8, 1, 9, 2 | 2', hint: 'values to push | number of pops',
  problems: ['Kth Largest Element in a Stream (703)', 'Last Stone Weight (1046)', 'K Closest Points to Origin (973)', 'Task Scheduler (621)', 'Find Median from Data Stream (295)'],
  code: ['push(x): a.append(x); i = n-1', '  while i > 0 and a[parent(i)] > a[i]: swap up', 'pop(): top = a[0]; a[0] = a.pop()', '  sift down: swap with smaller child', '  while child < a[i]', '  return top'],
  rand: () => `${randNums(8, 1, 50)} | 3`,
  run(s) {
    const [p, q] = s.split('|'); const a: number[] = []; const tr = new Tracer(); const out: number[] = []
    const show = (line: number, msg: string, col: Record<number, string> = {}) => tr.add(line, msg, [heapTree(a, col), arr(a, col, {}, 'array'), arr(out, {}, {}, 'popped')])
    for (const x of nums(p)) {
      a.push(x); let i = a.length - 1; show(1, `Push ${x}`, { [i]: C.act })
      while (i > 0 && a[(i - 1) >> 1] > a[i]) { const pi = (i - 1) >> 1; [a[i], a[pi]] = [a[pi], a[i]]; i = pi; show(2, 'Smaller than parent: bubble up', { [i]: C.swap }) }
    }
    for (let k = 0; k < Number(q ?? 0) && a.length; k++) {
      out.push(a[0]); const last = a.pop()!; if (!a.length) { show(6, `Pop ${out[out.length - 1]}`); break }
      a[0] = last; show(3, `Pop ${out[out.length - 1]}, move last to root`, { 0: C.act }); let i = 0
      for (;;) {
        let c = 2 * i + 1; if (c >= a.length) break; if (c + 1 < a.length && a[c + 1] < a[c]) c++
        if (a[c] >= a[i]) break; [a[i], a[c]] = [a[c], a[i]]; i = c; show(4, 'Swap with the smaller child', { [i]: C.swap })
      }
      show(6, 'Heap restored')
    }
    return tr.frames
  },
} satisfies Algo
