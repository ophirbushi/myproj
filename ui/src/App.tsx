import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PlaygroundPage from './pages/playground/PlaygroundPage';

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
        <Route path="/" element={<PlaygroundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
