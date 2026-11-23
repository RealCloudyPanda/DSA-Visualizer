import { Algo, Tracer, C, parseEdges, graphView, ri } from '../core'
export default {
  name: 'Bellman-Ford', cat: 'Graphs', input: '0-1:6 0-2:7 1-3:5 2-3:-3 1-2:8 3-4:2 2-4:9', hint: 'directed weighted edges a-b:w (negatives allowed) from 0',
  problems: ['Cheapest Flights Within K Stops (787)', 'Network Delay Time (743)', 'Detect negative cycles'],
  code: ['dist = [inf]*n; dist[0] = 0', 'repeat n-1 times:', '  for (u, v, w) in edges:', '    if dist[u] + w < dist[v]: dist[v] = dist[u] + w', 'one more pass: any improvement = negative cycle'],
  rand: () => Array.from({ length: 8 }, () => { const a = ri(0, 5), b = ri(0, 5); return a === b ? '' : `${a}-${b}:${ri(-2, 9)}` }).filter(Boolean).join(' ') + ' 0-1:3',
  run(s) {
    const { edges, n } = parseEdges(s); const dist = Array(n).fill(Infinity); dist[0] = 0; const tr = new Tracer()
    const show = (line: number, msg: string, e?: { a: number; b: number }, c = C.cmp) => tr.add(line, msg, graphView(n, edges, e ? { [e.a]: C.act, [e.b]: c } : {}, e ? { [`${e.a}-${e.b}`]: c } : {}, { directed: true, weighted: true, sub: dist.map(d => (d === Infinity ? '∞' : d)) }))
    show(1, 'Distances start at infinity')
    for (let it = 1; it < n; it++) {
      let changed = false
      for (const e of edges) {
        if (dist[e.a] + e.w < dist[e.b]) { dist[e.b] = dist[e.a] + e.w; changed = true; show(4, `Pass ${it}: relax ${e.a}→${e.b} to ${dist[e.b]}`, e, C.done) }
        else show(3, `Pass ${it}: ${e.a}→${e.b} no change`, e, C.dim)
      }
      if (!changed) { show(2, `Nothing changed in pass ${it}: stop early`); return tr.frames }
    }
    const neg = edges.find(e => dist[e.a] + e.w < dist[e.b]); show(5, neg ? 'Negative cycle detected' : 'No negative cycle', neg, C.swap); return tr.frames
  },
} satisfies Algo
