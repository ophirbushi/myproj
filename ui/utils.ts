import { h } from 'preact'
import htm from 'htm'

export const html = htm.bind(h)

export const css = (...styles: TemplateStringsArray[]) => {
  const style = document.createElement('style')
  style.textContent = styles[0].toString()
  document.head.appendChild(style)
}
