import { Algo, Tracer, C, nums, arr, randNums } from '../core'
export default {
  name: 'Counting / Bucket Sort', cat: 'Sorting', input: '4, 2, 2, 8, 3, 3, 1', problems: ['Top K Frequent Elements (347) bucket sort', 'Sort Colors (75)', 'Maximum Gap (164)'],
  code: ['count = [0] * (max+1)', 'for x in a: count[x] += 1', 'out = []', 'for v in 0..max:', '  out += [v] * count[v]'],
  rand: () => randNums(10, 0, 9),
  run(s) {
    const a = nums(s).map(x => Math.max(0, Math.floor(x))); const mx = Math.max(0, ...a); const cnt = Array(mx + 1).fill(0); const out: number[] = []; const tr = new Tracer()
    const v = (ai?: number, ci?: number) => [arr(a, ai !== undefined ? { [ai]: C.cmp } : {}, {}, 'input'), arr(cnt, ci !== undefined ? { [ci]: C.act } : {}, {}, 'count (index = value)'), arr(out, {}, {}, 'output')]
    tr.add(1, 'Make a count array', v())
    a.forEach((x, i) => { cnt[x]++; tr.add(2, `count[${x}]++`, v(i, x)) })
    for (let x = 0; x <= mx; x++) if (cnt[x]) { for (let k = 0; k < cnt[x]; k++) out.push(x); tr.add(5, `Emit ${x} x${cnt[x]}`, v(undefined, x)) }
    tr.add(5, 'Sorted', [arr(out, Object.fromEntries(out.map((_, i) => [i, C.done])), {}, 'output')]); return tr.frames
  },
} satisfies Algo
