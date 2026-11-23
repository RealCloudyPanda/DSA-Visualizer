import { Algo, Tracer, C, PlotView, ri } from '../core'
const parse = (s: string) => s.split(/\s+/).filter(Boolean).map(t => t.split('-').map(Number) as [number, number]).filter(p => p.length === 2 && !p.some(isNaN))
const plot = (iv: [number, number][], out: [number, number][], hi: number): PlotView => ({
  kind: 'plot', title: 'top: input (sorted), bottom: merged',
  points: [{ x: 0, y: 0, r: 0 }, { x: Math.max(1, ...iv.map(i => i[1])), y: iv.length + 2, r: 0 }],
  lines: [...iv.map(([a, b], k) => ({ x1: a, y1: iv.length + 1 - k, x2: b, y2: iv.length + 1 - k, color: k === hi ? C.cmp : '#888' })), ...out.map(([a, b]) => ({ x1: a, y1: 0.4, x2: b, y2: 0.4, color: C.done }))],
})
export default {
  name: 'Merge Intervals', cat: 'Intervals', input: '1-3 2-6 8-10 15-18 9-12', hint: 'intervals as start-end',
  problems: ['Merge Intervals (56)', 'Insert Interval (57)', 'Non-overlapping Intervals (435)', 'Meeting Rooms (252)', 'Meeting Rooms II (253)', 'Minimum Interval to Include Each Query (1851)'],
  code: ['sort intervals by start', 'out = [first]', 'for [s, e] in rest:', '  if s <= out[-1].end: out[-1].end = max(out[-1].end, e)', '  else: out.append([s, e])'],
  rand: () => Array.from({ length: 6 }, () => { const a = ri(0, 20); return `${a}-${a + ri(1, 5)}` }).join(' '),
  run(s) {
    const iv = parse(s).sort((a, b) => a[0] - b[0]); const out: [number, number][] = []; const tr = new Tracer(); if (!iv.length) return tr.frames
    tr.add(1, 'Sorted by start', plot(iv, out, -1)); out.push([...iv[0]]); tr.add(2, 'Start with the first', plot(iv, out, 0))
    for (let k = 1; k < iv.length; k++) {
      const last = out[out.length - 1]
      if (iv[k][0] <= last[1]) { last[1] = Math.max(last[1], iv[k][1]); tr.add(4, `[${iv[k]}] overlaps: extend to [${last}]`, plot(iv, out, k), { out }) }
      else { out.push([...iv[k]]); tr.add(5, `[${iv[k]}] is separate: add it`, plot(iv, out, k), { out }) }
    }
    return tr.frames
  },
} satisfies Algo
