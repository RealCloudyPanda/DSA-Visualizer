import { forwardRef, useMemo, useState } from 'react'
import { CATS } from './core'
import { useStored } from './prefs'

export type Item = { id: string; name: string; cat: string; problems: string[] }
type P = { algos: Item[]; current: string; onPick: () => void; extra?: (a: Item) => React.ReactNode }

const Sidebar = forwardRef<HTMLInputElement, P>(function Sidebar({ algos, current, onPick, extra }, ref) {
  const [q, setQ] = useState('')
  const [closed, setClosed] = useStored<string[]>('closedCats', [])
  const ql = q.trim().toLowerCase()
  const groups = useMemo(() => CATS.map(c => [c, algos.filter(a => a.cat === c && (!ql || (a.name + ' ' + a.cat + ' ' + a.problems.join(' ')).toLowerCase().includes(ql)))] as const).filter(g => g[1].length), [algos, ql])
  const toggle = (c: string) => setClosed(closed.includes(c) ? closed.filter(x => x !== c) : [...closed, c])
  return (
    <>
      <div className="search">
        <input ref={ref} type="text" placeholder="Search algorithms or problems  /" value={q} onChange={e => setQ(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && groups[0]) { location.hash = groups[0][1][0].id; onPick() } if (e.key === 'Escape') setQ('') }} />
        {q && <button className="clear" onClick={() => setQ('')} title="Clear">✕</button>}
      </div>
      {!groups.length && <div className="hint" style={{ margin: 8 }}>No matches for “{q}”</div>}
      {groups.map(([c, list]) => {
        const open = ql || !closed.includes(c)
        return (
          <div key={c} className="cat">
            <h4 onClick={() => toggle(c)}><span className={'chev' + (open ? ' open' : '')}>›</span>{c}<span className="n">{list.length}</span></h4>
            {open && list.map(a => <a key={a.id} href={'#' + a.id} onClick={onPick} className={a.id === current ? 'on' : ''}><span className="grow">{a.name}</span>{extra?.(a)}</a>)}
          </div>
        )
      })}
    </>
  )
})
export default Sidebar
