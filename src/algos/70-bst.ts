import { Algo, Tracer, C, nums, treeView, TNode, randTree, ri } from '../core'
export default {
  name: 'Binary Search Tree', cat: 'Trees', input: '50, 30, 70, 20, 40, 60, 80 | 60', hint: 'insert values in order | value to search',
  problems: ['Search in a BST (700)', 'Insert into a BST (701)', 'Validate BST (98)', 'Kth Smallest Element in a BST (230)', 'Lowest Common Ancestor of a BST (235)'],
  code: ['insert(x): cur = root', '  while cur: go left if x < cur.val else right', '  attach new node at the empty spot', 'search(x): cur = root', '  while cur and cur.val != x:', '    cur = cur.left if x < cur.val else cur.right', '  return cur'],
  rand: () => { const v = randTree(9); return `${v} | ${v.split(', ')[ri(0, 8)]}` },
  run(s) {
    const [p, q] = s.split('|'); const vals = nums(p); const t = Number(q); const tr = new Tracer(); let root: TNode | undefined; let id = 0
    for (const x of vals) {
      if (!root) { root = { id: id++, val: x }; tr.add(3, `${x} becomes the root`, treeView(root, { 0: C.done })); continue }
      let cur = root
      for (;;) {
        tr.add(2, `${x} ${x < cur.val ? '<' : '>='} ${cur.val}: go ${x < cur.val ? 'left' : 'right'}`, treeView(root, { [cur.id]: C.cmp }), { inserting: x })
        const side = x < cur.val ? 'left' : 'right'
        if (!cur[side]) { cur[side] = { id: id++, val: x }; tr.add(3, `Attach ${x}`, treeView(root, { [id - 1]: C.done })); break }
        cur = cur[side]!
      }
    }
    let cur = root
    while (cur && cur.val !== t) { tr.add(5, `Search ${t}: compare ${cur.val}`, treeView(root, { [cur.id]: C.cmp }), { target: t }); cur = t < cur.val ? cur.left : cur.right }
    tr.add(7, cur ? `Found ${t}` : `${t} not in tree`, treeView(root, cur ? { [cur.id]: C.done } : {})); return tr.frames
  },
} satisfies Algo
