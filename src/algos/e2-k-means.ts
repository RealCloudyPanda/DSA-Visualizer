import { Algo, Tracer, C, PlotView, ri } from '../core'
const COL = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6']
const blobs = () => Array.from({ length: 3 }, () => [ri(10, 90), ri(10, 90)]).flatMap(([cx, cy]) => Array.from({ length: 8 }, () => `${cx + ri(-12, 12)},${cy + ri(-12, 12)}`)).join(' ')
export default {
  name: 'K-Means Clustering', cat: 'ML Extras', input: '', hint: 'points as x,y | k. Leave empty for random blobs',
  problems: ['Unsupervised clustering', 'Customer segmentation', 'Vector quantization'],
  code: ['pick k random points as centroids', 'repeat until stable:', '  assign each point to its nearest centroid', '  move each centroid to the mean of its points'],
  rand: () => `${blobs()} | 3`,
  run(s) {
    const [p, q] = s.split('|'); const pts = ((p ?? '').trim() ? p.trim() : blobs()).split(/\s+/).map(t => t.split(',').map(Number)); const k = Math.min(5, Number(q) || 3)
    let cen = pts.slice().sort(() => Math.random() - 0.5).slice(0, k).map(c => [...c]); let asg = pts.map(() => -1); const tr = new Tracer()
    const view = (): PlotView => ({ kind: 'plot', points: [...pts.map(([x, y], i) => ({ x, y, r: 4, color: asg[i] < 0 ? '#999' : COL[asg[i]] })), ...cen.map(([x, y], j) => ({ x, y, r: 10, color: COL[j] }))] })
    tr.add(1, `Pick ${k} random centroids (big dots)`, view())
    for (let it = 1; it <= 15; it++) {
      const na = pts.map(([x, y]) => cen.reduce((b, c, j) => (Math.hypot(x - c[0], y - c[1]) < Math.hypot(x - cen[b][0], y - cen[b][1]) ? j : b), 0))
      const same = na.every((a, i) => a === asg[i]); asg = na; tr.add(3, `Iteration ${it}: assign points to nearest centroid`, view())
      if (same) { tr.add(2, 'Assignments stopped changing: converged', view()); break }
      cen = cen.map((c, j) => { const m = pts.filter((_, i) => asg[i] === j); return m.length ? [m.reduce((a, b) => a + b[0], 0) / m.length, m.reduce((a, b) => a + b[1], 0) / m.length] : c })
      tr.add(4, `Iteration ${it}: move centroids to cluster means`, view())
    }
    return tr.frames
  },
} satisfies Algo
