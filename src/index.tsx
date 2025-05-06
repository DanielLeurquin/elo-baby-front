import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './app/site/login/login';
import Register from './app/site/login/register';
import Leaderboard from './app/site/leaderboard/leaderboard';
import { Profil } from './app/site/profil/profil';
import { History } from './app/site/historique/history';
import GamePage from './app/site/game/Game';



export default function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/game" />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile/:username" element={<Profil />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
