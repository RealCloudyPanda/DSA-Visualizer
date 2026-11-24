export const SHORTCUTS: [string, string][] = [
  ['Space', 'Play / pause'], ['← / →', 'Step back / forward'], ['Shift + ← / →', 'Jump 10 steps'], ['Home / End', 'First / last step'],
  ['R', 'Random input'], ['Enter', 'Run current input (in the input box)'], ['J / K', 'Next / previous visualizer'], ['[ / ]', 'Slower / faster'],
  ['/', 'Search visualizers'], ['M', 'Mark as learned'], ['L', 'Favorite'], ['T', 'Toggle light / dark'], ['S', 'Settings'], ['F', 'Focus mode'], ['?', 'This help'], ['Esc', 'Close dialog / leave input'],
]
export default function Help({ onClose }: { onClose: () => void }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="dialog" onClick={e => e.stopPropagation()}>
        <div className="head"><h2>Keyboard shortcuts</h2><span className="grow" /><button className="icon" onClick={onClose}>✕</button></div>
        <table className="keys"><tbody>{SHORTCUTS.map(([k, d]) => <tr key={k}><td>{k.split(' ').map((p, i) => (p.length <= 5 && p !== '/' && p !== '+' ? <kbd key={i}>{p}</kbd> : <span key={i}> {p} </span>))}</td><td>{d}</td></tr>)}</tbody></table>
      </div>
    </div>
  )
}
