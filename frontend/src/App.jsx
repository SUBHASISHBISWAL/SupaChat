import React, { useState } from 'react';
import QueryHistory from './components/QueryHistory';
import ChatInterface from './components/ChatInterface';
import { useChat } from './hooks/useChat';
import { useQueryHistory } from './hooks/useQueryHistory';

function App() {
  const chatHook = useChat();
  const historyHook = useQueryHistory(chatHook.sendMessage);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => setIsMobileOpen(!isMobileOpen);

  return (
    <div className="app-container">
      <QueryHistory 
        historyHook={historyHook} 
        isMobileOpen={isMobileOpen} 
        toggleMobile={toggleSidebar} 
      />
      <div className="main-content">
        <ChatInterface 
          chatHook={chatHook} 
          onToggleSidebar={toggleSidebar} 
        />
      </div>
    </div>
  );
}

export default App;
