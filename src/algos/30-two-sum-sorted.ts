import { Algo, Tracer, C, nums, arr, randNums } from '../core'
export default {
  name: 'Two Sum II (Two Pointers)', cat: 'Two Pointers', input: '1, 3, 4, 6, 8, 11, 15 | 14', hint: 'values (sorted for you) | target',
  problems: ['Two Sum II (167)', '3Sum (15)', 'Trapping Rain Water (42)', 'Squares of a Sorted Array (977)'],
  code: ['l, r = 0, n-1', 'while l < r:', '  s = a[l] + a[r]', '  if s == target: return [l, r]', '  if s < target: l += 1', '  else: r -= 1'],
  rand: () => { const a = randNums(8, 1, 30).split(', ').map(Number).sort((x, y) => x - y); return `${a.join(', ')} | ${a[1] + a[6]}` },
  run(s) {
    const [p, q] = s.split('|'); const a = nums(p).sort((x, y) => x - y); const t = Number(q); const tr = new Tracer(); let l = 0, r = a.length - 1
    while (l < r) {
      const sm = a[l] + a[r]; tr.add(3, `${a[l]} + ${a[r]} = ${sm}`, arr(a, { [l]: C.cmp, [r]: C.cmp }, { l, r }), { l, r, sum: sm })
      if (sm === t) { tr.add(4, 'Found the pair', arr(a, { [l]: C.done, [r]: C.done }, { l, r })); return tr.frames }
      if (sm < t) { l++; tr.add(5, 'Too small: move l right', arr(a, {}, { l, r })) } else { r--; tr.add(6, 'Too big: move r left', arr(a, {}, { l, r })) }
    }
    tr.add(2, 'No pair', arr(a)); return tr.frames
  },
} satisfies Algo
