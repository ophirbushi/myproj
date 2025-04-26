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
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

let intervalFlag = false;

export default function PlaygroundPage() {
  const { gameId } = useParams()
  const [searchParams] = useSearchParams();
  const [localPlayerIndex, setLocalPlayerIndex] = useState(-1);
  const [gameState, setGameState] = useState<State | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [selectedHotelIndex, setSelectedHotelIndex] = useState<number | null>(null);
  const [availableToSelectTiles, setAvailableToSelectTiles] = useState<Tile[]>([]);
  const [isBoardActive, setIsBoardActive] = useState(false);

  const updateGameStateAndLogs = ({ state, logs }: FetchStateResponse) => {
    setGameState(state);
    setSelectedTile(null);
    setLogs(logs);
  };

  const postInput = async <T = any>(data: T, localPlayerIndex: number) => {
    if (!gameId) {
      return;
    }
    const res = await postGameInput(gameId, { data, playerIndex: localPlayerIndex }, localPlayerIndex);
    updateGameStateAndLogs(res);
  };

  const confirmSelectedTile = (tile: Tile) => {
    if (!gameState) {
      return;
    }
    const tileIndex = gameState.playerTiles[localPlayerIndex].tiles.findIndex(t => isEqualTiles(t, tile));
    if (tileIndex > -1) {
      postInput(tileIndex, localPlayerIndex);
    }
  };

  useEffect(() => {
    if (!logs?.length) {
      return;
    }
    for (let log of logs) {
      toast.info(log);
    }
  }, [logs]);

  useEffect(() => {
    if (!gameState) {
      return;
    }
    const playerIndex = searchParams.get('pi');
    if (
      playerIndex == null ||
      isNaN(playerIndex as any) ||
      !Number.isInteger(+playerIndex) ||
      +playerIndex < 0 ||
      +playerIndex >= gameState.config.numberOfPlayers
    ) {
      return;
    }
    setLocalPlayerIndex(+playerIndex)
  }, [searchParams, gameState != null]);

  useEffect(() => {
    if (gameId == null) {
      return;
    }

    let lastState: string | null = null;
    const fetchAndUpdate = () => {
      fetchGameState(gameId, localPlayerIndex).then((response) => {
        if (JSON.stringify(response.state) === lastState) {
          return;
        }
        lastState = JSON.stringify(response.state);
        updateGameStateAndLogs(response)
      });
    };
    fetchAndUpdate();
    if (!intervalFlag && localPlayerIndex !== -1) {
      intervalFlag = true;
      setInterval(() => fetchAndUpdate(), 1000);
    }
  }, [gameId, localPlayerIndex]);

  useEffect(() => {
    if (!gameState || localPlayerIndex === -1) {
      return;
    }
    const localPlayerTiles = gameState.playerTiles[localPlayerIndex].tiles;
    const availableToSelectTiles = localPlayerTiles.filter((tile) => !isTemporarilyIllegalTile(gameState, tile));
    setAvailableToSelectTiles(availableToSelectTiles);
  }, [gameState, localPlayerIndex]);

  useEffect(() => {
    if (!gameState || localPlayerIndex === -1) {
      return;
    }
    setIsBoardActive(gameState.phaseId === 'build' && localPlayerIndex === getActivePlayerIndex(gameState))
  }, [gameState, localPlayerIndex]);

  useEffect(() => {
    if (!gameState) {
      return;
    }
    if (localPlayerIndex === gameState.currentPlayerIndex && isPossibleGameEnd(gameState)) {
      setTimeout(() => {
        if (confirm('Do you want to end the game now?')) {
          postInput('finish', localPlayerIndex);
        }
      }, 500);
    }
  }, [gameState?.currentPlayerIndex, localPlayerIndex]);

  if (!gameState) {
    return 'loading...'
  }

  return (
    <div className="playground-container">
      <PhaseBanner gameState={gameState} localPlayerIndex={localPlayerIndex} />
      <Players gameState={gameState} localPlayerIndex={localPlayerIndex} />
      <div className="game-area">
        <PlayerTiles gameState={gameState} localPlayerIndex={localPlayerIndex} availableToSelectTiles={availableToSelectTiles}
          selectedTile={selectedTile} setSelectedTile={setSelectedTile} confirmSelectedTile={confirmSelectedTile} isActive={isBoardActive} />
        <GameBoardNew gameState={gameState} localPlayerIndex={localPlayerIndex} availableToSelectTiles={availableToSelectTiles}
          selectedTile={selectedTile} setSelectedTile={setSelectedTile} isActive={isBoardActive} />
        <Hotels isLocalPlayerActive={localPlayerIndex === gameState.currentPlayerIndex}
          gameState={gameState} selectedHotelIndex={selectedHotelIndex} setSelectedHotelIndex={setSelectedHotelIndex}
          confirmSelectedHotelIndex={(selectedHotelIndex) => postInput(selectedHotelIndex, localPlayerIndex)}
        />
        <BuyStocks
          gameState={gameState}
          open={gameState.phaseId === 'invest' && localPlayerIndex === gameState.currentPlayerIndex}
          onConfirm={(decisions) => postInput(decisions, localPlayerIndex)}
          localPlayerIndex={localPlayerIndex}
        />
        <MergeDecisions
          gameState={gameState}
          open={gameState.phaseId === 'mergeDecide' && localPlayerIndex === getActivePlayerIndex(gameState)}
          localPlayerIndex={localPlayerIndex}
          onConfirm={(decisions) => postInput(decisions, localPlayerIndex)}
        />
        <GameOver open={gameState.phaseId === 'gameEnd'} onClose={() => { }} gameState={gameState} />
      </div>
    </div>
  );
}