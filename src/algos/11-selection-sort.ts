import { Algo, Tracer, C, nums, bars, randNums, range } from '../core'
export default {
  name: 'Selection Sort', cat: 'Sorting', input: '64, 25, 12, 22, 11', problems: ['Sort an Array (912)'],
  code: ['for i in 0..n-1:', '  m = i', '  for j in i+1..n-1:', '    if a[j] < a[m]: m = j', '  swap(a[i], a[m])'],
  rand: () => randNums(10),
  run(s) {
    const a = nums(s); const n = a.length; const tr = new Tracer()
    for (let i = 0; i < n; i++) {
      let m = i; const done = range(0, i - 1, C.done)
      tr.add(2, `Assume min at ${i}`, bars(a, { ...done, [m]: C.act }, { i, m }), { i, m })
      for (let j = i + 1; j < n; j++) {
        tr.add(3, `Compare ${a[j]} with min ${a[m]}`, bars(a, { ...done, [m]: C.act, [j]: C.cmp }, { i, m, j }), { i, m, j })
        if (a[j] < a[m]) { m = j; tr.add(4, `New min ${a[m]}`, bars(a, { ...done, [m]: C.act }, { i, m }), { i, m }) }
      }
      [a[i], a[m]] = [a[m], a[i]]; tr.add(5, `Swap min into index ${i}`, bars(a, { ...done, [i]: C.swap, [m]: C.swap }, { i, m }), { i, m })
    }
    tr.add(1, 'Sorted', bars(a, range(0, n - 1, C.done))); return tr.frames
  },
} satisfies Algo
