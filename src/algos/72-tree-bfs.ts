import { Algo, Tracer, C, buildTree, treeView, TNode, arr, randNums } from '../core'
export default {
  name: 'Tree BFS (Level Order)', cat: 'Trees', input: '3, 9, 20, null, null, 15, 7', hint: 'level-order values, null for gaps',
  problems: ['Binary Tree Level Order Traversal (102)', 'Binary Tree Right Side View (199)', 'Count Good Nodes (1448)', 'Minimum Depth of Binary Tree (111)'],
  code: ['q = deque([root])', 'while q:', '  level = []', '  for _ in range(len(q)):', '    node = q.popleft(); level.append(node.val)', '    push node.left, node.right if present', '  result.append(level)'],
  rand: () => randNums(9, 1, 9),
  run(s) {
    const root = buildTree(s); const tr = new Tracer(); if (!root) return tr.frames
    const q: TNode[] = [root]; const col: Record<number, string> = {}; const res: string[] = []
    const show = (line: number, msg: string, cur?: TNode) => tr.add(line, msg, [treeView(root, { ...col, ...Object.fromEntries(q.map(n => [n.id, C.vis])), ...(cur ? { [cur.id]: C.cmp } : {}) }), arr(q.map(n => n.val), {}, {}, 'queue (front on left)'), arr(res, {}, {}, 'levels')])
    show(1, 'Queue the root')
    while (q.length) {
      const lvl: number[] = []; const n = q.length
      for (let k = 0; k < n; k++) {
        const cur = q.shift()!; lvl.push(cur.val); col[cur.id] = C.done; show(5, `Pop ${cur.val}`, cur)
        if (cur.left) q.push(cur.left); if (cur.right) q.push(cur.right); show(6, 'Queue its children', cur)
      }
      res.push(`[${lvl}]`); show(7, `Level done: [${lvl}]`)
    }
    return tr.frames
  },
} satisfies Algo
