
// class property
// decorators-legacy
@m
class A {
  foo = 'bar'
}

// dynamicImport
import('./bar');

// exportDefaultFrom
export default from './a';

// exportNamespaceFrom
export { a } from './b'

// functionBind
a::b();

// nullishCoalescingOperator
a ?? 'b';

// objectRestSpread
const { g, ...h } = c;

// optionalChaining
a?.b();

// jsx
function App() {
  return <h1>App</h1>;
}
