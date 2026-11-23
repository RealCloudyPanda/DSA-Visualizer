import { Algo, Tracer, C, arr, range } from '../core'
export default {
  name: 'Variable Sliding Window', cat: 'Sliding Window', input: 'abcabcbb', hint: 'Longest substring without repeating characters',
  problems: ['Longest Substring Without Repeating Characters (3)', 'Longest Repeating Character Replacement (424)', 'Minimum Window Substring (76)', 'Best Time to Buy and Sell Stock (121)'],
  code: ['seen = set(); l = 0; best = 0', 'for r in 0..n-1:', '  while s[r] in seen:', '    seen.remove(s[l]); l += 1', '  seen.add(s[r])', '  best = max(best, r-l+1)'],
  rand: () => Array.from({ length: 10 }, () => 'abcde'[Math.floor(Math.random() * 5)]).join(''),
  run(s) {
    const a = s.split(''); const seen = new Set<string>(); const tr = new Tracer(); let l = 0, best = 0, bl = 0
    for (let r = 0; r < a.length; r++) {
      tr.add(2, `Look at '${a[r]}'`, arr(a, { ...range(l, r - 1, C.act), [r]: C.cmp }, { l, r }), { seen: [...seen], best })
      while (seen.has(a[r])) { seen.delete(a[l]); tr.add(4, `'${a[r]}' repeats: drop '${a[l]}'`, arr(a, { ...range(l + 1, r - 1, C.act), [l]: C.swap, [r]: C.cmp }, { l, r }), { seen: [...seen] }); l++ }
      seen.add(a[r])
      if (r - l + 1 > best) { best = r - l + 1; bl = l }
      tr.add(6, `Window '${a.slice(l, r + 1).join('')}' length ${r - l + 1}`, arr(a, range(l, r, C.act), { l, r }), { seen: [...seen], best })
    }
    tr.add(6, `Longest = ${best}`, arr(a, range(bl, bl + best - 1, C.done)), { best }); return tr.frames
  },
} satisfies Algo
