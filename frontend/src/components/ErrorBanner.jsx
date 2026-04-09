import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorBanner = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div style={styles.banner}>
      <div style={styles.content}>
        <AlertCircle size={20} color="#ef4444" />
        <span style={styles.text}>{message}</span>
      </div>
      <button onClick={onDismiss} style={styles.closeBtn} title="Dismiss">
        <X size={18} color="#f87171" />
      </button>
    </div>
  );
};

const styles = {
  banner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    padding: '12px 16px',
    margin: '16px 0',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  text: {
    color: '#fca5a5',
    fontSize: '0.95rem',
    fontWeight: '500',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
    borderRadius: '4px',
  }
};

export default ErrorBanner;
