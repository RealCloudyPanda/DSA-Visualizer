import { Algo, Tracer, C, nums, arr, randNums, GridView } from '../core'
const B = 7
export default {
  name: 'Hash Map (Two Sum)', cat: 'Arrays & Hashing', input: '2, 7, 11, 15, 3, 6 | 9', hint: 'values | target. Buckets use key % 7 with chaining.',
  problems: ['Two Sum (1)', 'Contains Duplicate (217)', 'Valid Anagram (242)', 'Group Anagrams (49)', 'Top K Frequent Elements (347)', 'Longest Consecutive Sequence (128)', 'LRU Cache (146)'],
  code: ['seen = {}  # value -> index', 'for i, x in enumerate(a):', '  need = target - x', '  if need in seen: return [seen[need], i]', '  seen[x] = i  # bucket = hash(x) % size'],
  rand: () => { const a = randNums(7, 1, 20).split(', ').map(Number); return `${a.join(', ')} | ${a[1] + a[4]}` },
  run(s) {
    const [p, q] = s.split('|'); const a = nums(p); const t = Number(q); const tr = new Tracer()
    const buckets: string[][] = Array.from({ length: B }, () => [])
    const grid = (hb?: number, col = C.cmp): GridView => { const w = Math.max(1, ...buckets.map(b => b.length)); return { kind: 'grid', title: 'buckets (key → index)', rows: buckets.map((_, i) => i), cells: buckets.map(b => [...b, ...Array(w - b.length).fill('')]), colors: hb === undefined ? {} : Object.fromEntries(buckets[hb].map((_, j) => [`${hb},${j}`, col])) } }
    for (let i = 0; i < a.length; i++) {
      const need = t - a[i]; const hb = ((need % B) + B) % B
      tr.add(3, `need = ${t} - ${a[i]} = ${need}, look in bucket ${hb}`, [arr(a, { [i]: C.act }, { i }), grid(hb)], { i, x: a[i], need })
      const hit = buckets[hb].find(e => Number(e.split('→')[0]) === need)
      if (hit) { tr.add(4, `Found ${need} at index ${hit.split('→')[1]}`, [arr(a, { [i]: C.done, [Number(hit.split('→')[1])]: C.done }), grid(hb, C.done)], { answer: [Number(hit.split('→')[1]), i] }); return tr.frames }
      const b = ((a[i] % B) + B) % B; buckets[b].push(`${a[i]}→${i}`)
      tr.add(5, `Store ${a[i]} in bucket ${a[i]} % ${B} = ${b}`, [arr(a, { [i]: C.act }, { i }), grid(b, C.act)], { i })
    }
    tr.add(5, 'No pair found', [arr(a), grid()]); return tr.frames
  },
} satisfies Algo
