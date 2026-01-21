import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { socket, connectSocket, disconnectSocket } from '../../socket/socket';
import BoardGrid from '../../components/Board/Board';
import GameInfo from '../../components/GameInfo/GameInfo';
import { useGameLogic } from '../../hooks/useGameLogic';
import './GamePlay.css';

function GamePlay() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('roomId');
  
  const { board, size, isXNext, winner, history, resetGame, hydrateBoard, makeMove, myRole, setMyRole } = useGameLogic(15);
  
  const [roomData, setRoomData] = useState({ name: 'Đang tải...', host: '' });
  const [userData, setUserData] = useState({ username: 'Bạn', elo: 0, wins: 0, losses: 0, draws: 0 });
  const [opponentData, setOpponentData] = useState({ username: 'Đối thủ', elo: 0, wins: 0, losses: 0, draws: 0 });
  const [matchId, setMatchId] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOverInfo, setGameOverInfo] = useState(null);
  const [winningLine, setWinningLine] = useState(null);
  const [disconnectMessage, setDisconnectMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [forcedWinner, setForcedWinner] = useState(null);
  const reconnectTimerRef = useRef(null);

  // Xử lý nước đi từ socket
  const handleSocketMove = useCallback((data) => {
    console.log('📥 Received move:', data);
    const { row, col, player } = data;
    const index = row * size + col;
    makeMove(index, player);
  }, [size, makeMove]);

  // Xử lý game over
  const handleGameOver = useCallback((data) => {
    console.log('🏁 Game over:', data);
    setGameOverInfo(data);
    setWinningLine(data.winning_line || null);

    const mySymbol = myRole || 'X';
    const oppSymbol = mySymbol === 'X' ? 'O' : 'X';
    const myKey = `player_${mySymbol.toLowerCase()}`;
    const oppKey = `player_${oppSymbol.toLowerCase()}`;

    const myChanges = data.elo_changes?.[myKey];
    const myStats = data.stats?.[myKey];
    const oppChanges = data.elo_changes?.[oppKey];
    const oppStats = data.stats?.[oppKey];

    if (myChanges || myStats) {
      setUserData(prev => ({
        ...prev,
        elo: myChanges?.new_elo ?? prev.elo,
        wins: myStats?.wins ?? prev.wins,
        losses: myStats?.losses ?? prev.losses,
        draws: myStats?.draws ?? prev.draws
      }));
    }

    if (oppChanges || oppStats) {
      setOpponentData(prev => ({
        ...prev,
        elo: oppChanges?.new_elo ?? prev.elo,
        wins: oppStats?.wins ?? prev.wins,
        losses: oppStats?.losses ?? prev.losses,
        draws: oppStats?.draws ?? prev.draws
      }));
    }
    // winner state is driven by move_made->makeMove; draw handled by gameOverInfo
  }, [myRole]);

  // Refs to avoid re-subscribing on every move
  const handleSocketMoveRef = useRef(handleSocketMove);
  const handleGameOverRef = useRef(handleGameOver);
  const resetGameRef = useRef(resetGame);

  useEffect(() => {
    handleSocketMoveRef.current = handleSocketMove;
  }, [handleSocketMove]);

  useEffect(() => {
    handleGameOverRef.current = handleGameOver;
  }, [handleGameOver]);

  useEffect(() => {
    resetGameRef.current = resetGame;
  }, [resetGame]);

  useEffect(() => {
    if (!roomId) {
      alert('Không tìm thấy phòng');
      navigate('/rooms');
      return;
    }

    // Đảm bảo socket được khởi tạo và kết nối trước khi lắng nghe/emit
    connectSocket();
    if (!socket) {
      alert('Không thể kết nối máy chủ trò chơi');
      navigate('/rooms');
      return;
    }

    // Lắng nghe socket events (dọn listener cũ trước khi đăng ký)
    socket.off('connect');
    socket.off('disconnect');
    socket.off('reconnect_attempt');
    socket.off('reconnect');
    socket.off('joined_room');
    socket.off('player_joined');
    socket.off('game_start');
    socket.off('move_made');
    socket.off('game_over');
    socket.off('player_left');
    socket.off('error');

    const clearReconnectTimer = () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
    };

    const handleConnected = () => {
      setConnectionStatus('connected');
      setDisconnectMessage('');
      clearReconnectTimer();
      socket.emit('join_room', { room_id: parseInt(roomId) });
    };

    const handleDisconnected = () => {
      setConnectionStatus('disconnected');
      setDisconnectMessage('Mất kết nối, đang thử nối lại...');
      if (!reconnectTimerRef.current) {
        reconnectTimerRef.current = setTimeout(() => {
          setDisconnectMessage('Mất kết nối quá 30s, ván kết thúc');
          setForcedWinner(myRole === 'X' ? 'O' : 'X');
          setGameOverInfo(prev => prev || { message: 'Mất kết nối quá 30s, ván kết thúc' });
        }, 30000);
      }
    };

    const handleReconnectAttempt = () => {
      setConnectionStatus('reconnecting');
    };

    const handleReconnect = () => {
      handleConnected();
    };

    socket.on('connect', handleConnected);
    socket.on('disconnect', handleDisconnected);
    socket.on('reconnect_attempt', handleReconnectAttempt);
    socket.on('reconnect', handleReconnect);

    socket.on('joined_room', (data) => {
      console.log('✅ joined_room:', data);
      setMyRole(data.player_symbol);
      setRoomData(prev => ({ ...prev, name: data.room_name || prev.name, host: data.host_name || prev.host }));
      // Nếu server gửi board_state (reconnect) thì hydrate, nếu không thì reset như cũ
      if (data.board_state && Array.isArray(data.board_state)) {
        hydrateBoard(data.board_state, data.current_turn || 'X');
      } else {
        resetGameRef.current(data.board_size);
      }
      setConnectionStatus('connected');
      clearReconnectTimer();
      setDisconnectMessage('');
    });

    socket.on('player_joined', (data) => {
      console.log('👤 player_joined:', data);
      setOpponentData(prev => ({ ...prev, username: data.username || 'Đối thủ' }));
    });

    socket.on('game_start', (data) => {
      console.log('🎮 game_start:', data);
      setMatchId(data.match_id);
      setGameStarted(true);
      resetGameRef.current(data.board_size);
      setConnectionStatus('connected');
      clearReconnectTimer();
    });

    socket.on('sync_state', (data) => {
      console.log('🔄 sync_state:', data);
      if (data.board_state) {
        hydrateBoard(data.board_state, data.current_turn || 'X');
        setMatchId(data.match_id || matchId);
        setGameStarted(true);
      }
      setDisconnectMessage('');
      setConnectionStatus('connected');
      clearReconnectTimer();
    });

    socket.on('move_made', (data) => handleSocketMoveRef.current(data));
    socket.on('game_over', (data) => handleGameOverRef.current(data));

    socket.on('player_left', (data) => {
      const msg = data.message || 'Đối thủ đã rời phòng, chờ 30s để quay lại';
      setDisconnectMessage(msg);
    });

    socket.on('error', (data) => {
      console.error('❌ Socket error:', data);
      const msg = data.error || data.message || 'Có lỗi xảy ra';
      alert(msg);
      if (msg.includes('Phòng không tồn tại') || msg.includes('room')) {
        disconnectSocket();
        navigate('/rooms');
      }
    });

    // Join room (emit nếu đã kết nối)
    if (socket.connected) {
      socket.emit('join_room', { room_id: parseInt(roomId) });
    }

    return () => {
      clearReconnectTimer();
      socket.off('connect', handleConnected);
      socket.off('disconnect', handleDisconnected);
      socket.off('reconnect_attempt', handleReconnectAttempt);
      socket.off('reconnect', handleReconnect);
      socket.off('joined_room');
      socket.off('player_joined');
      socket.off('game_start');
      socket.off('move_made');
      socket.off('game_over');
      socket.off('player_left');
      socket.off('sync_state');
      socket.off('error');
    };
  }, [roomId, navigate, setMyRole]);

  // Gửi nước đi
  const handleSquareClick = (index) => {
    if (board[index] || winner || !gameStarted) return;
    
    const currentPlayer = isXNext ? 'X' : 'O';
    if (currentPlayer !== myRole) {
      console.log('❌ Not your turn');
      return;
    }

    const row = Math.floor(index / size);
    const col = index % size;
    
    console.log('📤 Sending move:', { row, col });
    socket.emit('make_move', {
      room_id: parseInt(roomId),
      row,
      col,
      match_id: matchId
    });
  };

  const handleLeaveRoom = () => {
    if (confirm('Bạn có chắc muốn rời phòng?')) {
      socket.emit('leave_room', { room_id: parseInt(roomId) });
      disconnectSocket();
      navigate('/rooms');
    }
  };

  const handleExitToMenu = () => {
    socket.emit('leave_room', { room_id: parseInt(roomId) });
    disconnectSocket();
    navigate('/rooms');
  };

  const myRoleLabel = myRole || 'X';
  const resolvedWinner = forcedWinner || winner;
  const showGameOver = Boolean(resolvedWinner || gameOverInfo);
  const myEloChange = gameOverInfo?.elo_changes?.[`player_${myRoleLabel.toLowerCase()}`]?.change;

  return (
    <div className="game-container">
      <div className="left-side">
        <BoardGrid board={board} size={size} onSquareClick={handleSquareClick} />
        
        {showGameOver && (
          <div className="win-modal-overlay">
            <div className="win-modal-content">
              {resolvedWinner ? (
                resolvedWinner === myRole ? (
                  <h2 className="winner-text">BẠN THẮNG! 🏆</h2>
                ) : (
                  <h2 className="loser-text">BẠN THUA... 💀</h2>
                )
              ) : (
                <h2 className="winner-text">HÒA VÁN</h2>
              )}
              <p>{gameOverInfo?.message || 'Trận đấu đã kết thúc'}</p>

              {typeof myEloChange === 'number' && (
                <p>ELO của bạn: {myEloChange >= 0 ? '+' : ''}{myEloChange}</p>
              )}
              <div className="rematch-btns">
                <button className="btn-exit" onClick={handleLeaveRoom}>Thoát</button>
                <button className="btn-play-again" onClick={handleExitToMenu}>Về menu</button>
              </div>
              {disconnectMessage && <p className="waiting-status">{disconnectMessage}</p>}
            </div>
          </div>
        )}
      </div>

      {disconnectMessage && !showGameOver && (
        <div className="waiting-status" style={{ textAlign: 'center', marginBottom: '8px', color: '#e67e22' }}>
          {disconnectMessage}
        </div>
      )}

      <GameInfo 
        roomData={roomData}
        userRole={myRoleLabel}
        opponentRole={myRoleLabel === 'X' ? 'O' : 'X'}
        userData={{ ...userData, username: `${userData.username} (${myRoleLabel}${myRole ? ' - Bạn' : ''})` }}
        opponentData={{ ...opponentData, username: `${opponentData.username || 'Đối thủ'} (${myRoleLabel === 'X' ? 'O' : 'X'})` }}
        isXNext={isXNext}
        size={size}
        history={history}
      />
    </div>
  );
}

export default GamePlay;
