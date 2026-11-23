import { Algo, Tracer, C, parseEdges, graphView, randGraph, arr } from '../core'
export default {
  name: 'Graph BFS', cat: 'Graphs', input: '0-1 0-2 1-3 2-4 3-5 4-5 1-4', hint: 'undirected edges a-b, start at 0. Labels under nodes = distance',
  problems: ['Rotting Oranges (994)', 'Walls and Gates (286)', 'Word Ladder (127)', 'Shortest Path in Binary Matrix (1091)', 'Open the Lock (752)'],
  code: ['q = deque([start]); dist = {start: 0}', 'while q:', '  u = q.popleft()', '  for v in adj[u]:', '    if v not in dist:', '      dist[v] = dist[u] + 1; q.append(v)'],
  rand: () => randGraph(8, 4),
  run(s) {
    const { edges, n } = parseEdges(s); const adj: number[][] = Array.from({ length: n }, () => []); edges.forEach(e => { adj[e.a].push(e.b); adj[e.b].push(e.a) })
    const tr = new Tracer(); const dist: Record<number, number> = { 0: 0 }; const q = [0]; const nc: Record<number, string> = {}; const ec: Record<string, string> = {}
    const show = (line: number, msg: string, extra: Record<number, string> = {}, ee: Record<string, string> = {}) => tr.add(line, msg, [graphView(n, edges, { ...nc, ...Object.fromEntries(q.map(x => [x, C.vis])), ...extra }, { ...ec, ...ee }, { sub: dist }), arr(q, {}, {}, 'queue')])
    show(1, 'Start BFS from 0')
    while (q.length) {
      const u = q.shift()!; nc[u] = C.done; show(3, `Visit ${u}`, { [u]: C.act })
      for (const v of adj[u]) {
        if (v in dist) { show(5, `${v} already seen`, { [u]: C.act, [v]: C.cmp }, { [`${u}-${v}`]: C.cmp }); continue }
        dist[v] = dist[u] + 1; q.push(v); ec[`${u}-${v}`] = C.act; show(6, `Discover ${v} at distance ${dist[v]}`, { [u]: C.act })
      }
    }
    return tr.frames
  },
} satisfies Algo
