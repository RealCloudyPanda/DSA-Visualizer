import { Algo, Tracer, C, nums, arr, randNums } from '../core'
export default {
  name: 'Linear Search', cat: 'Searching', input: '7, 3, 9, 1, 5, 8 | 5', hint: 'values | target',
  problems: ['Find element in unsorted array', 'Contains Duplicate (brute force)'],
  code: ['for i in 0..n-1:', '  if a[i] == target:', '    return i', 'return -1'],
  rand: () => `${randNums(8, 1, 20)} | ${Math.floor(Math.random() * 20) + 1}`,
  run(s) {
    const [p, q] = s.split('|'); const a = nums(p); const t = Number(q); const tr = new Tracer()
    for (let i = 0; i < a.length; i++) {
      tr.add(1, `Check index ${i}`, arr(a, { [i]: C.cmp }, { i }), { i, target: t })
      if (a[i] === t) { tr.add(3, `Found ${t} at index ${i}`, arr(a, { [i]: C.done }, { i }), { i }); return tr.frames }
      tr.add(2, `${a[i]} != ${t}`, arr(a, { [i]: C.dim }, { i }), { i })
    }
    tr.add(4, `${t} not found`, arr(a), { result: -1 }); return tr.frames
  },
} satisfies Algo
