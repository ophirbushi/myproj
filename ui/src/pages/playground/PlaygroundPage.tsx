import { useEffect, useState } from 'react';
import './PlaygroundPage.css';
import GameBoardNew from './components/GameBoard';
import { Hotels } from './components/Hotels';
import { gameState as initState } from './state';
import { fetchGameState, postGameInput } from '../game/services/gameBackendService';
import { Players } from './components/Players';
import { Tile } from '../../../../engine/models';
import { PlayerTiles } from './components/PlayerTiles';
import { isEqualTiles, isTemporarilyIllegalTile } from '../../../../engine/helpers/tiles';
import { getActivePlayerIndex } from '../game/utils/localPlayer';
import { FetchStateResponse } from '../../../../shared/contract';
import BuyStocks from '../game/components/BuyStocks';
import MergeDecisions from '../game/components/MergerDecisions';

export default function PlaygroundPage() {
  const [localPlayerIndex, setLocalPlayerIndex] = useState(0);
  const [gameState, setGameState] = useState(initState);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [selectedHotelIndex, setSelectedHotelIndex] = useState<number | null>(null);
  const [availableToSelectTiles, setAvailableToSelectTiles] = useState<Tile[]>([]);

  const updateGameStateAndLogs = ({ state, logs }: FetchStateResponse) => {
    setGameState(state);
    setSelectedTile(null);
  };

  const postInput = async <T = any>(data: T) => {
    const res = await postGameInput({ data, playerIndex: localPlayerIndex });
    updateGameStateAndLogs(res);
  };

  const confirmSelectedTile = (tile: Tile) => {
    const tileIndex = gameState.playerTiles[localPlayerIndex].tiles.findIndex(t => isEqualTiles(t, tile));
    if (tileIndex > -1) {
      postInput(tileIndex);
    }
  };

  useEffect(() => {
    fetchGameState().then((response) => updateGameStateAndLogs(response));
  }, []);

  useEffect(() => {
    if (gameState.phaseId !== 'build' || localPlayerIndex !== getActivePlayerIndex(gameState)) {
      setSelectedTile(null);
      setAvailableToSelectTiles([]);
      return;
    }
    const localPlayerTiles = gameState.playerTiles[localPlayerIndex].tiles;
    const availableToSelectTiles = localPlayerTiles.filter((tile) => !isTemporarilyIllegalTile(gameState, tile));
    setAvailableToSelectTiles(availableToSelectTiles);
  }, [gameState, localPlayerIndex]);

  // for local development:
  useEffect(() => {
    setLocalPlayerIndex(getActivePlayerIndex(gameState));
  }, [gameState]);

  return (
    <div className="playground-container">
      <div className="turn-indicator">
        <span>Turn indication</span>
      </div>
      <Players gameState={gameState} localPlayerIndex={localPlayerIndex} />
      <div className="game-area">
        <PlayerTiles gameState={gameState} localPlayerIndex={localPlayerIndex} availableToSelectTiles={availableToSelectTiles}
          selectedTile={selectedTile} setSelectedTile={setSelectedTile} confirmSelectedTile={confirmSelectedTile} />
        <GameBoardNew gameState={gameState} localPlayerIndex={localPlayerIndex} availableToSelectTiles={availableToSelectTiles}
          selectedTile={selectedTile} setSelectedTile={setSelectedTile} />
        <Hotels gameState={gameState} selectedHotelIndex={selectedHotelIndex} setSelectedHotelIndex={setSelectedHotelIndex}
          confirmSelectedHotelIndex={(selectedHotelIndex) => postInput(selectedHotelIndex)}
        />
        <BuyStocks
          gameState={gameState}
          open={gameState.phaseId === 'invest' && localPlayerIndex === gameState.currentPlayerIndex}
          onConfirm={(decisions) => postInput(decisions)}
          localPlayerIndex={localPlayerIndex}
        />
        <MergeDecisions
          gameState={gameState}
          open={gameState.phaseId === 'mergeDecide' && localPlayerIndex === getActivePlayerIndex(gameState)}
          localPlayerIndex={localPlayerIndex}
          onConfirm={(decisions) => postInput(decisions)}
        />
      </div>
    </div>
  );
}