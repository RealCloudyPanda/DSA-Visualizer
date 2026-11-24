import { useState } from 'react'
import { CATS } from './core'
import { COMPLEXITY } from './complexity'

type Item = { id: string; name: string; cat: string; problems: string[] }
type P = { algos: Item[]; learned: string[]; favs: string[]; lastId?: string }
export default function Home({ algos, learned, favs, lastId }: P) {
  const [q, setQ] = useState('')
  const ql = q.trim().toLowerCase()
  const last = algos.find(a => a.id === lastId)
  const next = algos.find(a => !learned.includes(a.id))
  const rand = () => { location.hash = algos[Math.floor(Math.random() * algos.length)].id }
  return (
    <div className="home">
      <div className="hero">
        <h1>Learn data structures and algorithms by watching them run</h1>
        <p>{algos.length} step-by-step visualizers covering the NeetCode 150 patterns, classic sorts and searches, graphs, DP and a few ML extras. Type your own input, scrub through every step and follow the highlighted pseudocode.</p>
        <div className="row">
          {last && <a className="btn primary" href={'#' + last.id}>↩ Continue: {last.name}</a>}
          {next && <a className="btn" href={'#' + next.id}>Next unlearned: {next.name}</a>}
          <button onClick={rand}>🎲 Surprise me</button>
        </div>
        <div className="stats"><b>{learned.length}</b> learned · <b>{favs.length}</b> favorites · <b>{CATS.length}</b> topics</div>
      </div>
      <input type="text" className="homesearch" placeholder="Filter by name, topic or LeetCode problem…" value={q} onChange={e => setQ(e.target.value)} />
      {CATS.map(c => {
        const list = algos.filter(a => a.cat === c && (!ql || (a.name + ' ' + c + ' ' + a.problems.join(' ')).toLowerCase().includes(ql)))
        if (!list.length) return null
        const done = list.filter(a => learned.includes(a.id)).length
        return (
          <section key={c}>
            <h3>{c} <span>{done}/{list.length}</span></h3>
            <div className="cards">
              {list.map(a => (
                <a key={a.id} href={'#' + a.id} className={'tile' + (learned.includes(a.id) ? ' done' : '')}>
                  <b>{a.name}{favs.includes(a.id) && ' ★'}</b>
                  {COMPLEXITY[a.id] && <code>{COMPLEXITY[a.id].time}</code>}
                  <small>{a.problems.slice(0, 2).join(' · ')}</small>
                </a>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
