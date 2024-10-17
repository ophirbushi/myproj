import { GameStateMessage } from '../server/server'

export interface MessageCallback<T> {
  callbackId: string
  callback: (message: T) => void
}

export interface Message<T> {
  type: string
  payload: T
}

export type PlayerJoinedMessage = Message<GameStateMessage>

const callbacks = new Map<string, Array<MessageCallback<any>>>()

export const wsInit = () => {
  const socket = new WebSocket('ws://localhost:3000')
  socket.onopen = () => console.log('Connected to websocket server')
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data)
    console.log('message received from server:', message)
    if (callbacks.has(message.type)) {
      callbacks.get(message.type)?.forEach((callback) => callback.callback(message))
    }
  }
  socket.onclose = () => console.log('Disconnected from websocket server')
  console.log('initialized websocket')
}

export const wsAddListener = <T>(type: string, callback: (message: T) => void) => {
  const callbackId = Math.random().toString()
  const callbacksArray = callbacks.get(type) || []
  callbacksArray.push({ callbackId, callback })
  callbacks.set(type, callbacksArray)
  console.log(`ws added listener to ${type}`, callbacks)
  return callbackId
}

export const wsRemoveListener = (type: string, callbackId: string) => {
  const callbacksArray = callbacks.get(type) || []
  callbacksArray.splice(callbacksArray.findIndex((callback) => callback.callbackId === callbackId), 1)
  callbacks.set(type, callbacksArray)
  console.log(`ws removed listener from ${type}`, callbacks)
}