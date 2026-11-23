export type Val = number | string
export type ArrayView = { kind: 'array'; title?: string; values: Val[]; colors?: Record<number, string>; ptrs?: Record<string, number>; bars?: boolean }
export type GNode = { id: Val; x: number; y: number; label: Val; color?: string; sub?: Val }
export type GEdge = { a: Val; b: Val; label?: Val; color?: string; directed?: boolean }
export type GraphView = { kind: 'graph'; title?: string; nodes: GNode[]; edges: GEdge[] }
export type GridView = { kind: 'grid'; title?: string; cells: Val[][]; colors?: Record<string, string>; rows?: Val[]; cols?: Val[] }
export type PlotView = { kind: 'plot'; title?: string; points: { x: number; y: number; color?: string; r?: number }[]; lines?: { x1: number; y1: number; x2: number; y2: number; color?: string }[] }
export type View = ArrayView | GraphView | GridView | PlotView
export type Frame = { line: number; msg: string; views: View[]; vars?: Record<string, unknown> }
export type Algo = { name: string; cat: string; problems: string[]; code: string[]; input: string; hint?: string; rand: () => string; run: (s: string) => Frame[] }

export const C = { cmp: '#f5a623', swap: '#e74c3c', done: '#2ecc71', act: '#3498db', vis: '#9b59b6', dim: '#ccc' }
export const CATS = ['Searching', 'Sorting', 'Arrays & Hashing', 'Two Pointers', 'Sliding Window', 'Stack', 'Linked List', 'Trees', 'Tries', 'Heaps', 'Intervals', 'Graphs', 'Backtracking', 'Dynamic Programming', 'Bit Manipulation', 'ML Extras']

export class Tracer {
  frames: Frame[] = []
  add(line: number, msg: string, views: View | View[], vars?: Record<string, unknown>) {
    this.frames.push({ line, msg, views: structuredClone(Array.isArray(views) ? views : [views]), vars: vars && structuredClone(vars) })
  }
}

export const nums = (s: string) => s.split(/[\s,]+/).filter(Boolean).map(Number).filter(n => !isNaN(n))
export const ri = (lo: number, hi: number) => lo + Math.floor(Math.random() * (hi - lo + 1))
export const randNums = (n: number, lo = 1, hi = 50) => Array.from({ length: n }, () => ri(lo, hi)).join(', ')
export const arr = (values: Val[], colors?: Record<number, string>, ptrs?: Record<string, number>, title?: string): ArrayView => ({ kind: 'array', values, colors, ptrs, title })
export const bars = (values: number[], colors?: Record<number, string>, ptrs?: Record<string, number>): ArrayView => ({ kind: 'array', values, colors, ptrs, bars: true })
export const range = (a: number, b: number, c: string) => { const o: Record<number, string> = {}; for (let i = a; i <= b; i++) o[i] = c; return o }

// "0-1:4 1-2" -> edges, node count
export const parseEdges = (s: string) => {
  const edges = s.split(/[\s,]+/).filter(Boolean).map(t => { const [p, w] = t.split(':'); const [a, b] = p.split('-').map(Number); return { a, b, w: w === undefined ? 1 : Number(w) } }).filter(e => !isNaN(e.a) && !isNaN(e.b))
  const n = edges.reduce((m, e) => Math.max(m, e.a + 1, e.b + 1), 0)
  return { edges, n }
}
export const circle = (n: number) => Array.from({ length: n }, (_, i) => ({ x: 200 + 150 * Math.cos((2 * Math.PI * i) / n - Math.PI / 2), y: 170 + 140 * Math.sin((2 * Math.PI * i) / n - Math.PI / 2) }))
export const randGraph = (n: number, m: number, weighted = false, dag = false) => {
  const set = new Set<string>(); const out: string[] = []
  for (let i = 1; i < n; i++) { const p = ri(0, i - 1); set.add(`${p}-${i}`); out.push(`${p}-${i}${weighted ? ':' + ri(1, 9) : ''}`) }
  for (let k = 0; k < m * 3 && out.length < n - 1 + m; k++) {
    let a = ri(0, n - 1), b = ri(0, n - 1); if (a === b) continue; if (dag && a > b) [a, b] = [b, a]
    if (set.has(`${a}-${b}`) || set.has(`${b}-${a}`)) continue; set.add(`${a}-${b}`); out.push(`${a}-${b}${weighted ? ':' + ri(1, 9) : ''}`)
  }
  return out.join(' ')
}
export const graphView = (n: number, edges: { a: number; b: number; w?: number }[], nc: Record<number, string> = {}, ec: Record<string, string> = {}, opts: { directed?: boolean; weighted?: boolean; sub?: Record<number, Val>; title?: string } = {}): GraphView => {
  const pos = circle(n)
  return {
    kind: 'graph', title: opts.title,
    nodes: pos.map((p, i) => ({ id: i, ...p, label: i, color: nc[i], sub: opts.sub?.[i] })),
    edges: edges.map(e => ({ a: e.a, b: e.b, label: opts.weighted ? e.w : undefined, color: ec[`${e.a}-${e.b}`] ?? ec[`${e.b}-${e.a}`], directed: opts.directed })),
  }
}

// Binary trees: nodes stored in a map, laid out by in-order position
export type TNode = { id: number; val: number; left?: TNode; right?: TNode }
export const treeView = (root: TNode | undefined, colors: Record<number, string> = {}, title?: string): GraphView => {
  const nodes: GNode[] = []; const edges: GEdge[] = []; let x = 0
  const walk = (t: TNode | undefined, d: number) => {
    if (!t) return
    walk(t.left, d + 1); nodes.push({ id: t.id, x: 30 + 45 * x++, y: 30 + 60 * d, label: t.val, color: colors[t.id] }); walk(t.right, d + 1)
    if (t.left) edges.push({ a: t.id, b: t.left.id }); if (t.right) edges.push({ a: t.id, b: t.right.id })
  }
  walk(root, 0)
  return { kind: 'graph', title, nodes, edges }
}
// level-order list with "null" -> tree
export const buildTree = (s: string): TNode | undefined => {
  const t = s.split(/[\s,]+/).filter(Boolean); if (!t.length || t[0] === 'null') return
  let id = 0; const root: TNode = { id: id++, val: Number(t[0]) }; const q = [root]; let i = 1
  while (q.length && i < t.length) {
    const n = q.shift()!
    if (i < t.length && t[i] !== 'null') { n.left = { id: id++, val: Number(t[i]) }; q.push(n.left) } i++
    if (i < t.length && t[i] !== 'null') { n.right = { id: id++, val: Number(t[i]) }; q.push(n.right) } i++
  }
  return root
}
export const randTree = (n: number) => { const v = [...new Set(Array.from({ length: n }, () => ri(1, 99)))]; return v.join(', ') }
// linked list as a row graph
export const listView = (vals: Val[], colors: Record<number, string> = {}, next?: (number | null)[], title?: string, ptrs: Record<string, number> = {}): GraphView => {
  const sub: Record<number, string> = {}
  for (const [k, i] of Object.entries(ptrs)) if (i >= 0) sub[i] = sub[i] ? sub[i] + ',' + k : k
  return {
    kind: 'graph', title,
    nodes: vals.map((v, i) => ({ id: i, x: 40 + i * 75, y: 50, label: v, color: colors[i], sub: sub[i] })),
    edges: vals.flatMap((_, i) => { const j = next ? next[i] : i + 1 < vals.length ? i + 1 : null; return j === null || j === undefined ? [] : [{ a: i, b: j, directed: true }] }),
  }
}
