import { createNewGame } from '../playground/services/gameBackendService';

export const MainMenu = () => {
  const newGame = async () => {
    const response = await createNewGame()
    if (response?.gameId) {
      window.location.href = `/game/${response.gameId}`;
    } else {
      console.error('Failed to create a new game');
    }
  }

  return (
    <div>
      <button onClick={newGame}>New Game</button>
    </div>
  );
}