import { useMemo } from 'react';
import { State } from '../../../../../engine/models';
import { Player, PlayerProps } from './Player';
import { getActivePlayerIndex } from '../../game/utils/localPlayer';

export interface PlayersProps {
  gameState: State;
  localPlayerIndex: number
}

export const Players = ({ gameState, localPlayerIndex }: PlayersProps) => {
  const players = useMemo(() => {
    return gameState.playerTiles.map<PlayerProps>((_, playerIndex) => {
      const playerStocks: number[] = [];
      for (let hotelIndex = 0; hotelIndex < gameState.config.hotels.length; hotelIndex++) {
        playerStocks.push(gameState.stocks[hotelIndex][playerIndex]);
      }
      return {
        playerIndex,
        hotels: gameState.config.hotels,
        playerName: 'Player ' + (playerIndex + 1),
        cash: gameState.cash[playerIndex],
        isActive: playerIndex === getActivePlayerIndex(gameState),
        isLocal: playerIndex === localPlayerIndex,
        playerStocks
      };
    })
  }, [gameState]);
  return (
    <div className="players-container">
      {players.map((player, i) => (
        <Player {...player} key={i}></Player>
      ))}
    </div>
  );
};