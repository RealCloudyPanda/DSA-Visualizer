import { Algo, Tracer, C, parseEdges, graphView, randGraph, arr } from '../core'
export default {
  name: "Dijkstra's Shortest Path", cat: 'Graphs', input: '0-1:4 0-2:1 2-1:2 1-3:1 2-3:5 3-4:3', hint: 'undirected weighted edges a-b:w from 0. Labels = distance',
  problems: ['Network Delay Time (743)', 'Path With Minimum Effort (1631)', 'Swim in Rising Water (778)', 'Cheapest Flights Within K Stops (787)'],
  code: ['dist = {start: 0}; pq = [(0, start)]', 'while pq:', '  d, u = heappop(pq)', '  if d > dist[u]: continue', '  for v, w in adj[u]:', '    if d + w < dist[v]:', '      dist[v] = d + w; heappush(pq, (dist[v], v))'],
  rand: () => randGraph(7, 4, true),
  run(s) {
    const { edges, n } = parseEdges(s); const adj: [number, number][][] = Array.from({ length: n }, () => []); edges.forEach(e => { adj[e.a].push([e.b, e.w]); adj[e.b].push([e.a, e.w]) })
    const dist = Array(n).fill(Infinity); dist[0] = 0; let pq: [number, number][] = [[0, 0]]; const tr = new Tracer(); const nc: Record<number, string> = {}; const ec: Record<string, string> = {}; const via: Record<number, string> = {}
    const show = (line: number, msg: string, x: Record<number, string> = {}, ee: Record<string, string> = {}) => tr.add(line, msg, [graphView(n, edges, { ...nc, ...x }, { ...ec, ...ee }, { weighted: true, sub: dist.map(d => (d === Infinity ? '∞' : d)) }), arr(pq.map(([d, v]) => `${v}:${d}`), {}, {}, 'priority queue (node:dist)')])
    show(1, 'Start at 0')
    while (pq.length) {
      pq.sort((a, b) => a[0] - b[0]); const [d, u] = pq.shift()!
      if (d > dist[u]) { show(4, `Stale entry for ${u}, skip`, { [u]: C.dim }); continue }
      nc[u] = C.done; show(3, `Pop ${u} with distance ${d}`, { [u]: C.act })
      for (const [v, w] of adj[u]) {
        if (d + w < dist[v]) { if (via[v]) delete ec[via[v]]; dist[v] = d + w; via[v] = `${u}-${v}`; ec[via[v]] = C.act; pq.push([dist[v], v]); show(7, `Relax ${v}: ${d} + ${w} = ${dist[v]}`, { [u]: C.act, [v]: C.cmp }) }
        else show(6, `${v}: ${d} + ${w} is not better`, { [u]: C.act, [v]: C.dim }, { [`${u}-${v}`]: C.cmp })
      }
    }
    return tr.frames
  },
} satisfies Algo
