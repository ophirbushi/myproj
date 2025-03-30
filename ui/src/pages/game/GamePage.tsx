// src/pages/Game.tsx

import { useParams } from "react-router-dom";
import Game from './components/Game';

export default function GamePage() {
  const { gameId } = useParams();
  // TODO: fetch real game state based on gameId
  const mockGameState = { phase: "BUY_STOCKS", currentPlayer: "P1" };

  return <Game gameState={mockGameState} gameId={gameId} />;
}
