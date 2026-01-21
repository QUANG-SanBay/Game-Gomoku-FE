import { useState } from "react";
import ProfileDashboard from "../components/ProfileDashboard/ProfileDashboard";
import Lobby from "../components/Lobby/Lobby";

function Home() {
  const [screen, setScreen] = useState("menu"); 
  // menu | lobby

  return (
    <>
      {screen === "menu" && (
        <ProfileDashboard onPlay={() => setScreen("lobby")} />
      )}

      {screen === "lobby" && (
        <Lobby onBack={() => setScreen("menu")} />
      )}
    </>
  );
}

export default Home;
