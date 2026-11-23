import { Algo, Tracer, C, parseEdges, graphView, randGraph, arr } from '../core'
export default {
  name: 'Graph DFS', cat: 'Graphs', input: '0-1 0-2 1-3 2-4 3-5 4-5 1-4', hint: 'undirected edges a-b, start at 0. Labels = visit order',
  problems: ['Clone Graph (133)', 'Max Area of Island (695)', 'Pacific Atlantic Water Flow (417)', 'Surrounded Regions (130)', 'Graph Valid Tree (261)', 'Number of Connected Components (323)'],
  code: ['dfs(u):', '  visited.add(u)', '  for v in adj[u]:', '    if v not in visited: dfs(v)', '  # backtrack'],
  rand: () => randGraph(8, 4),
  run(s) {
    const { edges, n } = parseEdges(s); const adj: number[][] = Array.from({ length: n }, () => []); edges.forEach(e => { adj[e.a].push(e.b); adj[e.b].push(e.a) })
    const tr = new Tracer(); const order: Record<number, number> = {}; const nc: Record<number, string> = {}; const ec: Record<string, string> = {}; const stack: number[] = []; let t = 0
    const show = (line: number, msg: string, cur: number) => tr.add(line, msg, [graphView(n, edges, { ...nc, ...Object.fromEntries(stack.map(x => [x, C.vis])), [cur]: C.act }, ec, { sub: order }), arr(stack, {}, {}, 'call stack')])
    const dfs = (u: number) => {
      order[u] = t++; stack.push(u); show(2, `Visit ${u}`, u)
      for (const v of adj[u]) { if (v in order) continue; ec[`${u}-${v}`] = C.act; show(4, `Go deeper to ${v}`, u); dfs(v); show(3, `Back at ${u}`, u) }
      stack.pop(); nc[u] = C.done; show(5, `${u} finished`, u)
    }
    if (n) dfs(0); return tr.frames
  },
} satisfies Algo
