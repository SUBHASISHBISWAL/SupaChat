import React from 'react';

const ResultsTable = ({ data }) => {
  if (!data || data.length === 0) return null;

  const isObject = (val) => val !== null && typeof val === 'object';
  
  const headers = Object.keys(data[0]);

  const formatHeader = (key) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatCell = (val) => {
    if (typeof val === 'number') {
      return new Intl.NumberFormat('en-US').format(val);
    }
    if (isObject(val)) {
      return JSON.stringify(val);
    }
    return String(val);
  };

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} style={styles.th}>
                {formatHeader(header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} style={idx % 2 === 0 ? styles.evenRow : styles.oddRow}>
              {headers.map((header) => (
                <td key={header} style={styles.td}>
                  {formatCell(row[header])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    overflowX: 'auto',
    maxHeight: '300px',
    overflowY: 'auto',
    borderRadius: '8px',
    border: '1px solid var(--border-subtle)',
    backgroundColor: 'var(--bg-primary)',
    marginTop: '16px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '0.85rem',
  },
  th: {
    backgroundColor: 'var(--bg-surface)',
    padding: '12px 16px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    borderBottom: '1px solid var(--border-subtle)',
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
  td: {
    padding: '10px 16px',
    borderBottom: '1px solid var(--border-subtle)',
    color: 'var(--text-primary)',
  },
  evenRow: {
    backgroundColor: 'transparent',
  },
  oddRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  }
};

export default ResultsTable;
