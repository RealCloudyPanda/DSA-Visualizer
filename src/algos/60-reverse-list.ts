import { Algo, Tracer, C, nums, listView, randNums } from '../core'
export default {
  name: 'Reverse Linked List', cat: 'Linked List', input: '1, 2, 3, 4, 5', problems: ['Reverse Linked List (206)', 'Reorder List (143)', 'Reverse Nodes in k-Group (25)', 'Palindrome Linked List (234)'],
  code: ['prev = None; cur = head', 'while cur:', '  nxt = cur.next', '  cur.next = prev', '  prev = cur; cur = nxt', 'return prev'],
  rand: () => randNums(6, 1, 9),
  run(s) {
    const v = nums(s); const next: (number | null)[] = v.map((_, i) => (i + 1 < v.length ? i + 1 : null)); const tr = new Tracer(); let prev = -1, cur = 0
    const show = (line: number, msg: string, nxt = -1) => tr.add(line, msg, listView(v, { ...(prev >= 0 ? { [prev]: C.done } : {}), ...(cur < v.length && cur >= 0 ? { [cur]: C.act } : {}) }, next, 'list (arrows = next)', { prev, cur, nxt }))
    show(1, 'prev = null, cur = head')
    while (cur >= 0 && cur < v.length) {
      const nxt = next[cur] ?? -1; show(3, 'Save next', nxt)
      next[cur] = prev >= 0 ? prev : null; show(4, `Point ${v[cur]} back to ${prev >= 0 ? v[prev] : 'null'}`, nxt)
      prev = cur; cur = nxt; show(5, 'Advance prev and cur')
    }
    show(6, `New head is ${v[prev]}`); return tr.frames
  },
} satisfies Algo
