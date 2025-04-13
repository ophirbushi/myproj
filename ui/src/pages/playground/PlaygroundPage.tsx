import { useEffect, useState } from 'react';
import './PlaygroundPage.css';
import { State, Tile } from '../../../../engine/models';
import { isPossibleGameEnd, isEqualTiles, isTemporarilyIllegalTile } from '../../../../engine/helpers';
import GameBoardNew from './components/GameBoard';
import { FetchStateResponse } from '../../../../shared/contract';
import { Hotels } from './components/Hotels';
import { fetchGameState, postGameInput } from './services/gameBackendService';
import { Players } from './components/Players';
import { PlayerTiles } from './components/PlayerTiles';
import { getActivePlayerIndex } from './utils/localPlayer';
import BuyStocks from './components/BuyStocks';
import MergeDecisions from './components/MergerDecisions';
import GameOver from './components/GameOver';
import PhaseBanner from './components/PhaseBanner';
import { useParams } from 'react-router-dom';

export default function PlaygroundPage() {
  const { gameId } = useParams()
  const [localPlayerIndex, setLocalPlayerIndex] = useState(-1);
  const [gameState, setGameState] = useState<State | null>(null);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [selectedHotelIndex, setSelectedHotelIndex] = useState<number | null>(null);
  const [availableToSelectTiles, setAvailableToSelectTiles] = useState<Tile[]>([]);

  const updateGameStateAndLogs = ({ state }: FetchStateResponse) => {
    setGameState(state);
    setSelectedTile(null);
  };

  const postInput = async <T = any>(data: T) => {
    if (!gameId) {
      return;
    }
    const res = await postGameInput(gameId, { data, playerIndex: localPlayerIndex });
    updateGameStateAndLogs(res);
  };

  const confirmSelectedTile = (tile: Tile) => {
    if (!gameState) {
      return;
    }
    const tileIndex = gameState.playerTiles[localPlayerIndex].tiles.findIndex(t => isEqualTiles(t, tile));
    if (tileIndex > -1) {
      postInput(tileIndex);
    }
  };

  useEffect(() => {
    if (gameId == null) {
      return;
    }
    fetchGameState(gameId).then((response) => updateGameStateAndLogs(response));
  }, [gameId]);

  useEffect(() => {
    if (!gameState) {
      return;
    }
    if (gameState.phaseId !== 'build' || localPlayerIndex !== getActivePlayerIndex(gameState)) {
      setSelectedTile(null);
      setAvailableToSelectTiles([]);
      return;
    }
    const localPlayerTiles = gameState.playerTiles[localPlayerIndex].tiles;
    const availableToSelectTiles = localPlayerTiles.filter((tile) => !isTemporarilyIllegalTile(gameState, tile));
    setAvailableToSelectTiles(availableToSelectTiles);
  }, [gameId, gameState, localPlayerIndex]);

  // // for local development:
  useEffect(() => {
    if (!gameState) {
      return;
    }
    setLocalPlayerIndex(getActivePlayerIndex(gameState));
  }, [gameId, gameState]);

  useEffect(() => {
    if (!gameState) {
      return;
    }
    if (localPlayerIndex === gameState.currentPlayerIndex && isPossibleGameEnd(gameState)) {
      setTimeout(() => {
        if (confirm('Do you want to end the game now?')) {
          postInput('finish');
        }
      }, 500);
    }
  }, [gameId, gameState?.currentPlayerIndex, localPlayerIndex]);

  // useEffect(() => {
  //   if (localPlayerIndex === -1 && !isPrompted) {
  //     let playerIndex = null;
  //     while (playerIndex == null) {
  //       const player = (prompt('Please select which player number you want to be? (1 - 4)') || '').trim();
  //       isPrompted = true;
  //       if (['1', '2', '3', '4'].includes(player)) {
  //         playerIndex = (+player) - 1;
  //       }
  //     }
  //     setLocalPlayerIndex(playerIndex);
  //   }
  // }, [localPlayerIndex]);

  if (!gameState) {
    return 'loading...'
  }

  return (
    <div className="playground-container">
      <PhaseBanner gameState={gameState} localPlayerIndex={localPlayerIndex} />
      {/* */}
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
        <GameOver open={gameState.phaseId === 'gameEnd'} onClose={() => { }} gameState={gameState} />
      </div>
    </div>
  );
}