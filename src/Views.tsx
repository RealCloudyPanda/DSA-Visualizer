import { View, ArrayView, GraphView, GridView, PlotView } from './core'

function Arr({ v }: { v: ArrayView }) {
  const ptrAt: Record<number, string[]> = {}
  for (const [k, i] of Object.entries(v.ptrs ?? {})) (ptrAt[i] ??= []).push(k)
  const max = Math.max(1, ...v.values.map(x => (typeof x === 'number' ? Math.abs(x) : 0)))
  return (
    <div className="arr">
      {v.values.map((x, i) => (
        <div key={i} className="cell">
          {v.bars && <div className="bar" style={{ height: 8 + (140 * Math.abs(Number(x) || 0)) / max, background: v.colors?.[i] ?? 'var(--bar)' }} />}
          <div className="box" style={{ background: v.bars ? undefined : v.colors?.[i] }}>{String(x)}</div>
          <div className="idx">{i}</div>
          <div className="ptr">{ptrAt[i]?.join(',')}</div>
        </div>
      ))}
      {!v.values.length && <div className="idx">(empty)</div>}
    </div>
  )
}

function Graph({ v }: { v: GraphView }) {
  if (!v.nodes.length) return <div className="idx">(empty)</div>
  const pos = new Map(v.nodes.map(n => [n.id, n]))
  const xs = v.nodes.map(n => n.x), ys = v.nodes.map(n => n.y)
  const x0 = Math.min(...xs) - 30, y0 = Math.min(...ys) - 30, w = Math.max(...xs) - x0 + 30, h = Math.max(...ys) - y0 + 45
  return (
    <svg viewBox={`${x0} ${y0} ${w} ${h}`} style={{ width: '100%', maxWidth: Math.max(w, 120), maxHeight: 420 }}>
      <defs><marker id="ah" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0L10,5L0,10z" style={{ fill: 'var(--edge)' }} /></marker></defs>
      {v.edges.map((e, i) => {
        const a = pos.get(e.a), b = pos.get(e.b); if (!a || !b) return null
        const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1
        const sx = a.x + (dx / d) * 18, sy = a.y + (dy / d) * 18, tx = b.x - (dx / d) * 18, ty = b.y - (dy / d) * 18
        const back = e.directed && a.y === b.y && b.x < a.x
        const path = back ? `M${a.x},${a.y + 18} Q${(a.x + b.x) / 2},${a.y + 60} ${b.x},${b.y + 18}` : `M${sx},${sy} L${tx},${ty}`
        return (
          <g key={i}>
            <path d={path} fill="none" style={{ stroke: e.color ?? 'var(--edge)' }} strokeWidth={e.color ? 3 : 1.5} markerEnd={e.directed ? 'url(#ah)' : undefined} />
            {e.label !== undefined && <text x={(a.x + b.x) / 2 + 4} y={(a.y + b.y) / 2 - 4} className="elabel">{e.label}</text>}
          </g>
        )
      })}
      {v.nodes.map(n => (
        <g key={String(n.id)}>
          <circle cx={n.x} cy={n.y} r={18} style={{ fill: n.color ?? 'var(--node)', stroke: 'var(--fg)', transition: 'fill .2s' }} />
          <text x={n.x} y={n.y + 5} textAnchor="middle" className="nlabel">{n.label}</text>
          {n.sub !== undefined && <text x={n.x} y={n.y + 34} textAnchor="middle" className="nsub">{n.sub}</text>}
        </g>
      ))}
    </svg>
  )
}

function Grid({ v }: { v: GridView }) {
  return (
    <table className="grid"><tbody>
      {v.cols && <tr>{v.rows && <th />}{v.cols.map((c, j) => <th key={j}>{c}</th>)}</tr>}
      {v.cells.map((row, i) => (
        <tr key={i}>{v.rows && <th>{v.rows[i]}</th>}{row.map((c, j) => <td key={j} style={{ background: v.colors?.[`${i},${j}`] }}>{c}</td>)}</tr>
      ))}
    </tbody></table>
  )
}

function Plot({ v }: { v: PlotView }) {
  const all = [...v.points, ...(v.lines ?? []).flatMap(l => [{ x: l.x1, y: l.y1 }, { x: l.x2, y: l.y2 }])]
  const xs = all.map(p => p.x), ys = all.map(p => p.y)
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys)
  const sx = (x: number) => 20 + (360 * (x - x0)) / (x1 - x0 || 1), sy = (y: number) => 280 - (260 * (y - y0)) / (y1 - y0 || 1)
  return (
    <svg viewBox="0 0 400 300" style={{ width: '100%', maxWidth: 500, border: '1px solid var(--line)' }}>
      {(v.lines ?? []).map((l, i) => <line key={i} x1={sx(l.x1)} y1={sy(l.y1)} x2={sx(l.x2)} y2={sy(l.y2)} style={{ stroke: l.color ?? 'var(--edge)' }} strokeWidth={2} />)}
      {v.points.map((p, i) => <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={p.r ?? 5} style={{ fill: p.color ?? 'var(--fg)', stroke: 'var(--fg)' }} />)}
    </svg>
  )
}

export function ViewBox({ v }: { v: View }) {
  return (
    <div className="view">
      {v.title && <div className="vtitle">{v.title}</div>}
      {v.kind === 'array' ? <Arr v={v} /> : v.kind === 'graph' ? <Graph v={v} /> : v.kind === 'grid' ? <Grid v={v} /> : <Plot v={v} />}
    </div>
  )
}
