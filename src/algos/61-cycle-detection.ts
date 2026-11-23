import { Algo, Tracer, C, nums, listView, randNums, ri } from '../core'
export default {
  name: 'Fast & Slow Pointers', cat: 'Linked List', input: '3, 2, 0, -4, 7 | 1', hint: 'values | index the tail links back to (-1 for none)',
  problems: ['Linked List Cycle (141)', 'Linked List Cycle II (142)', 'Find the Duplicate Number (287)', 'Middle of the Linked List (876)', 'Remove Nth Node From End (19)'],
  code: ['slow = fast = head', 'while fast and fast.next:', '  slow = slow.next', '  fast = fast.next.next', '  if slow == fast: return True', 'return False'],
  rand: () => `${randNums(6, 1, 9)} | ${ri(-1, 5)}`,
  run(s) {
    const [p, q] = s.split('|'); const v = nums(p); const pos = Number(q ?? -1); const next = v.map((_, i) => (i + 1 < v.length ? i + 1 : pos >= 0 && pos < v.length ? pos : null))
    const tr = new Tracer(); let slow = 0, fast = 0
    const show = (line: number, msg: string, c: Record<number, string> = {}) => tr.add(line, msg, listView(v, { [slow]: C.act, [fast]: C.cmp, ...c }, next, 'list', { slow, fast }), { slow, fast })
    show(1, 'Both start at head')
    for (let g = 0; g < 4 * v.length; g++) {
      if (fast === null || next[fast] === null) { show(6, 'fast hit the end: no cycle'); return tr.frames }
      slow = next[slow]!; fast = next[next[fast]!]!
      show(4, 'slow moves 1, fast moves 2')
      if (slow === fast) { show(5, 'They meet: cycle found', { [slow]: C.done }); return tr.frames }
      if (fast === null) break
    }
    show(6, 'No cycle'); return tr.frames
  },
} satisfies Algo
