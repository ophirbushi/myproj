import { useState } from 'preact/hooks'
import { css, html } from './utils'
import { route } from 'preact-router'

css`#Home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

#Home > * {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
}`

export const Home = () => {
  const [playerName, setPlayerName] = useState('')
  const isFormValid = playerName.length >= 2
  const onInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    setPlayerName(target.value)
  }
  const onNewGameClick = async () => {
    try {
      const { gameId } = await fetch(
        'http://localhost:3000/new-game',
        { method: 'post', body: JSON.stringify({ playerName }), headers: { 'Content-Type': 'application/json' } }
      ).then(res => res.json())
      route(`/new-game?playerName=${playerName}&gameId=${gameId}`)
    } catch (err) {
      console.error(err)
      alert('Oops')
    }
  }
  return html`<div id="Home">
  <div class="content">
    <h1>Welcome to Acquire</h1>
    <div style="display: flex; flex-direction: column;">
      <label class="form-label" for="playerName">Please enter your name</label>
      <input class="form-control" type="text" id="playerName" placeholder="Your name" value=${playerName}
        onInput=${onInput} />
    </div>
    <div style="display: flex; align-items: center; gap: 1rem;">
      <button class="btn btn-primary" type="button" disabled=${!isFormValid} onClick=${onNewGameClick}>New Game</button>
      <button class="btn btn-secondary" type="button" disabled=${!isFormValid}>Join Game</button>
    </div>
  </div>
</div>`
}
