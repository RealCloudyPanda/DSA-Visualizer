import { Algo, Tracer, C, nums, arr, randNums } from '../core'
export default {
  name: 'Permutations (Backtracking)', cat: 'Backtracking', input: '1, 2, 3', problems: ['Permutations (46)', 'Permutations II (47)', 'Word Search (79)', 'Generate Parentheses (22)'],
  code: ['bt(path, used):', '  if len(path) == n: result.append(path); return', '  for i in 0..n-1:', '    if used[i]: continue', '    used[i] = True; path.append(a[i]); bt()', '    path.pop(); used[i] = False  # undo'],
  rand: () => randNums(3, 1, 9),
  run(s) {
    const a = nums(s).slice(0, 4); const used = a.map(() => false); const path: number[] = []; const res: string[] = []; const tr = new Tracer()
    const show = (line: number, msg: string, i = -1) => tr.add(line, msg, [arr(a, { ...Object.fromEntries(used.flatMap((u, k) => (u ? [[k, C.dim]] : []))), ...(i >= 0 ? { [i]: C.cmp } : {}) }), arr(path, {}, {}, 'path'), arr(res, {}, {}, 'permutations')])
    const bt = () => {
      if (path.length === a.length) { res.push(`[${path}]`); show(2, `Record [${path}]`); return }
      for (let i = 0; i < a.length; i++) {
        if (used[i]) continue
        used[i] = true; path.push(a[i]); show(5, `Choose ${a[i]}`, i); bt()
        path.pop(); used[i] = false; show(6, `Undo ${a[i]}`, i)
      }
    }
    bt(); return tr.frames
  },
} satisfies Algo
