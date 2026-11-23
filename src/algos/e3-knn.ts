import { Algo, Tracer, C, PlotView, ri } from '../core'
export default {
  name: 'K-Nearest Neighbors', cat: 'ML Extras', input: '', hint: 'random labelled points; classify the query (black) with k = 5',
  problems: ['K Closest Points to Origin (973)', 'Classification baseline', 'Recommendation by similarity'],
  code: ['for each training point: d = distance(query, p)', 'sort by d, keep the k closest', 'predict the majority label among them'],
  rand: () => String(Math.random()),
  run() {
    const pts = Array.from({ length: 30 }, () => { const l = ri(0, 1); return { x: ri(0, 50) + l * 40, y: ri(0, 60) + l * 30, l } }); const qp = { x: ri(30, 60), y: ri(30, 60) }; const k = 5; const tr = new Tracer()
    const col = ['#e74c3c', '#3498db']
    const view = (near: Set<number>): PlotView => ({ kind: 'plot', points: [...pts.map((p, i) => ({ x: p.x, y: p.y, color: col[p.l], r: near.has(i) ? 8 : 4 })), { x: qp.x, y: qp.y, color: '#000', r: 7 }], lines: [...near].map(i => ({ x1: qp.x, y1: qp.y, x2: pts[i].x, y2: pts[i].y, color: C.cmp })) })
    tr.add(1, 'Query point in black', view(new Set()))
    const order = pts.map((p, i) => [Math.hypot(p.x - qp.x, p.y - qp.y), i]).sort((a, b) => a[0] - b[0])
    const near = new Set<number>(); for (let j = 0; j < k; j++) { near.add(order[j][1]); tr.add(2, `Neighbour ${j + 1}: distance ${order[j][0].toFixed(1)}`, view(near)) }
    const votes = [0, 0]; near.forEach(i => votes[pts[i].l]++)
    tr.add(3, `Votes red ${votes[0]} vs blue ${votes[1]}: predict ${votes[0] > votes[1] ? 'red' : 'blue'}`, view(near), { votes }); return tr.frames
  },
} satisfies Algo
