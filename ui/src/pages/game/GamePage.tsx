// src/pages/Game.tsx

import { useParams } from "react-router-dom";
import Game from './components/Game';
import { sampleState } from './utils/sampleState';
import { useEffect } from 'react';

export default function GamePage() {
  const { gameId } = useParams();
  useEffect(() => console.log('gameId', gameId), []);
  // TODO: fetch real game state based on gameId

  return <Game gameState={sampleState} />;
}
