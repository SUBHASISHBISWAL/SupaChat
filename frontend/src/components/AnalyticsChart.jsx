import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const AnalyticsChart = ({ data, config }) => {
  if (!data || data.length === 0 || !config || !config.chart_type) return null;

  const { chart_type, x_axis_key, y_axis_keys } = config;

  // Custom stylized tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={styles.tooltipBox}>
          <p style={styles.tooltipLabel}>{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color, margin: '4px 0', fontSize: '0.85rem' }}>
              {`${entry.name}: ${new Intl.NumberFormat('en-US').format(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    // Determine what exact keys to plot
    const yKeys = y_axis_keys || (data[0] ? Object.keys(data[0]).filter(k => k !== x_axis_key && typeof data[0][k] === 'number') : []);
    
    if (yKeys.length === 0) return <p style={{ color: 'var(--text-secondary)' }}>Invalid chart dimensions</p>;

    switch (chart_type) {
      case 'line_chart':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey={x_axis_key} stroke="var(--text-secondary)" tick={{fontSize: 12}} />
              <YAxis stroke="var(--text-secondary)" tick={{fontSize: 12}} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }}/>
              {yKeys.map((key, idx) => (
                <Line type="monotone" key={key} dataKey={key} stroke={COLORS[idx % COLORS.length]} activeDot={{ r: 8 }} strokeWidth={2} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'bar_chart':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey={x_axis_key} stroke="var(--text-secondary)" tick={{fontSize: 12}} />
              <YAxis stroke="var(--text-secondary)" tick={{fontSize: 12}} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }}/>
              {yKeys.map((key, idx) => (
                <Bar key={key} dataKey={key} fill={COLORS[idx % COLORS.length]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'area_chart':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey={x_axis_key} stroke="var(--text-secondary)" tick={{fontSize: 12}} />
              <YAxis stroke="var(--text-secondary)" tick={{fontSize: 12}} width={80}/>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }}/>
              {yKeys.map((key, idx) => (
                <Area type="monotone" key={key} dataKey={key} stroke={COLORS[idx % COLORS.length]} fill={COLORS[idx % COLORS.length]} fillOpacity={0.3} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie_chart':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }}/>
              <Pie
                data={data}
                dataKey={yKeys[0]}
                nameKey={x_axis_key}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );
        
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      {renderChart()}
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    marginTop: '16px',
    padding: '16px 0',
    backgroundColor: 'var(--bg-primary)',
    borderRadius: '8px',
    border: '1px solid var(--border-subtle)',
  },
  tooltipBox: {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    padding: '10px 14px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  tooltipLabel: {
    fontWeight: '600',
    marginBottom: '8px',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    borderBottom: '1px solid var(--border-subtle)',
    paddingBottom: '4px'
  }
};

export default AnalyticsChart;
