import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/auth.js';
import { getStatistics } from '../services/api.js';
import { t } from '../utils/translations.js';
import '../styles/App.css';

const Statistics = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    if (!isAuthenticated()) {
      navigate('/signin');
      return;
    }

    // Set default to last month
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);

    const defaultStart = lastMonth.toISOString().split('T')[0];
    const defaultEnd = today.toISOString().split('T')[0];

    setStartDate(defaultStart);
    setEndDate(defaultEnd);

    // Load statistics
    loadStatistics(defaultStart, defaultEnd);
  }, [navigate]);

  const loadStatistics = async (start, end) => {
    if (!isAuthenticated()) return;

    setLoading(true);
    setError('');
    
    try {
      const statistics = await getStatistics(start, end);
      setStats(statistics);
    } catch (err) {
      console.error('Error loading statistics:', err);
      setError(err.message || t('statistics.error'));
      setStats({
        totalPrayed: 0,
        totalMissed: 0,
        totalNotPrayed: 0,
        totalDays: 0,
        completionPercentage: 0,
        dailyBreakdown: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = () => {
    if (startDate && endDate) {
      if (new Date(startDate) > new Date(endDate)) {
        alert('يجب أن يكون تاريخ البداية قبل تاريخ النهاية');
        return;
      }
      loadStatistics(startDate, endDate);
    }
  };

  const handleLastMonth = () => {
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);

    const start = lastMonth.toISOString().split('T')[0];
    const end = today.toISOString().split('T')[0];

    setStartDate(start);
    setEndDate(end);
    loadStatistics(start, end);
  };

  const handleLastWeek = () => {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    const start = lastWeek.toISOString().split('T')[0];
    const end = today.toISOString().split('T')[0];

    setStartDate(start);
    setEndDate(end);
    loadStatistics(start, end);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const arabicMonths = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    const arabicMonthsShort = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    
    const dayNumber = date.getDate();
    const month = arabicMonthsShort[date.getMonth()];
    const year = date.getFullYear();
    
    return `${dayNumber} ${month} ${year}`;
  };

  if (loading || !stats) {
    return (
      <div className="app">
        <div className="loading">{t('statistics.loading')}</div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="statistics-container">
        <div className="statistics-header">
          <h1>{t('statistics.title')}</h1>
          {error && <div className="error-message" style={{ marginBottom: '20px', textAlign: 'center' }}>{error}</div>}
          <div className="date-range-selector">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <button onClick={handleDateRangeChange}>{t('statistics.apply')}</button>
            <button onClick={handleLastWeek}>{t('statistics.lastWeek')}</button>
            <button onClick={handleLastMonth}>{t('statistics.lastMonth')}</button>
          </div>
        </div>

        <div className="stats-cards">
          <div className="stat-card total">
            <h3>{t('statistics.totalPrayers')}</h3>
            <div className="stat-value">{stats.totalPrayed + stats.totalMissed}</div>
            <div className="stat-label">{t('statistics.prayersCounted')}</div>
          </div>
          <div className="stat-card prayed">
            <h3>{t('statistics.totalPrayed')}</h3>
            <div className="stat-value">{stats.totalPrayed}</div>
            <div className="stat-label">{t('statistics.prayersCompleted')}</div>
          </div>
          <div className="stat-card missed">
            <h3>{t('statistics.totalMissed')}</h3>
            <div className="stat-value">{stats.totalMissed}</div>
            <div className="stat-label">{t('statistics.prayersMissed')}</div>
          </div>
          <div className="stat-card">
            <h3>{t('statistics.completionRate')}</h3>
            <div className="stat-value">{stats.completionPercentage}%</div>
            <div className="stat-label">{t('statistics.overallCompletion')}</div>
          </div>
          <div className="stat-card">
            <h3>{t('statistics.daysTracked')}</h3>
            <div className="stat-value">{stats.totalDays}</div>
            <div className="stat-label">{t('statistics.daysInPeriod')}</div>
          </div>
        </div>

        <div className="daily-breakdown">
          <h2>{t('statistics.dailyBreakdown')}</h2>
          {stats.dailyBreakdown.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
              {t('statistics.noRecords')}
            </p>
          ) : (
            <div className="breakdown-list">
              {stats.dailyBreakdown.map((day) => (
                <div key={day.date} className="breakdown-item">
                  <div className="breakdown-date">{formatDate(day.date)}</div>
                  <div className="breakdown-stats">
                    <div className="breakdown-stat prayed">
                      <span>✓</span>
                      <span>{day.prayed} {t('prayer.prayed')}</span>
                    </div>
                    <div className="breakdown-stat missed">
                      <span>✗</span>
                      <span>{day.missed} {t('prayer.missed')}</span>
                    </div>
                    {day.notPrayed > 0 && (
                      <div className="breakdown-stat not-prayed">
                        <span>○</span>
                        <span>{day.notPrayed} {t('prayer.notPrayed')}</span>
                      </div>
                    )}
                    <div className="completion-bar">
                      <div
                        className="completion-fill"
                        style={{ width: `${day.completion}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Statistics;

