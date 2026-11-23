import { Algo, Tracer, C, GridView } from '../core'
export default {
  name: 'N-Queens', cat: 'Backtracking', input: '5', hint: 'board size n (4-8)', problems: ['N-Queens (51)', 'N-Queens II (52)', 'Sudoku Solver (37)'],
  code: ['place(r):', '  if r == n: record board; return True', '  for c in 0..n-1:', '    if col c and both diagonals are free:', '      put queen at (r, c); place(r+1)', '      remove queen  # backtrack'],
  rand: () => String(4 + Math.floor(Math.random() * 4)),
  run(s) {
    const n = Math.min(8, Math.max(4, Number(s) || 4)); const q: number[] = []; const tr = new Tracer(); let found = false
    const v = (r: number, c: number, cc: string): GridView => ({ kind: 'grid', cells: Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (q[i] === j ? '♛' : ''))), colors: { ...Object.fromEntries(q.map((j, i) => [`${i},${j}`, C.done])), [`${r},${c}`]: cc } })
    const ok = (r: number, c: number) => q.every((j, i) => j !== c && Math.abs(j - c) !== r - i)
    const place = (r: number): boolean => {
      if (r === n) { tr.add(2, 'All queens placed', v(-1, -1, '')); return true }
      for (let c = 0; c < n; c++) {
        if (!ok(r, c)) { tr.add(4, `(${r},${c}) is attacked`, v(r, c, C.swap)); continue }
        q.push(c); tr.add(5, `Place queen at (${r},${c})`, v(r, c, C.act))
        if (place(r + 1)) return true
        q.pop(); tr.add(6, `Backtrack from (${r},${c})`, v(r, c, C.cmp))
      }
      return false
    }
    found = place(0); if (!found) tr.add(1, 'No solution', v(-1, -1, '')); return tr.frames
  },
} satisfies Algo
