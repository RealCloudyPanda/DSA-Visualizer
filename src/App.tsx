import { useEffect, useRef, useState } from 'react'
import { Algo, Frame } from './core'
import Sidebar from './Sidebar'
import { ViewBox } from './Views'
import Settings from './Settings'
import Help from './Help'
import { DEFAULT_PREFS, Prefs, applyPrefs, useStored } from './prefs'

const mods = import.meta.glob<{ default: Algo }>('./algos/*.ts', { eager: true })
const ALGOS = Object.entries(mods).map(([p, m]) => ({ id: p.slice(8, -3), ...m.default }))
const pick = () => ALGOS.find(a => a.id === location.hash.slice(1)) ?? ALGOS[0]

export default function App() {
  const [prefs, setPrefs] = useStored<Prefs>('prefs', DEFAULT_PREFS)
  const [algo, setAlgo] = useState(pick)
  const [input, setInput] = useState(algo.input)
  const [frames, setFrames] = useState<Frame[]>([])
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [err, setErr] = useState('')
  const [settings, setSettings] = useState(false)
  const [help, setHelp] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [focus, setFocus] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const speed = prefs.speed

  useEffect(() => {
    applyPrefs(prefs)
    const m = matchMedia('(prefers-color-scheme: dark)'); const h = () => applyPrefs(prefs); m.addEventListener('change', h); return () => m.removeEventListener('change', h)
  }, [prefs])

  const run = (a: Algo, s: string, auto = prefs.autoplay) => {
    try { setFrames(a.run(s)); setErr('') } catch (e) { setFrames([]); setErr(e instanceof Error ? e.message : String(e)) }
    setI(0); setPlaying(auto)
  }
  useEffect(() => {
    const h = () => { const a = pick(); setAlgo(a); setInput(a.input); run(a, a.input, false) }
    addEventListener('hashchange', h); run(algo, algo.input, false); return () => removeEventListener('hashchange', h)
  }, [])
  useEffect(() => {
    if (!playing) return
    if (i >= frames.length - 1) { if (prefs.loop && frames.length > 1) { const t = setTimeout(() => setI(0), speed * 2); return () => clearTimeout(t) } setPlaying(false); return }
    const t = setTimeout(() => setI(i + 1), speed); return () => clearTimeout(t)
  }, [playing, i, frames, speed, prefs.loop])

  const f = frames[i]
  const togglePlay = () => { if (i >= frames.length - 1) setI(0); setPlaying(p => !p) }
  const go = (d: number) => { const k = ALGOS.findIndex(a => a.id === algo.id); location.hash = ALGOS[(k + d + ALGOS.length) % ALGOS.length].id }
  const randomize = () => { const s = algo.rand(); setInput(s); run(algo, s) }
  const last = Math.max(0, frames.length - 1)
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (e.key === 'Escape') { setSettings(false); setHelp(false); t.blur?.(); return }
      if (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA' || e.metaKey || e.ctrlKey || e.altKey) return
      const n = e.shiftKey ? 10 : 1
      const map: Record<string, () => void> = {
        ' ': togglePlay, ArrowRight: () => { setPlaying(false); setI(x => Math.min(last, x + n)) }, ArrowLeft: () => { setPlaying(false); setI(x => Math.max(0, x - n)) },
        Home: () => setI(0), End: () => setI(last), r: randomize, j: () => go(1), k: () => go(-1),
        '[': () => setPrefs({ ...prefs, speed: Math.min(1500, speed + 100) }), ']': () => setPrefs({ ...prefs, speed: Math.max(50, speed - 100) }),
        t: () => setPrefs({ ...prefs, theme: document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark' }), s: () => setSettings(true), f: () => setFocus(x => !x), '/': () => { setNavOpen(true); setFocus(false); setTimeout(() => searchRef.current?.focus()) }, '?': () => setHelp(true),
      }
      const fn = map[e.key.length === 1 ? e.key.toLowerCase() : e.key] ?? map[e.key]; if (fn) { e.preventDefault(); fn() }
    }
    addEventListener('keydown', h); return () => removeEventListener('keydown', h)
  })
  return (
    <div className={'app' + (navOpen ? ' nav-open' : '') + (focus ? ' focus' : '')}>
      <nav>
        <div className="brand"><div className="logo">DS</div><h2>DSA Visualizer</h2></div>
        <Sidebar ref={searchRef} algos={ALGOS} current={algo.id} onPick={() => setNavOpen(false)} />
      </nav>
      <div className="scrim" onClick={() => setNavOpen(false)} />
      <main>
        <div className="head">
          <button className="icon menu" onClick={() => setNavOpen(true)} title="Menu">☰</button>
          <h1>{algo.name}</h1><span className="tag">{algo.cat}</span><span className="grow" />
          <button className="icon" title="Previous visualizer (K)" onClick={() => go(-1)}>‹</button>
          <button className="icon" title="Next visualizer (J)" onClick={() => go(1)}>›</button>
          <button className={'icon' + (focus ? ' primary' : '')} title="Focus mode (F)" onClick={() => setFocus(!focus)}>⛶</button>
          <button className="icon" title="Keyboard shortcuts (?)" onClick={() => setHelp(true)}>⌨</button>
          <button className="icon" title="Settings (S)" onClick={() => setSettings(true)}>⚙</button>
        </div>
        <div className="row">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && run(algo, input)} spellCheck={false} />
          <button className="primary" onClick={() => run(algo, input)}>Run</button>
          <button onClick={randomize} title="Random input (R)">Random</button>
        </div>
        {algo.hint && <div className="hint">{algo.hint}</div>}
        <div className="row player">
          <button className="icon" title="First step (Home)" onClick={() => setI(0)}>⏮</button>
          <button className="icon" title="Previous step (←)" onClick={() => setI(Math.max(0, i - 1))}>◀</button>
          <button className="primary play" title="Play / pause (Space)" onClick={togglePlay}>{playing ? '❚❚ Pause' : '▶ Play'}</button>
          <button className="icon" title="Next step (→)" onClick={() => setI(Math.min(frames.length - 1, i + 1))}>▶</button>
          <button className="icon" title="Last step (End)" onClick={() => setI(frames.length - 1)}>⏭</button>
          <input className="scrub" type="range" min={0} max={Math.max(0, frames.length - 1)} value={i} onChange={e => setI(+e.target.value)} />
          <span className="count">{frames.length ? i + 1 : 0} / {frames.length}</span>
          <label className="speed">Speed <input type="range" min={50} max={1500} step={50} value={1550 - speed} onChange={e => setPrefs({ ...prefs, speed: 1550 - +e.target.value })} /></label>
        </div>
        {err && <div className="err">⚠ {err}</div>}
        <div className="msg">{f?.msg}</div>
        <div className="body">
          <div className="views" style={{ zoom: prefs.zoom }}>{f?.views.map((v, k) => <ViewBox key={k} v={v} />)}</div>
          <div className="side">
            {prefs.showCode && <pre className="code card">{algo.code.map((l, k) => <div key={k} className={f?.line === k + 1 ? 'hl' : ''}>{l || ' '}</div>)}</pre>}
            {prefs.showVars && f?.vars && <div className="card"><h4>Variables</h4><table className="vars"><tbody>{Object.entries(f.vars).map(([k, v]) => <tr key={k}><td>{k}</td><td>{JSON.stringify(v)}</td></tr>)}</tbody></table></div>}
            {prefs.showProblems && <div className="card"><h4>Practice problems</h4><ul>{algo.problems.map(p => <li key={p}>{p}</li>)}</ul></div>}
          </div>
        </div>
      </main>
      {help && <Help onClose={() => setHelp(false)} />}
      {settings && <Settings prefs={prefs} set={setPrefs} onClose={() => setSettings(false)} />}
    </div>
  )
}
