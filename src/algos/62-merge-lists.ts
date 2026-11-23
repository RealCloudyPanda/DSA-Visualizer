import { Algo, Tracer, C, nums, listView, randNums, arr } from '../core'
export default {
  name: 'Merge Two Sorted Lists', cat: 'Linked List', input: '1, 2, 4 | 1, 3, 4', hint: 'list A | list B (each sorted for you)',
  problems: ['Merge Two Sorted Lists (21)', 'Merge k Sorted Lists (23)', 'Add Two Numbers (2)', 'Copy List with Random Pointer (138)'],
  code: ['dummy = tail = Node()', 'while a and b:', '  if a.val <= b.val: tail.next = a; a = a.next', '  else: tail.next = b; b = b.next', '  tail = tail.next', 'tail.next = a or b', 'return dummy.next'],
  rand: () => `${randNums(4, 1, 20)} | ${randNums(4, 1, 20)}`,
  run(s) {
    const [p, q] = s.split('|'); const A = nums(p).sort((x, y) => x - y), B = nums(q ?? '').sort((x, y) => x - y); const out: number[] = []; const tr = new Tracer(); let i = 0, j = 0
    const show = (line: number, msg: string) => tr.add(line, msg, [listView(A, { [i]: C.act }, undefined, 'A', { a: i }), listView(B, { [j]: C.act }, undefined, 'B', { b: j }), out.length ? listView(out, { [out.length - 1]: C.done }, undefined, 'merged', { tail: out.length - 1 }) : arr([], {}, {}, 'merged')])
    show(1, 'Start with an empty merged list')
    while (i < A.length && j < B.length) {
      if (A[i] <= B[j]) { out.push(A[i++]); show(3, `Take ${out[out.length - 1]} from A`) } else { out.push(B[j++]); show(4, `Take ${out[out.length - 1]} from B`) }
    }
    while (i < A.length) out.push(A[i++]); while (j < B.length) out.push(B[j++])
    show(6, 'Append the remainder'); return tr.frames
  },
} satisfies Algo
