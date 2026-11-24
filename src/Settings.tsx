import { Prefs, DEFAULT_PREFS, COLOR_KEYS, DEFAULT_COLORS, ACCENTS } from './prefs'

type P = { prefs: Prefs; set: (p: Prefs) => void; onClose: () => void }
export default function Settings({ prefs, set, onClose }: P) {
  const up = <K extends keyof Prefs>(k: K, v: Prefs[K]) => set({ ...prefs, [k]: v })
  const tog = (k: 'autoplay' | 'loop' | 'showCode' | 'showVars' | 'showProblems' | 'anim', label: string) => (
    <label className="tog"><input type="checkbox" checked={prefs[k]} onChange={e => up(k, e.target.checked)} />{label}</label>
  )
  return (
    <div className="overlay" onClick={onClose}>
      <div className="dialog" onClick={e => e.stopPropagation()}>
        <div className="head"><h2>Settings</h2><span className="grow" /><button className="icon" onClick={onClose} title="Close (Esc)">✕</button></div>
        <section>
          <h4>Appearance</h4>
          <div className="seg">{(['system', 'light', 'dark'] as const).map(t => <button key={t} className={prefs.theme === t ? 'primary' : ''} onClick={() => up('theme', t)}>{t}</button>)}</div>
          <div className="swatches">Accent {ACCENTS.map(a => <button key={a} className={'sw' + (prefs.accent === a ? ' on' : '')} style={{ background: a }} onClick={() => up('accent', a)} title={a} />)}<input type="color" value={prefs.accent} onChange={e => up('accent', e.target.value)} title="Custom accent" /></div>
          <label className="slider">Text size <input type="range" min={0.8} max={1.4} step={0.05} value={prefs.scale} onChange={e => up('scale', +e.target.value)} /><span>{Math.round(prefs.scale * 100)}%</span></label>
          <label className="slider">Visual zoom <input type="range" min={0.6} max={2} step={0.1} value={prefs.zoom} onChange={e => up('zoom', +e.target.value)} /><span>{Math.round(prefs.zoom * 100)}%</span></label>
          {tog('anim', 'Smooth transitions')}
        </section>
        <section>
          <h4>Highlight colors</h4>
          <div className="colors">
            {(Object.keys(COLOR_KEYS) as (keyof typeof COLOR_KEYS)[]).filter(k => k !== 'dim').map(k => (
              <label key={k}><input type="color" value={prefs.colors[k] ?? DEFAULT_COLORS[k]} onChange={e => up('colors', { ...prefs.colors, [k]: e.target.value })} />{COLOR_KEYS[k]}</label>
            ))}
          </div>
          <button onClick={() => up('colors', {})}>Reset colors</button>
        </section>
        <section>
          <h4>Playback</h4>
          {tog('autoplay', 'Auto-play after Run / Random')}
          {tog('loop', 'Loop when finished')}
        </section>
        <section>
          <h4>Panels</h4>
          {tog('showCode', 'Pseudocode')}
          {tog('showVars', 'Variables')}
          {tog('showProblems', 'Practice problems')}
        </section>
        <button onClick={() => set(DEFAULT_PREFS)}>Reset all settings</button>
      </div>
    </div>
  )
}
