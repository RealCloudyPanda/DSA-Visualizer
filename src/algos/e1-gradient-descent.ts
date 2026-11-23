import { Algo, Tracer, C, PlotView } from '../core'
export default {
  name: 'Gradient Descent', cat: 'ML Extras', input: '-4 | 0.1 | 25', hint: 'start x | learning rate | steps, on f(x) = x² + 2 sin(2x)',
  problems: ['Training any model (minimize loss)', 'Learning rate too big: divergence', 'Local vs global minima'],
  code: ['x = start', 'repeat steps times:', '  g = f\'(x) = 2x + 4 cos(2x)', '  x = x - lr * g'],
  rand: () => `${(Math.random() * 10 - 5).toFixed(1)} | ${[0.05, 0.1, 0.3, 0.45][Math.floor(Math.random() * 4)]} | 25`,
  run(s) {
    const [x0, lr, st] = s.split('|').map(Number); const f = (x: number) => x * x + 2 * Math.sin(2 * x); const df = (x: number) => 2 * x + 4 * Math.cos(2 * x)
    const curve = Array.from({ length: 81 }, (_, i) => -6 + (12 * i) / 80); const tr = new Tracer(); let x = x0 || 0; const trail: number[] = []
    const view = (): PlotView => ({ kind: 'plot', title: 'f(x) = x² + 2 sin(2x)', points: [...trail.map(t => ({ x: t, y: f(t), color: C.cmp, r: 3 })), { x, y: Math.min(40, f(x)), color: C.swap, r: 7 }], lines: curve.slice(1).map((c, i) => ({ x1: curve[i], y1: f(curve[i]), x2: c, y2: f(c) })) })
    tr.add(1, `Start at x = ${x.toFixed(3)}`, view(), { x, f: f(x) })
    for (let i = 0; i < Math.min(100, st || 20); i++) {
      const g = df(x); trail.push(x); x -= (lr || 0.1) * g; x = Math.max(-6, Math.min(6, x))
      tr.add(4, `Step ${i + 1}: gradient ${g.toFixed(3)}, x → ${x.toFixed(3)}`, view(), { x: +x.toFixed(4), loss: +f(x).toFixed(4), grad: +g.toFixed(4) })
    }
    return tr.frames
  },
} satisfies Algo
