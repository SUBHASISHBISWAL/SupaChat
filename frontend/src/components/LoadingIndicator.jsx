import React from 'react';

const LoadingIndicator = () => {
  return (
    <div style={styles.container}>
      <div style={{ ...styles.dot, animationDelay: '0s' }} className="loading-dot" />
      <div style={{ ...styles.dot, animationDelay: '0.2s' }} className="loading-dot" />
      <div style={{ ...styles.dot, animationDelay: '0.4s' }} className="loading-dot" />
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .loading-dot {
          animation: pulse 1.4s infinite ease-in-out both;
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '12px 16px',
    backgroundColor: 'var(--bg-glass)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '16px',
    borderBottomLeftRadius: '4px',
    width: 'fit-content'
  },
  dot: {
    width: '8px',
    height: '8px',
    backgroundColor: 'var(--text-secondary)',
    borderRadius: '50%',
  }
};

export default LoadingIndicator;
