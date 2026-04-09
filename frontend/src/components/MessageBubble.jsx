import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check, Copy } from 'lucide-react';
import ResultsTable from './ResultsTable';
import AnalyticsChart from './AnalyticsChart';

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';
  const [showSql, setShowSql] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (message.sql) {
      navigator.clipboard.writeText(message.sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ ...styles.wrapper, justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      <div style={{ ...styles.bubble, ...(isUser ? styles.userBubble : styles.botBubble) }} className="glass-panel">
        
        {/* Main textual content */}
        <p style={{ ...styles.text, color: isUser ? '#ffffff' : 'var(--text-primary)' }}>
          {message.content}
        </p>

        {/* Bot-specific extensions */}
        {!isUser && message.sql && (
          <div style={styles.botExtensions}>
            
            {/* Toggleable SQL Code Block */}
            <div style={styles.sqlContainer}>
              <button onClick={() => setShowSql(!showSql)} style={styles.sqlToggle}>
                {showSql ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                <span>View SQL</span>
              </button>
              
              {showSql && (
                <div style={styles.sqlBlockWrapper}>
                  <pre style={styles.sqlBlock}><code>{message.sql}</code></pre>
                  <button onClick={copyToClipboard} style={styles.copyBtn} title="Copy SQL">
                    {copied ? <Check size={14} color="var(--accent-emerald)"/> : <Copy size={14} color="var(--text-secondary)"/>}
                  </button>
                </div>
              )}
            </div>

            {/* Dynamic Visualizations */}
            {message.chartConfig && message.chartConfig.chart_type === 'table' ? (
              <ResultsTable data={message.data} />
            ) : message.chartConfig && message.chartConfig.chart_type !== 'text' ? (
              <AnalyticsChart data={message.data} config={message.chartConfig} />
            ) : null}
            
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    width: '100%',
    marginBottom: '20px',
    animation: 'fadeIn 0.3s ease-out forwards',
  },
  bubble: {
    maxWidth: '85%',
    padding: '16px 20px',
    borderRadius: '16px',
    position: 'relative',
  },
  userBubble: {
    backgroundColor: 'var(--accent-blue)',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    borderBottomRightRadius: '4px',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
    border: 'none',
  },
  botBubble: {
    borderBottomLeftRadius: '4px',
  },
  text: {
    fontSize: '0.95rem',
    lineHeight: '1.5',
    margin: 0,
    whiteSpace: 'pre-wrap',
  },
  botExtensions: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid var(--border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sqlContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  sqlToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'none',
    border: 'none',
    color: 'var(--accent-blue)',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500',
    padding: '4px 0',
    width: 'fit-content',
  },
  sqlBlockWrapper: {
    position: 'relative',
    marginTop: '8px',
  },
  sqlBlock: {
    margin: 0,
    backgroundColor: '#000000',
    padding: '12px 14px',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontFamily: 'monospace',
    color: '#e2e8f0',
    overflowX: 'auto',
    border: '1px solid var(--border-subtle)',
  },
  copyBtn: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    borderRadius: '4px',
    padding: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
};

export default MessageBubble;
