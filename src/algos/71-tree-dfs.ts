import { Algo, Tracer, C, buildTree, treeView, TNode, arr, randNums } from '../core'
export default {
  name: 'Tree DFS Traversals', cat: 'Trees', input: '1, 2, 3, 4, 5, null, 6 | in', hint: 'level-order values (null for gaps) | pre, in or post',
  problems: ['Binary Tree Inorder Traversal (94)', 'Maximum Depth of Binary Tree (104)', 'Invert Binary Tree (226)', 'Diameter of Binary Tree (543)', 'Same Tree (100)', 'Path Sum (112)', 'Binary Tree Maximum Path Sum (124)', 'Construct Tree from Preorder and Inorder (105)', 'Serialize and Deserialize Binary Tree (297)'],
  code: ['dfs(node):', '  if not node: return', '  [pre]  visit(node)', '  dfs(node.left)', '  [in]   visit(node)', '  dfs(node.right)', '  [post] visit(node)'],
  rand: () => `${randNums(7, 1, 9)} | ${['pre', 'in', 'post'][Math.floor(Math.random() * 3)]}`,
  run(s) {
    const [p, q] = s.split('|'); const root = buildTree(p); const mode = (q ?? 'in').trim(); const tr = new Tracer(); const out: number[] = []; const col: Record<number, string> = {}; const stack: number[] = []
    const show = (line: number, msg: string, n: TNode) => tr.add(line, msg, [treeView(root, { ...col, [n.id]: C.cmp }), arr(out, {}, {}, `${mode}order output`), arr(stack, {}, {}, 'call stack')])
    const visit = (n: TNode, line: number) => { out.push(n.val); col[n.id] = C.done; show(line, `Visit ${n.val}`, n) }
    const dfs = (n?: TNode) => {
      if (!n) return
      stack.push(n.val); show(1, `Enter ${n.val}`, n)
      if (mode === 'pre') visit(n, 3)
      dfs(n.left); if (mode === 'in') visit(n, 5)
      dfs(n.right); if (mode === 'post') visit(n, 7)
      stack.pop()
    }
    dfs(root); return tr.frames
  },
} satisfies Algo
