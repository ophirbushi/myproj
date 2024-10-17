import { useState, useEffect } from 'preact/hooks'
import { css, html } from './utils'
import { PlayerJoinedMessage, wsAddListener } from './ws'
import { GameStateMessage } from '../server/server'
import { route } from 'preact-router'

css`#WaitingRoom {
  display: flex;
  gap: 1rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
`

export const WaitingRoom = ({ wsMessage }: { wsMessage: { type: string } }) => {
  const urlParams = new URLSearchParams(window.location.search);
  const playerName = urlParams.get('playerName');
  const gameId = urlParams.get('gameId');
  const [loading, setLoading] = useState(true)
  const [players, setPlayers] = useState([playerName] as string[])
  const fetchData = async (): Promise<GameStateMessage> => {
    return await fetch(
      'http://localhost:3000/game',
      {
        method: 'put',
        body: JSON.stringify({ playerName, gameId }),
        headers: { 'Content-Type': 'application/json' }
      }
    )
      .then(res => {
        if (!res.ok) {
          throw new Error(res.statusText)
        }
        return res.json()
      })
  }
  useEffect(() => {
    fetchData()
      .then((data) => {
        setPlayers(data.players)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        alert('an error occurred')
        route('/')
      })
  }, [])
  useEffect(() => {
    if (wsMessage.type !== 'player-joined') {
      return
    }
    const { payload } = wsMessage as PlayerJoinedMessage
    setPlayers(payload.players)
  }, [wsMessage])
  const notEnoughPlayers = players.length < 3
  if (loading) {
    return html`<p>Loading...</p>`
  }
  return html`<form id="WaitingRoom">
  <div class="content">
    <h2>Game ${gameId} waiting room</h2>
    <ul>
      ${players.map(player => html`<li key=${player}>${player}</li>`)}
    </ul>
    ${notEnoughPlayers ? html`<p>Waiting for more players to join...</p>` : ''}
    <button type="button" class="btn btn-primary" disabled=${notEnoughPlayers}>Start game</button>
  </div>
</form>`
}
