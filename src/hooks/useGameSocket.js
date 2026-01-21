import { useEffect, useState, useRef } from 'react';
import socket, { connectSocket } from '../socket/socket';

export const useGameSocket = (roomId, makeMove, setMyRole, resetGame) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [roomInfo, setRoomInfo] = useState(null);

  // Store callbacks in refs to avoid stale closures
  const makeMoveRef = useRef(makeMove);
  const setMyRoleRef = useRef(setMyRole);
  const resetGameRef = useRef(resetGame);
  const roomIdRef = useRef(roomId);

  // Update refs when callbacks change
  useEffect(() => {
    makeMoveRef.current = makeMove;
    setMyRoleRef.current = setMyRole;
    resetGameRef.current = resetGame;
    roomIdRef.current = roomId;
  });

  // Setup socket connection và event listeners
  useEffect(() => {
    if (!roomId) return;

    console.log('🎯 useGameSocket setup for room:', roomId);

    // Kết nối socket
    connectSocket();
    window.socketConnected = true;

    // Hàm gửi nước đi qua socket
    window.sendSocketMove = (index, player) => {
      const row = Math.floor(index / 15);
      const col = index % 15;
      console.log('🚀 Sending move:', { room_id: roomIdRef.current, row, col, player });
      console.log('🔌 Socket connected:', socket.connected);
      socket.emit('make_move', { room_id: roomIdRef.current, row, col });
    };

    // Event handlers - sử dụng refs để tránh stale closures
    const handleJoinedRoom = (data) => {
      console.log('✅ Joined room:', data);
      setRoomInfo(data);
      setMyRoleRef.current(data.player_symbol);
    };

    const handlePlayerJoined = (data) => {
      console.log('✅ Player joined:', data);
    };

    const handleGameStart = (data) => {
      console.log('🎮 Game started:', data);
      setGameStarted(true);
      resetGameRef.current(data.board_size);
    };

    const handleMoveMade = (data) => {
      console.log('♟️ Move made received:', data);
      const { row, col, player } = data;
      const index = row * 15 + col;
      console.log('📍 Calculated index:', index, 'player:', player);
      if (makeMoveRef.current) {
        makeMoveRef.current(index, player);
        console.log('✅ makeMove called');
      } else {
        console.error('❌ makeMoveRef.current is null!');
      }
    };

    const handleGameOver = (data) => {
      console.log('🏁 Game over:', data);
    };

    const handleError = (data) => {
      console.error('❌ Socket error:', data);
    };

    // Xóa listeners cũ trước khi đăng ký mới (tránh duplicate)
    socket.off('joined_room', handleJoinedRoom);
    socket.off('player_joined', handlePlayerJoined);
    socket.off('game_start', handleGameStart);
    socket.off('move_made', handleMoveMade);
    socket.off('game_over', handleGameOver);
    socket.off('error', handleError);

    // Đăng ký event listeners
    socket.on('joined_room', handleJoinedRoom);
    socket.on('player_joined', handlePlayerJoined);
    socket.on('game_start', handleGameStart);
    socket.on('move_made', handleMoveMade);
    socket.on('game_over', handleGameOver);
    socket.on('error', handleError);

    // Join room qua socket
    console.log('📤 Emitting join_room for room:', roomId);
    socket.emit('join_room', { room_id: roomId });

    // Cleanup
    return () => {
      console.log('🧹 useGameSocket cleanup for room:', roomId);
      socket.off('joined_room', handleJoinedRoom);
      socket.off('player_joined', handlePlayerJoined);
      socket.off('game_start', handleGameStart);
      socket.off('move_made', handleMoveMade);
      socket.off('game_over', handleGameOver);
      socket.off('error', handleError);
    };
  }, [roomId]);

  return { gameStarted, roomInfo };
};
