import "./Leaderboard.css";

export default function Leaderboard({ onBack }) {
  const players = [
    { name: "Nguyễn Văn A", elo: 0, wins: 0, losses: 0, draws: 0 },
    { name: "Trần Văn B", elo: 0, wins: 0, losses: 0, draws: 0 },
    { name: "Lê Văn C", elo: 0, wins: 0, losses: 0, draws: 0 },
    { name: "Phạm Văn D", elo: 0, wins: 0, losses: 0, draws: 0 },
  ];

  return (
    <div className="leaderboard-bg">
      <div className="leaderboard-card">
        <button className="back-btn" onClick={onBack}>
          ⬅ Menu
        </button>

        <h1>🏆 Bảng xếp hạng</h1>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Người chơi</th>
              <th>Elo</th>
              <th>Thắng</th>
              <th>Thua</th>
              <th>Hòa</th>
            </tr>
          </thead>

          <tbody>
            {players.map((p, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{p.name}</td>
                <td>{p.elo}</td>
                <td>{p.wins}</td>
                <td>{p.losses}</td>
                <td>{p.draws}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
