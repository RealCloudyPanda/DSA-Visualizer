import { useEffect, useMemo, useRef, useState } from 'react'
import { Algo, Frame } from './core'
import Sidebar from './Sidebar'
import { COMPLEXITY } from './complexity'
import { ViewBox } from './Views'
import Settings from './Settings'
import Help from './Help'
import Home from './Home'
import { DEFAULT_PREFS, Prefs, applyPrefs, useStored, COLOR_KEYS, beep } from './prefs'

const mods = import.meta.glob<{ default: Algo }>('./algos/*.ts', { eager: true })
const ALGOS = Object.entries(mods).map(([p, m]) => ({ id: p.slice(8, -3), ...m.default }))
type Entry = (typeof ALGOS)[number]
const parseHash = () => { const [id, qs] = location.hash.slice(1).split('?'); const q = new URLSearchParams(qs); return { id, input: q.get('in'), step: Number(q.get('step') ?? 0) } }
const pick = () => ALGOS.find(a => a.id === parseHash().id) ?? ALGOS[0]

export default function App() {
  const [prefs, setPrefs] = useStored<Prefs>('prefs', DEFAULT_PREFS)
  const [saved, setSaved] = useStored<Record<string, string[]>>('inputs', {})
  const [toast, setToast] = useState('')
  const [learned, setLearned] = useStored<string[]>('learned', [])
  const [favs, setFavs] = useStored<string[]>('favs', [])
  const flip = (list: string[], set: (v: string[]) => void, id: string) => set(list.includes(id) ? list.filter(x => x !== id) : [...list, id])
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 1800); return () => clearTimeout(t) }, [toast])
  const [algo, setAlgo] = useState(pick)
  const [home, setHome] = useState(() => !parseHash().id)
  const [input, setInput] = useState(algo.input)
  const history = saved[algo.id] ?? []
  const [frames, setFrames] = useState<Frame[]>([])
  const legend = useMemo(() => { const j = JSON.stringify(frames); return (Object.keys(COLOR_KEYS) as (keyof typeof COLOR_KEYS)[]).filter(k => j.includes(`var(--c-${k})`)) }, [frames])
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [err, setErr] = useState('')
  const [settings, setSettings] = useState(false)
  const [help, setHelp] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [focus, setFocus] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const touch = useRef(0)
  useEffect(() => { if (prefs.sound && frames[i]) beep(220 + frames[i].line * 70 + (i % 3) * 15) }, [i, frames])
  useEffect(() => { const el = logRef.current?.querySelector('.on') as HTMLElement | null; const box = logRef.current; if (el && box) box.scrollTop = el.offsetTop - box.offsetTop - box.clientHeight / 2 }, [i])
  const speed = prefs.speed

  useEffect(() => {
    applyPrefs(prefs)
    const m = matchMedia('(prefers-color-scheme: dark)'); const h = () => applyPrefs(prefs); m.addEventListener('change', h); return () => m.removeEventListener('change', h)
  }, [prefs])

  const run = (a: Entry, s: string, auto = prefs.autoplay, step = 0, remember = true) => {
    try {
      const fr = a.run(s); setFrames(fr); setErr(''); setI(Math.min(step, Math.max(0, fr.length - 1)))
      if (remember) setSaved(o => ({ ...o, [a.id]: [s, ...(o[a.id] ?? []).filter(x => x !== s)].slice(0, 8) }))
    } catch (e) { setFrames([]); setErr(e instanceof Error ? e.message : String(e)); setI(0) }
    setPlaying(auto)
  }
  const load = () => {
    const h = parseHash(); setHome(!h.id); if (!h.id) { document.title = 'DSA Visualizer'; setPlaying(false); return }
    const a = pick(); localStorage.lastId = a.id; const s = h.input ?? JSON.parse(localStorage.inputs ?? '{}')[a.id]?.[0] ?? a.input
    setAlgo(a); setInput(s); run(a, s, false, h.input ? h.step : 0, !!h.input); document.title = `${a.name} · DSA Visualizer`
  }
  useEffect(() => { addEventListener('hashchange', load); load(); return () => removeEventListener('hashchange', load) }, [])
  const share = async () => {
    const url = `${location.origin}${location.pathname}#${algo.id}?in=${encodeURIComponent(input)}&step=${i}`
    try { await navigator.clipboard.writeText(url); setToast('Link copied: opens at this exact step') } catch { setToast('Could not copy the link') }
  }
  const reset = () => { setInput(algo.input); run(algo, algo.input, false) }
  useEffect(() => {
    if (!playing) return
    if (i >= frames.length - 1) { if (prefs.loop && frames.length > 1) { const t = setTimeout(() => setI(0), speed * 2); return () => clearTimeout(t) } setPlaying(false); return }
    const t = setTimeout(() => setI(i + 1), speed); return () => clearTimeout(t)
  }, [playing, i, frames, speed, prefs.loop])

  const f = frames[i]
  const togglePlay = () => { if (i >= frames.length - 1) setI(0); setPlaying(p => !p) }
  const go = (d: number) => { const k = ALGOS.findIndex(a => a.id === algo.id); location.hash = ALGOS[(k + d + ALGOS.length) % ALGOS.length].id }
  const randomize = () => { if (home) return; const s = algo.rand(); setInput(s); run(algo, s) }
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
        t: () => setPrefs({ ...prefs, theme: document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark' }), s: () => setSettings(true), f: () => setFocus(x => !x), m: () => flip(learned, setLearned, algo.id), l: () => flip(favs, setFavs, algo.id), '/': () => { setNavOpen(true); setFocus(false); setTimeout(() => searchRef.current?.focus()) }, '?': () => setHelp(true),
      }
      const fn = map[e.key.length === 1 ? e.key.toLowerCase() : e.key] ?? map[e.key]; if (fn) { e.preventDefault(); fn() }
    }
    addEventListener('keydown', h); return () => removeEventListener('keydown', h)
  })
  return (
    <div className={'app' + (navOpen ? ' nav-open' : '') + (focus ? ' focus' : '')}>
      <nav>
        <a className="brand" href="#" onClick={() => setNavOpen(false)} title="Home"><div className="logo">DS</div><h2>DSA Visualizer</h2></a>
        <div className="progress" title="Visualizers marked as learned">
          <div className="pbar"><div style={{ width: `${(100 * learned.length) / ALGOS.length}%` }} /></div>
          <span>{learned.length} / {ALGOS.length} learned</span>
        </div>
        <Sidebar ref={searchRef} algos={ALGOS} current={algo.id} favs={favs} onPick={() => setNavOpen(false)} extra={a => learned.includes(a.id) && <span className="check">✓</span>} />
      </nav>
      <div className="scrim" onClick={() => setNavOpen(false)} />
      <main>
        {home ? <><button className="icon menu" onClick={() => setNavOpen(true)} title="Menu">☰</button><Home algos={ALGOS} learned={learned} favs={favs} lastId={localStorage.lastId} /></> : <>
        <div className="head">
          <button className="icon menu" onClick={() => setNavOpen(true)} title="Menu">☰</button>
          <h1>{algo.name}</h1><span className="tag">{algo.cat}</span>
          <button className={'icon star' + (favs.includes(algo.id) ? ' on' : '')} title="Favorite (L)" onClick={() => flip(favs, setFavs, algo.id)}>{favs.includes(algo.id) ? '★' : '☆'}</button>
          <span className="grow" />
          <label className={'learn' + (learned.includes(algo.id) ? ' on' : '')} title="Mark as learned (M)"><input type="checkbox" checked={learned.includes(algo.id)} onChange={() => flip(learned, setLearned, algo.id)} />Learned</label>
          <button className="icon" title="Previous visualizer (K)" onClick={() => go(-1)}>‹</button>
          <button className="icon" title="Next visualizer (J)" onClick={() => go(1)}>›</button>
          <button className={'icon' + (focus ? ' primary' : '')} title="Focus mode (F)" onClick={() => setFocus(!focus)}>⛶</button>
          <button className="icon" title="Keyboard shortcuts (?)" onClick={() => setHelp(true)}>⌨</button>
          <button className="icon" title="Settings (S)" onClick={() => setSettings(true)}>⚙</button>
        </div>
        <div className="row">
          <input value={input} list="hist" onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && run(algo, input)} spellCheck={false} aria-label="Input" />
          <datalist id="hist">{history.map(h => <option key={h} value={h} />)}</datalist>
          <button className="primary" onClick={() => run(algo, input)}>Run</button>
          <button onClick={randomize} title="Random input (R)">🎲 Random</button>
          <button className="icon" onClick={reset} title="Reset to the example input">↺</button>
          <button className="icon" onClick={share} title="Copy a link to this input and step">🔗</button>
        </div>
        {algo.hint && <div className="hint">{algo.hint}</div>}
        {COMPLEXITY[algo.id] && <div className="cx"><span title="Time complexity">⏱ {COMPLEXITY[algo.id].time}</span><span title="Extra space">▦ {COMPLEXITY[algo.id].space}</span>{COMPLEXITY[algo.id].note && <span className="note">{COMPLEXITY[algo.id].note}</span>}</div>}
        <div className="row player">
          <button className="icon" title="First step (Home)" onClick={() => setI(0)}>⏮</button>
          <button className="icon" title="Previous step (←)" onClick={() => setI(Math.max(0, i - 1))}>◀</button>
          <button className="primary play" title="Play / pause (Space)" onClick={togglePlay}>{playing ? '❚❚ Pause' : '▶ Play'}</button>
          <button className="icon" title="Next step (→)" onClick={() => setI(Math.min(frames.length - 1, i + 1))}>▶</button>
          <button className="icon" title="Last step (End)" onClick={() => setI(frames.length - 1)}>⏭</button>
          <input className="scrub" type="range" min={0} max={Math.max(0, frames.length - 1)} value={i} onChange={e => setI(+e.target.value)} />
          <span className="count">{frames.length ? i + 1 : 0} / {frames.length}</span>
          <label className="speed" title="[ slower, ] faster">{speed >= 1000 ? (speed / 1000).toFixed(1) + 's' : speed + 'ms'} <input type="range" min={50} max={1500} step={50} value={1550 - speed} onChange={e => setPrefs({ ...prefs, speed: 1550 - +e.target.value })} /></label>
        </div>
        {err && <div className="err">⚠ {err}</div>}
        <div className="msg">{f?.msg}</div>
        {legend.length > 0 && <div className="legend">{legend.map(k => <span key={k}><i style={{ background: `var(--c-${k})` }} />{COLOR_KEYS[k]}</span>)}</div>}
        <div className={'body ' + prefs.layout}>
          <div className="views" style={{ zoom: prefs.zoom }} onTouchStart={e => { touch.current = e.touches[0].clientX }} onTouchEnd={e => { const d = e.changedTouches[0].clientX - touch.current; if (Math.abs(d) > 50) { setPlaying(false); setI(x => Math.max(0, Math.min(last, x + (d < 0 ? 1 : -1)))) } }}>{f?.views.map((v, k) => <ViewBox key={k} v={v} />)}</div>
          <div className="side">
            {prefs.showCode && <div className="codewrap"><button className="icon copy" title="Copy pseudocode" onClick={() => navigator.clipboard.writeText(algo.code.join('\n')).then(() => setToast('Pseudocode copied'))}>⧉</button><pre className="code card">{algo.code.map((l, k) => <div key={k} className={f?.line === k + 1 ? 'hl' : ''}><span className="ln">{k + 1}</span>{l || ' '}</div>)}</pre></div>}
            {prefs.showVars && f?.vars && <div className="card"><h4>Variables</h4><table className="vars"><tbody>{Object.entries(f.vars).map(([k, v]) => <tr key={k}><td>{k}</td><td>{JSON.stringify(v)}</td></tr>)}</tbody></table></div>}
            {prefs.showLog && frames.length > 0 && <div className="card"><h4>Steps</h4><div className="log" ref={logRef}>{frames.map((fr, k) => <div key={k} className={k === i ? 'on' : k < i ? 'past' : ''} onClick={() => { setPlaying(false); setI(k) }}><span>{k + 1}</span>{fr.msg}</div>)}</div></div>}
            {prefs.showProblems && <div className="card"><h4>Practice problems</h4><ul>{algo.problems.map(p => <li key={p}>{p}</li>)}</ul></div>}
          </div>
        </div>
        </>}
      </main>
      {toast && <div className="toast">{toast}</div>}
      {help && <Help onClose={() => setHelp(false)} />}
      {settings && <Settings prefs={prefs} set={setPrefs} onClose={() => setSettings(false)} />}
    </div>
  )
}
