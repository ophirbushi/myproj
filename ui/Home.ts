import { useState } from 'preact/hooks'
import { css, html } from './utils'

css`#Home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: lightblue;
}

#Home > * {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
}`

export const Home = () => {
  const [userName, setUserName] = useState('')
  const isFormValid = userName.length >= 2
  const onInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    setUserName(target.value)
  }
  return html`<div id="Home">
  <div>
    <h1>Welcome to Acquire</h1>
      <div style="display: flex; flex-direction: column;">
        <label class="form-label" for="username">Please enter your name</label>
        <input class="form-control" type="text" id="username" placeholder="Your name" value=${userName}
          onInput=${onInput} />
      </div>
      <div style="display: flex; align-items: center; gap: 1rem;">
        <button class="btn btn-primary" type="button" disabled=${!isFormValid}>New Game</button>
        <button class="btn btn-secondary" type="button" disabled=${!isFormValid}>Join Game</button>
      </div>
    </div>
</div>`
}
