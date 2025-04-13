import { useEffect, useState } from 'react';
import './PlaygroundPage.css';
import GameBoardNew from './components/GameBoard';
import { Hotels } from './components/Hotels';
import { gameState as initState } from './state';
import { fetchGameState, postGameInput } from '../game/services/gameBackendService';
import { Players } from './components/Players';
import { Input, Tile } from '../../../../engine/models';
import { PlayerTiles } from './components/PlayerTiles';
import { isEqualTiles, isTemporarilyIllegalTile } from '../../../../engine/helpers/tiles';
import { getActivePlayerIndex } from '../game/utils/localPlayer';
import { FetchStateResponse } from '../../../../shared/contract';

const localPlayerIndex = 0;

export default function PlaygroundPage() {
  const [gameState, setGameState] = useState(initState);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [availableToSelectTiles, setAvailableToSelectTiles] = useState<Tile[]>([]);

  useEffect(() => {
    fetchGameState().then((res) => {
      setGameState(res.state);
    });
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
  }, [gameState]);

  const updateGameStateAndLogs = ({ state, logs }: FetchStateResponse) => {
    setGameState(state);
    setSelectedTile(null);
  };

  const postInput = async <T = any>(input: Input<T>) => {
    const res = await postGameInput(input);
    updateGameStateAndLogs(res);
  };

  const confirmSelectedTile = (tile: Tile) => {
    const activePlayerIndex = getActivePlayerIndex(gameState);
    const tileIndex = gameState.playerTiles[activePlayerIndex].tiles.findIndex(t => isEqualTiles(t, tile));
    if (tileIndex > -1) {
      postInput({ playerIndex: activePlayerIndex, data: tileIndex });
    }
  };

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
        <Hotels gameState={gameState} />
      </div>
    </div>
  );
}