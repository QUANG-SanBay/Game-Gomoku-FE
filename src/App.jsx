import { useState } from "react";

import MainMenu from "./pages/MainMenu";
import Lobby from "./components/Lobby/Lobby";
import Board from "./components/Board/Board";
import Leaderboard from "./pages/Leaderboard";

// ✅ ĐÚNG THEO CÂY THƯ MỤC THỰC TẾ
import MyProfile from "./components/UseProfile/MyProfile";
import OtherProfile from "./components/UseProfile/OtherProfile";

import "./App.css";

function App() {
  const [screen, setScreen] = useState("menu");
  const [selectedUserId, setSelectedUserId] = useState(null);

  return (
    <>
      {screen === "menu" && (
        <MainMenu
          onPlayOnline={() => setScreen("lobby")}
          onLeaderboard={() => setScreen("leaderboard")}
          onMyProfile={() => setScreen("my-profile")}
        />
      )}

      {screen === "lobby" && (
        <Lobby
          onStart={() => setScreen("board")}
          onBack={() => setScreen("menu")}
        />
      )}

      {screen === "board" && (
        <Board onBack={() => setScreen("menu")} />
      )}

      {screen === "leaderboard" && (
        <Leaderboard
          onBack={() => setScreen("menu")}
          onViewProfile={(userId) => {
            setSelectedUserId(userId);
            setScreen("other-profile");
          }}
        />
      )}

      {screen === "my-profile" && (
        <MyProfile onBack={() => setScreen("menu")} />
      )}

      {screen === "other-profile" && selectedUserId && (
        <OtherProfile
          userId={selectedUserId}
          onBack={() => setScreen("leaderboard")}
        />
      )}
    </>
  );
}

export default App;
