import { useState } from "react";
import Lobby from "./components/Lobby/Lobby";
import Board from "./components/Board/Board";
import "./App.css";

function App() {
  const [inGame, setInGame] = useState(false);

  return (
    <>
      {inGame ? (
        <Board />
      ) : (
        <Lobby onStart={() => setInGame(true)} />
      )}
    </>
  );
}

export default App;
