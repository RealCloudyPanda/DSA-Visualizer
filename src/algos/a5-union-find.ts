import { Algo, Tracer, C, parseEdges, graphView, randGraph, arr } from '../core'
export default {
  name: 'Union-Find (DSU)', cat: 'Graphs', input: '0-1 2-3 1-2 4-5 3-0 5-6', hint: 'edges to union in order. Labels = parent',
  problems: ['Number of Connected Components (323)', 'Redundant Connection (684)', 'Graph Valid Tree (261)', 'Accounts Merge (721)', 'Longest Consecutive Sequence (128)'],
  code: ['find(x): while parent[x] != x:', '  parent[x] = parent[parent[x]]; x = parent[x]', 'union(a, b): ra, rb = find(a), find(b)', '  if ra == rb: cycle / already joined', '  attach smaller rank under larger'],
  rand: () => randGraph(8, 2).split(' ').sort(() => Math.random() - 0.5).join(' '),
  run(s) {
    const { edges, n } = parseEdges(s); const par = Array.from({ length: n }, (_, i) => i); const rank = Array(n).fill(0); const tr = new Tracer(); const ec: Record<string, string> = {}; const done: typeof edges = []
    const find = (x: number): number => { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x] } return x }
    const show = (line: number, msg: string, nc: Record<number, string> = {}) => tr.add(line, msg, [graphView(n, done, nc, ec, { sub: { ...par } }), arr(par, nc, {}, 'parent[]')])
    show(1, 'Each node is its own set')
    for (const e of edges) {
      const ra = find(e.a), rb = find(e.b); show(3, `Union ${e.a}-${e.b}: roots ${ra} and ${rb}`, { [e.a]: C.cmp, [e.b]: C.cmp, [ra]: C.act, [rb]: C.act })
      if (ra === rb) { done.push(e); ec[`${e.a}-${e.b}`] = C.swap; show(4, `Same root: edge ${e.a}-${e.b} makes a cycle`, { [ra]: C.swap }); continue }
      if (rank[ra] < rank[rb]) par[ra] = rb; else if (rank[ra] > rank[rb]) par[rb] = ra; else { par[rb] = ra; rank[ra]++ }
      done.push(e); ec[`${e.a}-${e.b}`] = C.done; show(5, `Joined sets under ${find(ra)}`, { [find(ra)]: C.done })
    }
    return tr.frames
  },
} satisfies Algo
