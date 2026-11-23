import { Algo, Tracer, C, GridView, ri } from '../core'
const parse = (t: string) => t.trim().split(';').map(r => r.trim().split(/[\s,]+/).map(Number))
export default {
  name: 'Matrix Multiply', cat: 'ML Extras', input: '1 2; 3 4; 5 6 | 7 8 9; 10 11 12', hint: 'A rows separated by ; | B rows separated by ;',
  problems: ['Neural network layer: y = Wx', 'Rotate Image (48)', 'Spiral Matrix (54)', 'Set Matrix Zeroes (73)'],
  code: ['C = zeros(m, p)', 'for i in 0..m-1: for j in 0..p-1:', '  C[i][j] = sum(A[i][k] * B[k][j] for k)'],
  rand: () => { const m = (r: number, c: number) => Array.from({ length: r }, () => Array.from({ length: c }, () => ri(0, 9)).join(' ')).join('; '); return `${m(2, 3)} | ${m(3, 2)}` },
  run(s) {
    const [pa, pb] = s.split('|'); const A = parse(pa), B = parse(pb ?? ''); const m = A.length, n = B.length, p = B[0]?.length ?? 0; const tr = new Tracer()
    if (A[0].length !== n) throw new Error(`A is ${m}x${A[0].length} but B is ${n}x${p}`)
    const Cm: (number | string)[][] = Array.from({ length: m }, () => Array(p).fill(''))
    const g = (t: string, M: (number | string)[][], col: Record<string, string>): GridView => ({ kind: 'grid', title: t, cells: M.map(r => [...r]), colors: col })
    for (let i = 0; i < m; i++) for (let j = 0; j < p; j++) {
      let sum = 0
      for (let k = 0; k < n; k++) { sum += A[i][k] * B[k][j]; Cm[i][j] = sum; tr.add(3, `C[${i}][${j}] += ${A[i][k]} × ${B[k][j]} → ${sum}`, [g('A', A, { [`${i},${k}`]: C.cmp }), g('B', B, { [`${k},${j}`]: C.cmp }), g('C', Cm, { [`${i},${j}`]: C.act })]) }
    }
    tr.add(2, 'Done', [g('A', A, {}), g('B', B, {}), g('C', Cm, {})]); return tr.frames
  },
} satisfies Algo
