import { Algo, Tracer, C, nums, arr, randNums } from '../core'
export default {
  name: 'Subsets (Backtracking)', cat: 'Backtracking', input: '1, 2, 3', problems: ['Subsets (78)', 'Subsets II (90)', 'Combination Sum (39)', 'Combination Sum II (40)', 'Letter Combinations of a Phone Number (17)', 'Palindrome Partitioning (131)'],
  code: ['bt(i, path):', '  if i == n: result.append(path); return', '  path.append(a[i]); bt(i+1, path)  # take', '  path.pop(); bt(i+1, path)  # skip'],
  rand: () => randNums(3, 1, 9),
  run(s) {
    const a = nums(s).slice(0, 5); const path: number[] = []; const res: string[] = []; const tr = new Tracer()
    const show = (line: number, msg: string, i: number) => tr.add(line, msg, [arr(a, { [i]: C.cmp }, { i }), arr(path, {}, {}, 'path'), arr(res, {}, {}, 'subsets')], { i })
    const bt = (i: number) => {
      if (i === a.length) { res.push(`{${path}}`); show(2, `Record {${path}}`, i); return }
      path.push(a[i]); show(3, `Take ${a[i]}`, i); bt(i + 1)
      path.pop(); show(4, `Skip ${a[i]}`, i); bt(i + 1)
    }
    bt(0); return tr.frames
  },
} satisfies Algo
