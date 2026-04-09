import React from 'react';
import { Clock, MessageSquare, Trash2, Menu } from 'lucide-react';

const QueryHistory = ({ historyHook, isMobileOpen, toggleMobile }) => {
  const { entries, selectEntry, clearHistory, isLoading } = historyHook;

  // Simple heuristic for relative time
  const getRelativeTime = (isoString) => {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const diff = new Date(isoString).getTime() - new Date().getTime();
    const minDiff = Math.round(diff / 60000);
    
    if (minDiff > -60) return rtf.format(minDiff, 'minute');
    const hrDiff = Math.round(minDiff / 60);
    if (hrDiff > -24) return rtf.format(hrDiff, 'hour');
    return rtf.format(Math.round(hrDiff / 24), 'day');
  };

  return (
    <div style={{ ...styles.sidebar, left: isMobileOpen ? 0 : undefined }} className="sidebar glass-panel">
      <div style={styles.header}>
        <h2 style={styles.title}>
          <Clock size={16} />
          <span>Query History</span>
        </h2>
        {/* Mobile close button would go here normally, kept simple for now */}
      </div>

      <div style={styles.list}>
        {isLoading ? (
          <p style={styles.emptyText}>Loading history...</p>
        ) : entries.length === 0 ? (
          <p style={styles.emptyText}>No queries yet. Start asking!</p>
        ) : (
          entries.map((entry) => (
            <button 
              key={entry.id} 
              style={styles.itemBtn} 
              onClick={() => selectEntry(entry)}
              title={entry.original_message}
            >
              <MessageSquare size={14} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
              <div style={styles.itemContent}>
                <span style={styles.itemText}>{entry.original_message}</span>
                <span style={styles.itemTime}>{getRelativeTime(entry.created_at)}</span>
              </div>
            </button>
          ))
        )}
      </div>

      {entries.length > 0 && (
        <div style={styles.footer}>
          <button style={styles.clearBtn} onClick={clearHistory}>
            <Trash2 size={14} />
            <span>Clear History</span>
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  sidebar: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--bg-surface)',
    borderRight: '1px solid var(--border-subtle)',
    zIndex: 10,
  },
  header: {
    padding: '20px',
    borderBottom: '1px solid var(--border-subtle)',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  list: {
    flex: 1,
    overflowY: 'auto',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  emptyText: {
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    textAlign: 'center',
    marginTop: '20px',
  },
  itemBtn: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '12px',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background-color 0.15s ease',
  },
  itemContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    overflow: 'hidden',
  },
  itemText: {
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: '1.2',
  },
  itemTime: {
    color: 'var(--text-secondary)',
    fontSize: '0.7rem',
  },
  footer: {
    padding: '12px 20px',
    borderTop: '1px solid var(--border-subtle)',
  },
  clearBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px',
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#f87171',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  }
};

export default QueryHistory;
