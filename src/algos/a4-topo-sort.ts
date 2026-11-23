import { Algo, Tracer, C, parseEdges, graphView, randGraph, arr } from '../core'
export default {
  name: 'Topological Sort (Kahn)', cat: 'Graphs', input: '0-1 0-2 1-3 2-3 3-4 5-4', hint: 'directed edges a-b (a before b). Labels = in-degree',
  problems: ['Course Schedule (207)', 'Course Schedule II (210)', 'Alien Dictionary (269)', 'Parallel Courses (1136)'],
  code: ['indeg = count incoming edges', 'q = [nodes with indeg 0]', 'while q:', '  u = q.pop(); order.append(u)', '  for v in adj[u]:', '    indeg[v] -= 1', '    if indeg[v] == 0: q.append(v)', 'cycle if len(order) < n'],
  rand: () => randGraph(7, 3, false, true),
  run(s) {
    const { edges, n } = parseEdges(s); const adj: number[][] = Array.from({ length: n }, () => []); const indeg = Array(n).fill(0); edges.forEach(e => { adj[e.a].push(e.b); indeg[e.b]++ })
    const tr = new Tracer(); const q = indeg.flatMap((d, i) => (d ? [] : [i])); const order: number[] = []; const nc: Record<number, string> = {}; const ec: Record<string, string> = {}
    const show = (line: number, msg: string, x: Record<number, string> = {}) => tr.add(line, msg, [graphView(n, edges, { ...nc, ...Object.fromEntries(q.map(i => [i, C.vis])), ...x }, ec, { directed: true, sub: { ...indeg } }), arr(q, {}, {}, 'queue'), arr(order, {}, {}, 'order')])
    show(2, 'Queue every node with in-degree 0')
    while (q.length) {
      const u = q.shift()!; order.push(u); nc[u] = C.done; show(4, `Take ${u}`, { [u]: C.act })
      for (const v of adj[u]) { indeg[v]--; ec[`${u}-${v}`] = C.dim; if (!indeg[v]) q.push(v); show(indeg[v] ? 6 : 7, `in-degree of ${v} is now ${indeg[v]}`, { [u]: C.act, [v]: C.cmp }) }
    }
    show(8, order.length < n ? 'Cycle detected: not all nodes ordered' : `Order: ${order.join(' → ')}`); return tr.frames
  },
} satisfies Algo
