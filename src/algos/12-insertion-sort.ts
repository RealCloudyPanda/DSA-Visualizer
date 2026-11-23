import { Algo, Tracer, C, nums, bars, randNums, range } from '../core'
export default {
  name: 'Insertion Sort', cat: 'Sorting', input: '12, 11, 13, 5, 6', problems: ['Insertion Sort List (147)', 'Sort an Array (912)'],
  code: ['for i in 1..n-1:', '  key = a[i]; j = i-1', '  while j >= 0 and a[j] > key:', '    a[j+1] = a[j]; j -= 1', '  a[j+1] = key'],
  rand: () => randNums(10),
  run(s) {
    const a = nums(s); const n = a.length; const tr = new Tracer()
    for (let i = 1; i < n; i++) {
      const key = a[i]; let j = i - 1
      tr.add(2, `Insert key ${key}`, bars(a, { ...range(0, i - 1, C.done), [i]: C.act }, { i }), { i, key })
      while (j >= 0 && a[j] > key) {
        a[j + 1] = a[j]; tr.add(4, `${a[j]} > ${key}: shift right`, bars(a, { ...range(0, i, C.done), [j]: C.cmp, [j + 1]: C.swap }, { j }), { i, j, key }); j--
      }
      a[j + 1] = key; tr.add(5, `Place ${key} at ${j + 1}`, bars(a, { ...range(0, i, C.done), [j + 1]: C.act }, { i }), { i, key })
    }
    tr.add(1, 'Sorted', bars(a, range(0, n - 1, C.done))); return tr.frames
  },
} satisfies Algo
