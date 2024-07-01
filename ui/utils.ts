import { h } from 'preact'
import htm from 'htm'

export const html = htm.bind(h)

export const css = (...styles: TemplateStringsArray[]) => {
  const style = document.createElement('style')
  style.textContent = styles[0].toString()
  document.head.appendChild(style)
}

export class RealtimeService {

  connect(gameId: number) {
    return new WebSocket(`ws://localhost:3000?gameId=${gameId}`)
  }

  handleMessages(ws: WebSocket) {
    ws.onmessage = event =>{
      const message = JSON.parse(event.data)
    }
  }
}

export const rts = new RealtimeService()
