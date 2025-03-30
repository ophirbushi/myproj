import { useEffect } from 'react';
import GameBoard from './GameBoard';
import PlayerBar from './PlayerBar';
import TileHandBar from './TileHandBar';
import PhaseBanner from './PhaseBanner';
import HotelsInfo from './HotelsInfo';
import GameLog from './GameLog';

export default function Game({ gameState, gameId }: { gameState: any, gameId: string | undefined }) {
  useEffect(() => {
    console.log(gameState, gameId);
  }, []);

  return (
    <>
      <PhaseBanner />
      <PlayerBar />
      <HotelsInfo />
      <GameBoard />
      <GameLog />
      <TileHandBar />
    </>
  );
}