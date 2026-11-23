import { Algo, Tracer, C, nums, arr, range, ri } from '../core'
export default {
  name: 'Search Rotated Array', cat: 'Searching', input: '15, 18, 22, 3, 6, 9, 12 | 6', hint: 'rotated sorted values | target',
  problems: ['Search in Rotated Sorted Array (33)', 'Find Minimum in Rotated Sorted Array (153)'],
  code: ['lo, hi = 0, n-1', 'while lo <= hi:', '  mid = (lo+hi) // 2', '  if a[mid] == target: return mid', '  if a[lo] <= a[mid]:  # left half sorted', '    if a[lo] <= target < a[mid]: hi = mid-1', '    else: lo = mid+1', '  else:  # right half sorted', '    if a[mid] < target <= a[hi]: lo = mid+1', '    else: hi = mid-1', 'return -1'],
  rand: () => { const a = [...new Set(Array.from({ length: 9 }, () => ri(1, 60)))].sort((x, y) => x - y); const k = ri(1, a.length - 1); const r = [...a.slice(k), ...a.slice(0, k)]; return `${r.join(', ')} | ${r[ri(0, r.length - 1)]}` },
  run(s) {
    const [p, q] = s.split('|'); const a = nums(p); const t = Number(q); const tr = new Tracer(); let lo = 0, hi = a.length - 1
    const col = (m: number) => ({ ...range(0, a.length - 1, C.dim), ...range(lo, hi, '#fff'), [m]: C.cmp })
    while (lo <= hi) {
      const mid = (lo + hi) >> 1
      tr.add(3, `mid = ${mid}`, arr(a, col(mid), { lo, hi, mid }), { lo, hi, mid })
      if (a[mid] === t) { tr.add(4, `Found at ${mid}`, arr(a, { [mid]: C.done }, { mid })); return tr.frames }
      if (a[lo] <= a[mid]) {
        const go = a[lo] <= t && t < a[mid]
        tr.add(5, `Left half [${lo}..${mid}] is sorted`, arr(a, { ...col(mid), ...range(lo, mid - 1, C.act) }, { lo, hi, mid }))
        if (go) { hi = mid - 1; tr.add(6, 'Target in sorted left half', arr(a, col(-1), { lo, hi })) } else { lo = mid + 1; tr.add(7, 'Target not in left half', arr(a, col(-1), { lo, hi })) }
      } else {
        const go = a[mid] < t && t <= a[hi]
        tr.add(8, `Right half [${mid}..${hi}] is sorted`, arr(a, { ...col(mid), ...range(mid + 1, hi, C.act) }, { lo, hi, mid }))
        if (go) { lo = mid + 1; tr.add(9, 'Target in sorted right half', arr(a, col(-1), { lo, hi })) } else { hi = mid - 1; tr.add(10, 'Target not in right half', arr(a, col(-1), { lo, hi })) }
      }
    }
    tr.add(11, 'Not found', arr(a)); return tr.frames
  },
} satisfies Algo
