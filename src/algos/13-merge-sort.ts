import { Algo, Tracer, C, nums, bars, randNums, range } from '../core'
export default {
  name: 'Merge Sort', cat: 'Sorting', input: '38, 27, 43, 3, 9, 82, 10', problems: ['Sort an Array (912)', 'Sort List (148)', 'Merge k Sorted Lists (23)', 'Count of Smaller Numbers After Self (315)'],
  code: ['sort(lo, hi):', '  if lo >= hi: return', '  mid = (lo+hi) // 2', '  sort(lo, mid); sort(mid+1, hi)', '  merge: take smaller head of', '    a[lo..mid] and a[mid+1..hi]', '  write merged back into a[lo..hi]'],
  rand: () => randNums(10),
  run(s) {
    const a = nums(s); const tr = new Tracer()
    const sort = (lo: number, hi: number) => {
      if (lo >= hi) return
      const mid = (lo + hi) >> 1
      tr.add(3, `Split [${lo}..${hi}] at ${mid}`, bars(a, { ...range(lo, mid, C.act), ...range(mid + 1, hi, C.vis) }, { lo, mid, hi }), { lo, mid, hi })
      sort(lo, mid); sort(mid + 1, hi)
      const L = a.slice(lo, mid + 1), R = a.slice(mid + 1, hi + 1); let i = 0, j = 0, k = lo
      while (i < L.length || j < R.length) {
        const takeL = j >= R.length || (i < L.length && L[i] <= R[j])
        a[k] = takeL ? L[i++] : R[j++]
        tr.add(5, `Take ${a[k]} from ${takeL ? 'left' : 'right'}`, bars(a, { ...range(lo, k - 1, C.done), [k]: C.swap }, { k }), { lo, hi, k, left: L.slice(i), right: R.slice(j) }); k++
      }
      tr.add(7, `[${lo}..${hi}] merged`, bars(a, range(lo, hi, C.done)), { lo, hi })
    }
    sort(0, a.length - 1); return tr.frames
  },
} satisfies Algo
