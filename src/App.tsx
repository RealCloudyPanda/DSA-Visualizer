import { useEffect, useMemo, useState } from 'react'
import { Algo, CATS, Frame } from './core'
import { ViewBox } from './Views'

const mods = import.meta.glob<{ default: Algo }>('./algos/*.ts', { eager: true })
const ALGOS = Object.entries(mods).map(([p, m]) => ({ id: p.slice(8, -3), ...m.default }))
const pick = () => ALGOS.find(a => a.id === location.hash.slice(1)) ?? ALGOS[0]

export default function App() {
  const [algo, setAlgo] = useState(pick)
  const [input, setInput] = useState(algo?.input ?? '')
  const [frames, setFrames] = useState<Frame[]>([])
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(500)
  const [err, setErr] = useState('')

  const run = (a: Algo, s: string) => {
    try { setFrames(a.run(s)); setErr('') } catch (e) { setFrames([]); setErr(String(e)) }
    setI(0); setPlaying(false)
  }
  useEffect(() => { const h = () => { const a = pick(); setAlgo(a); setInput(a.input); run(a, a.input) }; addEventListener('hashchange', h); if (algo) run(algo, algo.input); return () => removeEventListener('hashchange', h) }, [])
  useEffect(() => {
    if (!playing) return
    if (i >= frames.length - 1) { setPlaying(false); return }
    const t = setTimeout(() => setI(i + 1), speed); return () => clearTimeout(t)
  }, [playing, i, frames, speed])

  const groups = useMemo(() => CATS.map(c => [c, ALGOS.filter(a => a.cat === c)] as const).filter(g => g[1].length), [])
  if (!algo) return <p>No visualizers yet.</p>
  const f = frames[i]
  return (
    <div className="app">
      <nav>
        <h2>DSA Visualizer</h2>
        {groups.map(([c, list]) => (
          <div key={c}><h4>{c}</h4>{list.map(a => <a key={a.id} href={'#' + a.id} className={a.id === algo.id ? 'on' : ''}>{a.name}</a>)}</div>
        ))}
      </nav>
      <main>
        <h1>{algo.name}</h1>
        <div className="row">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && run(algo, input)} />
          <button onClick={() => run(algo, input)}>Run</button>
          <button onClick={() => { const s = algo.rand(); setInput(s); run(algo, s) }}>Random</button>
        </div>
        {algo.hint && <div className="hint">{algo.hint}</div>}
        <div className="row">
          <button onClick={() => setI(0)}>⏮</button>
          <button onClick={() => setI(Math.max(0, i - 1))}>◀</button>
          <button onClick={() => { if (i >= frames.length - 1) setI(0); setPlaying(!playing) }}>{playing ? 'Pause' : 'Play'}</button>
          <button onClick={() => setI(Math.min(frames.length - 1, i + 1))}>▶</button>
          <button onClick={() => setI(frames.length - 1)}>⏭</button>
          <input type="range" min={0} max={Math.max(0, frames.length - 1)} value={i} onChange={e => setI(+e.target.value)} />
          <span>{frames.length ? i + 1 : 0}/{frames.length}</span>
          <label>Speed <input type="range" min={50} max={1500} step={50} value={1550 - speed} onChange={e => setSpeed(1550 - +e.target.value)} /></label>
        </div>
        {err && <div className="err">{err}</div>}
        <div className="msg">{f?.msg}</div>
        <div className="body">
          <div className="views">{f?.views.map((v, k) => <ViewBox key={k} v={v} />)}</div>
          <div className="side">
            <pre className="code">{algo.code.map((l, k) => <div key={k} className={f?.line === k + 1 ? 'hl' : ''}>{l || ' '}</div>)}</pre>
            {f?.vars && <table className="vars"><tbody>{Object.entries(f.vars).map(([k, v]) => <tr key={k}><td>{k}</td><td>{JSON.stringify(v)}</td></tr>)}</tbody></table>}
            <h4>Practice problems</h4>
            <ul>{algo.problems.map(p => <li key={p}>{p}</li>)}</ul>
          </div>
        </div>
      </main>
    </div>
  )
}
