import { Algo, Tracer, C, nums, arr, GridView, ri } from '../core'
const bits = (x: number) => (x >>> 0).toString(2).padStart(8, '0').slice(-8).split('')
export default {
  name: 'XOR Tricks (Single Number)', cat: 'Bit Manipulation', input: '4, 1, 2, 1, 2', problems: ['Single Number (136)', 'Missing Number (268)', 'Reverse Bits (190)', 'Sum of Two Integers (371)'],
  code: ['res = 0', 'for x in a:', '  res ^= x  # x ^ x = 0, x ^ 0 = x', 'return res'],
  rand: () => { const a = Array.from({ length: 3 }, () => ri(1, 30)); return [...a, ...a.slice(1), ri(31, 60)].sort(() => Math.random() - 0.5).join(', ') },
  run(s) {
    const a = nums(s); let res = 0; const tr = new Tracer()
    const g = (x: number): GridView => ({ kind: 'grid', rows: ['x', 'res'], cols: [128, 64, 32, 16, 8, 4, 2, 1], cells: [bits(x), bits(res)], colors: Object.fromEntries(bits(res).flatMap((b, j) => (b === '1' ? [[`1,${j}`, C.act]] : []))) })
    tr.add(1, 'res = 0', [arr(a), g(0)])
    a.forEach((x, i) => { res ^= x; tr.add(3, `res ^= ${x} → ${res}`, [arr(a, { [i]: C.cmp }, { i }), g(x)], { res }) })
    tr.add(4, `Single number = ${res}`, [arr(a), g(res)]); return tr.frames
  },
} satisfies Algo
