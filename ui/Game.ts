import { useState, useEffect } from 'preact/hooks'
import { css, html } from './utils'

css`#Game {
  display: flex;
  gap: 1rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
`

export const Game = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const playerName = urlParams.get('playerName');
  const gameId = urlParams.get('gameId');

  useEffect(() => {
    fetch(`http://localhost:3000/game?gameId=${gameId}`)
  }, [])
  const [players, setPlayers] = useState([playerName] as string[])
  const notEnoughPlayers = players.length < 3

  return html`<div id="Game">
 
  <div class="content">
    <h2>Game ${gameId} waiting room</h2>
    <ul>
      ${players.map(player => (html`<li key=${player}>${player}</li>`))}
    </ul>
    ${notEnoughPlayers ? html`<p>Waiting for more players to join...</p>` : ''}
    <button type="button" class="btn btn-primary" disabled=${notEnoughPlayers}>Start game</button>
  </div>
</div>`
}
