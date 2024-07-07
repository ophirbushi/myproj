import { Link } from 'preact-router'
import { css, html } from './utils'

css`.Header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
`

export const Header = () => {
  return html`<header class="Header">
  <nav class="navbar navbar-light" style="background-color: rgba(255,255,255, .75);">
    <div class="container-fluid">
      <${Link} class="navbar-brand" href="/">Home</${Link}>
    </div>
  </nav>
</header>`
}