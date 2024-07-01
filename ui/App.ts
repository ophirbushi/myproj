import { render } from 'preact'
import { html, css } from './utils'
import { Router } from 'preact-router'
import { Home } from './Home'
import { WaitingRoom } from './WaitingRoom'

css`#App {
  background-image: url('./pexels-pixabay-260922.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 100vh;

  .content {
    background: rgba(255, 255, 255, .85);
    padding: 2rem;
    border-radius: 8px;
  }
}`

const App = () => {
  return html`<div id="App">
  <${Router}>
    <${Home} path="/" />
    <${WaitingRoom} path="/new-game" />
  </${Router}>
</div>`
}

render(html`<${App} />`, document.body)
