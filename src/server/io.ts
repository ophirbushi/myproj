import { EventEmitter } from 'events'
import { Input, Output, OutputMessage } from '../engine/models'

export class EventEmitterInput implements Input {
  eventEmitter = new EventEmitter()
  getInput = async<T>() => {
    return await new Promise<T>((resolve) => {
      this.eventEmitter.on('input', resolve)
    })
  }
  postInput = <T>(input: T) => {
    this.eventEmitter.emit('input', input)
  }
}

export class EventEmitterOutput implements Output {
  eventEmitter = new EventEmitter()
  onMessage = (callback: (message: OutputMessage) => void) => {
    this.eventEmitter.on('message', callback)
  }
  broadcast = (message: OutputMessage) => {
    this.eventEmitter.emit('message', message)
  }
}
