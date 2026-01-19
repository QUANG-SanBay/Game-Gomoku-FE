import { useState } from "react";
import MainMenu from "./pages/MainMenu";
import Lobby from "./components/Lobby/Lobby";
import Board from "./components/Board/Board";
import Leaderboard from "./pages/Leaderboard";
import "./App.css";

function App() {
  const [screen, setScreen] = useState("menu");

  return (
    <>
      {screen === "menu" && (
        <MainMenu
          onPlayOnline={() => setScreen("lobby")}
          onLeaderboard={() => setScreen("leaderboard")}
        />
      )}

      {screen === "lobby" && (
        <Lobby
          onStart={() => setScreen("board")}
          onBack={() => setScreen("menu")}
        />
      )}

      {screen === "board" && <Board />}

      {screen === "leaderboard" && (
        <Leaderboard onBack={() => setScreen("menu")} />
      )}
    </>
  );
}

export default App;
