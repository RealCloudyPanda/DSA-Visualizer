import { useEffect, useState } from 'react'

export const COLOR_KEYS = { cmp: 'Comparing', swap: 'Swap / conflict', done: 'Done / found', act: 'Active', vis: 'Queued / visited', dim: 'Discarded' } as const
export const DEFAULT_COLORS: Record<keyof typeof COLOR_KEYS, string> = { cmp: '#f5a623', swap: '#e74c3c', done: '#2ecc71', act: '#3498db', vis: '#9b59b6', dim: '' }
export const ACCENTS = ['#4f6bed', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6']

export type Prefs = {
  theme: 'system' | 'light' | 'dark'; accent: string; colors: Partial<Record<keyof typeof COLOR_KEYS, string>>
  scale: number; zoom: number; speed: number; autoplay: boolean; loop: boolean
  showCode: boolean; showVars: boolean; showProblems: boolean; showLog: boolean; anim: boolean; sound: boolean; layout: 'side' | 'stacked'; indices: boolean
}
export const DEFAULT_PREFS: Prefs = { theme: 'system', accent: ACCENTS[0], colors: {}, scale: 1, zoom: 1, speed: 500, autoplay: false, loop: false, showCode: true, showVars: true, showProblems: true, showLog: true, anim: true, sound: false, layout: 'side', indices: true }

export function useStored<T>(key: string, init: T) {
  const [v, setV] = useState<T>(() => {
    try { const s = localStorage.getItem(key); if (!s) return init; const j = JSON.parse(s); return init && typeof init === 'object' && !Array.isArray(init) ? { ...init, ...j } : j } catch { return init }
  })
  useEffect(() => { localStorage.setItem(key, JSON.stringify(v)) }, [key, v])
  return [v, setV] as const
}

export function applyPrefs(p: Prefs) {
  const dark = p.theme === 'dark' || (p.theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
  const r = document.documentElement
  r.dataset.theme = dark ? 'dark' : 'light'
  r.dataset.anim = p.anim ? 'on' : 'off'
  r.dataset.idx = p.indices ? 'on' : 'off'
  r.style.setProperty('--accent', p.accent)
  r.style.setProperty('--scale', String(p.scale))
  for (const k of Object.keys(COLOR_KEYS) as (keyof typeof COLOR_KEYS)[]) { const c = p.colors[k]; if (c) r.style.setProperty(`--c-${k}`, c); else r.style.removeProperty(`--c-${k}`) }
}

let ctx: AudioContext | undefined
export function beep(freq: number) {
  try {
    ctx ??= new AudioContext(); const o = ctx.createOscillator(); const g = ctx.createGain()
    o.frequency.value = freq; o.type = 'sine'; g.gain.setValueAtTime(0.06, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12)
    o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.13)
  } catch { /* audio unavailable */ }
}
