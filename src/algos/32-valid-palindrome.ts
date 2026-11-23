import { Algo, Tracer, C, arr } from '../core'
export default {
  name: 'Valid Palindrome', cat: 'Two Pointers', input: 'racecar', problems: ['Valid Palindrome (125)', 'Valid Palindrome II (680)', 'Palindromic Substrings (647)'],
  code: ['l, r = 0, n-1', 'while l < r:', '  if s[l] != s[r]: return False', '  l += 1; r -= 1', 'return True'],
  rand: () => ['racecar', 'abccba', 'abcdba', 'level', 'hello'][Math.floor(Math.random() * 5)],
  run(s) {
    const a = s.toLowerCase().replace(/[^a-z0-9]/g, '').split(''); const tr = new Tracer(); let l = 0, r = a.length - 1
    while (l < r) {
      tr.add(3, `Compare '${a[l]}' and '${a[r]}'`, arr(a, { [l]: C.cmp, [r]: C.cmp }, { l, r }))
      if (a[l] !== a[r]) { tr.add(3, 'Mismatch: not a palindrome', arr(a, { [l]: C.swap, [r]: C.swap }, { l, r })); return tr.frames }
      tr.add(4, 'Match: move inward', arr(a, { [l]: C.done, [r]: C.done }, { l, r })); l++; r--
    }
    tr.add(5, 'Palindrome', arr(a, Object.fromEntries(a.map((_, i) => [i, C.done])))); return tr.frames
  },
} satisfies Algo
