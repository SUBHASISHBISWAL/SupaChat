import React, { useState, useRef, useEffect } from 'react';
import { Send, Zap, Menu } from 'lucide-react';
import MessageBubble from './MessageBubble';
import LoadingIndicator from './LoadingIndicator';
import ErrorBanner from './ErrorBanner';

const ChatInterface = ({ chatHook, onToggleSidebar }) => {
  const { messages, sendMessage, isLoading, error, clearError } = chatHook;
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  };

  return (
    <div style={styles.container}>
      {/* Mobile Header */}
      <div style={styles.mobileHeader}>
        <button onClick={onToggleSidebar} style={styles.iconBtn}>
          <Menu size={20} color="var(--text-primary)" />
        </button>
        <span style={styles.mobileTitle}>SupaChat <Zap size={14} color="#f59e0b" fill="#f59e0b"/></span>
      </div>

      {/* Messages Area */}
      <div style={styles.messagesArea}>
        {messages.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon} className="glass-panel">
              <Zap size={32} color="#3b82f6" />
            </div>
            <h2 style={styles.emptyTitle}>Welcome to SupaChat</h2>
            <p style={styles.emptyText}>
              Ask questions about your blog analytics data in plain English. 
              I'll generate SQL, run it, and visualize the results for you.
            </p>
            <div style={styles.suggestionsContainer}>
              <span style={styles.suggestionsLabel}>Try asking:</span>
              <button style={styles.suggestionBadge} onClick={() => sendMessage("Show top trending topics in last 30 days")}>
                📈 Show top trending topics in last 30 days
              </button>
              <button style={styles.suggestionBadge} onClick={() => sendMessage("Compare article engagement by topic")}>
                📊 Compare article engagement by topic
              </button>
              <button style={styles.suggestionBadge} onClick={() => sendMessage("Plot daily views trend for AI articles")}>
                📉 Plot daily views trend for AI articles
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.messageList}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', marginBottom: '20px' }}>
                <LoadingIndicator />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Sticky Error Notice */}
      {error && (
        <div style={styles.errorWrapper}>
          <ErrorBanner message={error} onDismiss={clearError} />
        </div>
      )}

      {/* Input Area */}
      <div style={styles.inputArea} className="glass-panel">
        <form onSubmit={handleSubmit} style={styles.inputForm}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your analytics... (⌘ + Enter to send)"
            style={styles.inputField}
            disabled={isLoading}
            maxLength={500}
          />
          <button 
            type="submit" 
            style={{ 
              ...styles.sendBtn, 
              opacity: (!inputValue.trim() || isLoading) ? 0.5 : 1,
              cursor: (!inputValue.trim() || isLoading) ? 'not-allowed' : 'pointer'
            }}
            disabled={!inputValue.trim() || isLoading}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  mobileHeader: {
    display: 'none', // Handled by media queries in pure CSS usually, simulated here
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    padding: '8px',
    cursor: 'pointer',
  },
  mobileTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    letterSpacing: '-0.02em',
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px 40px',
    display: 'flex',
    flexDirection: 'column',
  },
  emptyState: {
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '600px',
    textAlign: 'center',
  },
  emptyIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  emptyTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '12px',
    letterSpacing: '-0.02em',
  },
  emptyText: {
    fontSize: '1.05rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    marginBottom: '40px',
  },
  suggestionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
    alignItems: 'center',
  },
  suggestionsLabel: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '8px',
  },
  suggestionBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-subtle)',
    padding: '12px 20px',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    cursor: 'pointer',
    width: '100%',
    maxWidth: '480px',
    textAlign: 'left',
    transition: 'all 0.2s ease',
  },
  messageList: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '900px',
    margin: '0 auto',
    width: '100%',
  },
  errorWrapper: {
    position: 'absolute',
    bottom: '90px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 20,
    width: '90%',
    maxWidth: '600px',
  },
  inputArea: {
    padding: '20px 40px',
    borderTop: '1px solid var(--border-subtle)',
    position: 'sticky',
    bottom: 0,
    zIndex: 10,
  },
  inputForm: {
    display: 'flex',
    alignItems: 'center',
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: '#000000',
    border: '1px solid var(--border-subtle)',
    borderRadius: '24px',
    padding: '6px 6px 6px 20px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  },
  inputField: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    outline: 'none',
  },
  sendBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: 'var(--accent-blue)',
    color: '#ffffff',
    transition: 'background-color 0.2s ease',
  }
};

export default ChatInterface;
