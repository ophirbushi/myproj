import { render } from 'preact'
import { html, css } from './utils'
import { Router } from 'preact-router'
import { Home } from './Home'
import { WaitingRoom } from './WaitingRoom'
import { useEffect, useState } from 'preact/hooks'
import { Header } from './Header'
import { Message, PlayerJoinedMessage, wsAddListener, wsInit } from './ws'

css`#App {
  background-image: url('./pexels-pixabay-260922.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

#App .content {
  background: rgba(255, 255, 255, .85);
  padding: 2rem;
  border-radius: 8px;
}`

const App = () => {
  const [wsMessage, setWsMessage] = useState<Message<any>>({ type: '', payload: null })

  useEffect(() => {
    wsInit()
    wsAddListener<{ gameId: string, players: string[] }>(
      'player-joined',
      ({ gameId, players }) => {
        const message: PlayerJoinedMessage = { type: 'player-joined', payload: { gameId, players } }
        setWsMessage(message)
      }
    )
  }, [])

  return html`<div id="App">
  <${Header} />
  <${Router}>
    <${Home} path="/" />
    <${WaitingRoom} path="/game" wsMessage=${wsMessage} />
  </${Router}>
</div>`
}

render(html`<${App} />`, document.body)
