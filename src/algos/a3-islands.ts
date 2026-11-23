import { Algo, Tracer, C, GridView, ri } from '../core'
const PAL = ['#aed6f1', '#f9e79f', '#d2b4de', '#f5b7b1', '#a9dfbf', '#fad7a0']
export default {
  name: 'Number of Islands (Grid DFS)', cat: 'Graphs', input: '11000 11000 00100 00011', hint: 'rows of 0/1 separated by spaces',
  problems: ['Number of Islands (200)', 'Max Area of Island (695)', 'Rotting Oranges (994)', 'Surrounded Regions (130)', 'Word Search (79)', 'Flood Fill (733)'],
  code: ['for each cell (r, c):', '  if grid[r][c] == 1:', '    count += 1; sink(r, c)', 'sink(r, c):', '  if out of bounds or water: return', '  grid[r][c] = 0', '  sink 4 neighbours'],
  rand: () => Array.from({ length: 5 }, () => Array.from({ length: 6 }, () => (Math.random() < 0.45 ? 1 : 0)).join('')).join(' '),
  run(s) {
    const g = s.trim().split(/\s+/).map(r => r.split('').map(Number)); const R = g.length, Cn = g[0]?.length ?? 0; const col: Record<string, string> = {}; const tr = new Tracer(); let cnt = 0
    const v = (r: number, c: number, cc = C.cmp): GridView => ({ kind: 'grid', cells: g.map(row => row.map(x => x)), colors: { ...col, [`${r},${c}`]: cc } })
    const sink = (r: number, c: number) => {
      if (r < 0 || c < 0 || r >= R || c >= Cn || g[r][c] !== 1) return
      g[r][c] = 0; col[`${r},${c}`] = PAL[(cnt - 1) % PAL.length]; tr.add(6, `Mark (${r},${c}) as island ${cnt}`, v(r, c, C.act), { islands: cnt })
      sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1)
    }
    for (let r = 0; r < R; r++) for (let c = 0; c < Cn; c++) {
      if (g[r][c] === 1) { cnt++; tr.add(3, `New island at (${r},${c})`, v(r, c), { islands: cnt }); sink(r, c) }
      else if (!col[`${r},${c}`]) tr.add(1, `(${r},${c}) is water`, v(r, c, C.dim), { islands: cnt })
    }
    tr.add(3, `${cnt} islands`, v(-1, -1), { islands: cnt }); return tr.frames
  },
} satisfies Algo
