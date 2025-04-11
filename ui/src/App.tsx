import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import GamePage from './pages/game/GamePage';
import PlaygroundPage from './pages/playground/PlaygroundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Future: home/login/menu */}
        <Route path="/" element={<PlaygroundPage />} />
        <Route path="/game/:gameId" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
