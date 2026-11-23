import { Algo, Tracer, C, nums, bars, randNums, range } from '../core'
export default {
  name: 'Bubble Sort', cat: 'Sorting', input: '5, 1, 4, 2, 8, 3', problems: ['Sort an Array (912)', 'Sort Colors (75)'],
  code: ['for i in 0..n-1:', '  for j in 0..n-i-2:', '    if a[j] > a[j+1]:', '      swap(a[j], a[j+1])'],
  rand: () => randNums(10),
  run(s) {
    const a = nums(s); const n = a.length; const tr = new Tracer()
    for (let i = 0; i < n; i++) {
      const done = range(n - i, n - 1, C.done)
      for (let j = 0; j < n - i - 1; j++) {
        tr.add(3, `Compare ${a[j]} and ${a[j + 1]}`, bars(a, { ...done, [j]: C.cmp, [j + 1]: C.cmp }, { j }), { i, j })
        if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; tr.add(4, 'Swap', bars(a, { ...done, [j]: C.swap, [j + 1]: C.swap }, { j }), { i, j }) }
      }
      tr.add(1, `${a[n - i - 1]} is in place`, bars(a, range(n - i - 1, n - 1, C.done)), { i })
    }
    return tr.frames
  },
} satisfies Algo
