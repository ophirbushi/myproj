import { render } from 'preact'
import { html, css } from './utils'
import { Router } from 'preact-router'
import { Home } from './Home'

css`#App {}`

const App = () => {
  return html`<div id="App">
  <${Router}>
    <${Home} path="/" />
  </${Router}>
</div>`
}

render(html`<${App} />`, document.body)
