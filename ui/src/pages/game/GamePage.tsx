// src/pages/Game.tsx

// import { useParams } from "react-router-dom";
import Game from './components/Game';
import { sampleState } from './utils/sampleState';

export default function GamePage() {
  // const { gameId } = useParams();
  // TODO: fetch real game state based on gameId

  return <Game gameState={sampleState} localPlayerIndex={0} />;
}
