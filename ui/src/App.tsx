import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PlaygroundPage from './pages/playground/PlaygroundPage';
import { MainMenu } from './pages/main-menu/MainMenu';
import { ToastContainer } from 'react-toastify';

function App() {
  const initDeviceId = (): string => {
    const deviceId = localStorage.getItem('deviceId') || Math.random().toString();
    localStorage.setItem('deviceId', deviceId);
    return deviceId;
  };
  initDeviceId();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/game/:gameId" element={<PlaygroundPage />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
