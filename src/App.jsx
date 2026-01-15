import React from 'react';
import './App.css';
import BoardContainer from './board/BoardContainer'; // Import từ thư mục board mới

function App() {
  return (
    <div className="app-main">
      {/* 
          Hiện tại chúng ta gọi thẳng BoardContainer. 
          Sau này nếu có Menu, bạn sẽ dùng Logic ở đây để chuyển giữa Menu và BoardContainer.
      */}
      <BoardContainer initialSize={15} />
    </div>
  );
}

export default App;