import { useEffect, useState } from 'react';
import './PlaygroundPage.css';
import GameBoardNew from './components/GameBoard';
import { Hotels } from './components/Hotels';
import { gameState as initState } from './state';
import { fetchGameState } from '../game/services/gameBackendService';
import { Players } from './components/Players';

export default function PlaygroundPage() {
  const [gameState, setGameState] = useState(initState);

  useEffect(() => {
    fetchGameState().then((res) => {
      setGameState(res.state);
    });
  }, []);

  return (
    <div className="playground-container">
      <div className="turn-indicator">
        <span>Turn indication</span>
      </div>

      <Players gameState={gameState} localPlayerIndex={0}></Players>

      <div className="game-area">
        <div className="player-tiles">
          <ul>
            {gameState.playerTiles[0].tiles.map(([x, y], i) => (
              <li key={i} className="tile-card common-bordered common-padded">
                {String.fromCharCode(65 + x)}{y + 1}
              </li>
            ))}
          </ul>
        </div>
        <GameBoardNew gameState={gameState} localPlayerIndex={0}></GameBoardNew>
        <Hotels gameState={gameState}></Hotels>
      </div>
    </div>
  );
}