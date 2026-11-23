import { Algo, Tracer, C, nums, arr, randNums, range } from '../core'
export default {
  name: 'Binary Search', cat: 'Searching', input: '1, 3, 5, 7, 9, 11, 13, 15 | 11', hint: 'values (sorted for you) | target',
  problems: ['Binary Search (704)', 'Search a 2D Matrix (74)', 'Koko Eating Bananas (875)', 'Time Based Key-Value Store (981)', 'Median of Two Sorted Arrays (4)'],
  code: ['lo, hi = 0, n-1', 'while lo <= hi:', '  mid = (lo+hi) // 2', '  if a[mid] == target: return mid', '  if a[mid] < target: lo = mid+1', '  else: hi = mid-1', 'return -1'],
  rand: () => { const a = randNums(10, 1, 60).split(', ').map(Number).sort((x, y) => x - y); return `${a.join(', ')} | ${a[Math.floor(Math.random() * a.length)]}` },
  run(s) {
    const [p, q] = s.split('|'); const a = nums(p).sort((x, y) => x - y); const t = Number(q); const tr = new Tracer()
    let lo = 0, hi = a.length - 1
    const col = (m?: number) => ({ ...range(0, a.length - 1, C.dim), ...range(lo, hi, '#fff'), ...(m !== undefined ? { [m]: C.cmp } : {}) })
    tr.add(1, 'Search the whole array', arr(a, col(), { lo, hi }), { lo, hi })
    while (lo <= hi) {
      const mid = (lo + hi) >> 1
      tr.add(3, `mid = ${mid}, a[mid] = ${a[mid]}`, arr(a, col(mid), { lo, hi, mid }), { lo, hi, mid })
      if (a[mid] === t) { tr.add(4, `Found ${t} at ${mid}`, arr(a, { [mid]: C.done }, { mid }), { mid }); return tr.frames }
      if (a[mid] < t) { lo = mid + 1; tr.add(5, `${a[mid]} < ${t}: discard left half`, arr(a, col(), { lo, hi }), { lo, hi }) }
      else { hi = mid - 1; tr.add(6, `${a[mid]} > ${t}: discard right half`, arr(a, col(), { lo, hi }), { lo, hi }) }
    }
    tr.add(7, `${t} not found`, arr(a, range(0, a.length - 1, C.dim)), { result: -1 }); return tr.frames
  },
} satisfies Algo
