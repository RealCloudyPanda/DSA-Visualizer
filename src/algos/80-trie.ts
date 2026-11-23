import { Algo, Tracer, C, GraphView, GNode, GEdge } from '../core'
type N = { id: number; ch: string; end: boolean; kids: Map<string, N> }
const view = (root: N, col: Record<number, string>): GraphView => {
  const nodes: GNode[] = []; const edges: GEdge[] = []; let x = 0
  const walk = (n: N, d: number): number => {
    const ks = [...n.kids.values()]; const xs = ks.map(k => walk(k, d + 1)); const mx = xs.length ? (xs[0] + xs[xs.length - 1]) / 2 : 30 + 45 * x++
    nodes.push({ id: n.id, x: mx, y: 30 + 60 * d, label: n.ch, color: col[n.id] ?? (n.end ? '#d5f5e3' : undefined), sub: n.end ? '•end' : undefined }); ks.forEach(k => edges.push({ a: n.id, b: k.id })); return mx
  }
  walk(root, 0); return { kind: 'graph', nodes, edges }
}
export default {
  name: 'Trie (Prefix Tree)', cat: 'Tries', input: 'cat car cart dog do | car ca', hint: 'words to insert | words to search',
  problems: ['Implement Trie (208)', 'Design Add and Search Words (211)', 'Word Search II (212)', 'Longest Common Prefix (14)'],
  code: ['insert(w): node = root', '  for c in w: node = node.kids.setdefault(c, Node())', '  node.end = True', 'search(w): node = root', '  for c in w:', '    if c not in node.kids: return False', '    node = node.kids[c]', '  return node.end'],
  rand: () => 'tea ten to inn in | ten te',
  run(s) {
    const [p, q] = s.split('|'); let id = 0; const root: N = { id: id++, ch: '•', end: false, kids: new Map() }; const tr = new Tracer()
    for (const w of p.trim().split(/\s+/).filter(Boolean)) {
      let n = root
      for (const c of w) { const made = !n.kids.has(c); if (made) n.kids.set(c, { id: id++, ch: c, end: false, kids: new Map() }); n = n.kids.get(c)!; tr.add(2, `${made ? 'Create' : 'Follow'} '${c}' for "${w}"`, view(root, { [n.id]: made ? C.act : C.cmp })) }
      n.end = true; tr.add(3, `Mark end of "${w}"`, view(root, { [n.id]: C.done }))
    }
    for (const w of (q ?? '').trim().split(/\s+/).filter(Boolean)) {
      let n: N | undefined = root; const path: Record<number, string> = {}
      for (const c of w) { n = n.kids.get(c); if (!n) { tr.add(6, `"${w}": no '${c}' child, not found`, view(root, path)); break } path[n.id] = C.cmp; tr.add(7, `"${w}": follow '${c}'`, view(root, path)) }
      if (n) tr.add(8, `"${w}" ${n.end ? 'is a word' : 'is only a prefix'}`, view(root, { ...path, [n.id]: n.end ? C.done : C.swap }))
    }
    return tr.frames
  },
} satisfies Algo
