import { State } from '../engine/models'
import { DBAdaptor } from './db'
import * as fs from 'fs'
import * as path from 'path'

const gamesPath = path.resolve(__dirname, './games')

const getFilePath = (gameId: string) => path.resolve(gamesPath, `${gameId}.json`)

const getGame = async (gameId: string): Promise<State> => {
  return await new Promise((resolve, reject) => {
    const filePath = getFilePath(gameId)
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err)
        return
      }
      try {
        const state: State = JSON.parse(data.toString())
        resolve(state)
      } catch (err2) {
        reject(err2)
      }
    })
  })
}

const saveGame = async (gameId: string, state: State) => {
  await new Promise((resolve, reject) => {
    const filePath = getFilePath(gameId)
    fs.mkdirSync(gamesPath, { recursive: true })
    fs.writeFile(filePath, JSON.stringify(state), (err) => {
      if (err) {
        reject(err)
      } else {
        resolve(null)
      }
    })
  })
}

export const fileDBAdaptor: DBAdaptor = {
  get: getGame,
  set: saveGame
}
