import { Algo, Tracer, C, parseEdges, graphView, randGraph } from '../core'
export default {
  name: "Kruskal's MST", cat: 'Graphs', input: '0-1:4 0-2:3 1-2:1 1-3:2 2-3:4 3-4:2 2-4:5', hint: 'weighted edges a-b:w',
  problems: ['Min Cost to Connect All Points (1584)', 'Connecting Cities With Minimum Cost (1135)', "Find Critical and Pseudo-Critical Edges (1489)"],
  code: ['sort edges by weight', 'for (u, v, w) in edges:', '  if find(u) != find(v):', '    union(u, v); mst.add(edge)', '  else: skip (would form a cycle)'],
  rand: () => randGraph(7, 4, true),
  run(s) {
    const { edges, n } = parseEdges(s); const par = Array.from({ length: n }, (_, i) => i); const find = (x: number): number => (par[x] === x ? x : (par[x] = find(par[x])))
    const tr = new Tracer(); const ec: Record<string, string> = {}; let total = 0
    const show = (line: number, msg: string, ee: Record<string, string> = {}) => tr.add(line, msg, graphView(n, edges, {}, { ...ec, ...ee }, { weighted: true }), { total })
    show(1, 'Sort edges by weight')
    for (const e of [...edges].sort((a, b) => a.w - b.w)) {
      const k = `${e.a}-${e.b}`; show(2, `Try ${k} (w=${e.w})`, { [k]: C.cmp })
      if (find(e.a) !== find(e.b)) { par[find(e.a)] = find(e.b); total += e.w; ec[k] = C.done; show(4, `Add ${k}`) }
      else { ec[k] = C.dim; show(5, `${k} would make a cycle`) }
    }
    show(4, `MST weight = ${total}`); return tr.frames
  },
} satisfies Algo
