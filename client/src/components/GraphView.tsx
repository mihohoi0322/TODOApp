import { useState, useEffect } from 'react';
import { fetchLast7DaysStats, DailyStats } from '../utils/api';

interface GraphViewProps {}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const weekday = weekdays[date.getDay()];
  return `${month}/${day}(${weekday})`;
}

export function GraphView(_props: GraphViewProps) {
  const [stats, setStats] = useState<DailyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchLast7DaysStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '統計の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Calculate max value for scaling
  const maxCompleted = Math.max(...stats.map((s) => s.completed), 1);

  return (
    <div className="graph-view">
      <div className="graph-header">
        <h2>📊 過去7日間の完了記録</h2>
        <p className="graph-subtitle">日ごとの完了タスク数を表示しています</p>
      </div>

      <div className="graph-container">
        <div className="graph-bars">
          {stats.map((stat) => {
            const heightPercent = (stat.completed / maxCompleted) * 100;
            return (
              <div key={stat.date} className="graph-bar-wrapper">
                <div className="graph-bar-container">
                  <div
                    className="graph-bar"
                    style={{ height: `${Math.max(heightPercent, 5)}%` }}
                    title={`${stat.completed}件完了`}
                  >
                    <span className="graph-bar-label">{stat.completed}</span>
                  </div>
                </div>
                <div className="graph-bar-date">{formatDate(stat.date)}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="graph-summary">
        <div className="summary-item">
          <span className="summary-label">7日間の合計完了数</span>
          <span className="summary-value">
            {stats.reduce((sum, s) => sum + s.completed, 0)} 件
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">1日平均完了数</span>
          <span className="summary-value">
            {(stats.reduce((sum, s) => sum + s.completed, 0) / 7).toFixed(1)} 件
          </span>
        </div>
      </div>
    </div>
  );
}
