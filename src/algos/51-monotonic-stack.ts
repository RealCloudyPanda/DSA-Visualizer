import { Algo, Tracer, C, nums, arr, bars, randNums } from '../core'
export default {
  name: 'Monotonic Stack', cat: 'Stack', input: '73, 74, 75, 71, 69, 72, 76, 73', hint: 'Daily Temperatures: days until a warmer one',
  problems: ['Daily Temperatures (739)', 'Largest Rectangle in Histogram (84)', 'Next Greater Element (496)', 'Car Fleet (853)'],
  code: ['ans = [0]*n; stack = []  # indices, temps decreasing', 'for i in 0..n-1:', '  while stack and t[i] > t[stack.top]:', '    j = stack.pop(); ans[j] = i - j', '  stack.push(i)'],
  rand: () => randNums(9, 60, 80),
  run(s) {
    const t = nums(s); const ans = Array(t.length).fill(0); const st: number[] = []; const tr = new Tracer()
    const v = (col: Record<number, string>) => [bars(t, { ...Object.fromEntries(st.map(j => [j, C.vis])), ...col }), arr(st.map(j => `${j}:${t[j]}`), {}, {}, 'stack (index:temp)'), arr(ans, {}, {}, 'answer')]
    for (let i = 0; i < t.length; i++) {
      tr.add(2, `Day ${i}: ${t[i]}`, v({ [i]: C.cmp }), { i })
      while (st.length && t[i] > t[st[st.length - 1]]) { const j = st.pop()!; ans[j] = i - j; tr.add(4, `${t[i]} > ${t[j]}: day ${j} waits ${i - j}`, v({ [i]: C.cmp, [j]: C.done }), { i, j }) }
      st.push(i); tr.add(5, `Push day ${i}`, v({ [i]: C.act }), { i })
    }
    return tr.frames
  },
} satisfies Algo
