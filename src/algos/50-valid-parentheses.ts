import { Algo, Tracer, C, arr } from '../core'
export default {
  name: 'Stack (Valid Parentheses)', cat: 'Stack', input: '{[()()]}', problems: ['Valid Parentheses (20)', 'Min Stack (155)', 'Evaluate Reverse Polish Notation (150)', 'Generate Parentheses (22)', 'Car Fleet (853)'],
  code: ['stack = []', 'for c in s:', '  if c is opening: stack.push(c)', '  elif stack empty or top != match(c):', '    return False', '  else: stack.pop()', 'return stack is empty'],
  rand: () => ['{[()()]}', '([)]', '(()', '()[]{}', '{[]}()'][Math.floor(Math.random() * 5)],
  run(s) {
    const a = s.split(''); const st: string[] = []; const m: Record<string, string> = { ')': '(', ']': '[', '}': '{' }; const tr = new Tracer()
    const v = (i: number, c: string) => [arr(a, { [i]: c }, { i }, 'input'), arr(st, st.length ? { [st.length - 1]: C.act } : {}, {}, 'stack (top on right)')]
    for (let i = 0; i < a.length; i++) {
      const c = a[i]
      if ('([{'.includes(c)) { st.push(c); tr.add(3, `Push '${c}'`, v(i, C.act)) }
      else if (!st.length || st[st.length - 1] !== m[c]) { tr.add(5, `'${c}' has no match: invalid`, v(i, C.swap)); return tr.frames }
      else { st.pop(); tr.add(6, `'${c}' matches top: pop`, v(i, C.done)) }
    }
    tr.add(7, st.length ? 'Unclosed brackets: invalid' : 'Stack empty: valid', v(-1, '')); return tr.frames
  },
} satisfies Algo
