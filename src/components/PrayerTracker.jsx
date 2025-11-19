import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/auth.js';
import { getPrayerRecord, savePrayerRecord } from '../services/api.js';
import { fetchPrayerTimes } from '../utils/prayerTimes';
import { t } from '../utils/translations.js';
import PrayerCard from './PrayerCard';
import '../styles/App.css';

const PrayerTracker = () => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [prayers, setPrayers] = useState({
    fajr: 'not_prayed',
    dhuhr: 'not_prayed',
    asr: 'not_prayed',
    maghrib: 'not_prayed',
    isha: 'not_prayed'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    if (!isAuthenticated()) {
      navigate('/signin');
      return;
    }

    loadPrayerData();
  }, [navigate, selectedDate]);

  const loadPrayerData = async () => {
    setLoading(true);
    setError('');
    try {
      const date = new Date(selectedDate);
      
      // Fetch prayer times for selected date
      const times = await fetchPrayerTimes(date);
      setPrayerTimes(times);

      // Load prayer record for selected date from API
      try {
        const record = await getPrayerRecord(selectedDate);
        if (record && record.prayers) {
          setPrayers(record.prayers);
        } else {
          // Initialize with all not_prayed
          setPrayers({
            fajr: 'not_prayed',
            dhuhr: 'not_prayed',
            asr: 'not_prayed',
            maghrib: 'not_prayed',
            isha: 'not_prayed'
          });
        }
      } catch (apiError) {
        // If no record exists, use defaults
        setPrayers({
          fajr: 'not_prayed',
          dhuhr: 'not_prayed',
          asr: 'not_prayed',
          maghrib: 'not_prayed',
          isha: 'not_prayed'
        });
      }
    } catch (error) {
      console.error('Error loading prayer data:', error);
      setError(t('tracker.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleStateChange = async (prayerName, newState) => {
    if (!isAuthenticated()) return;

    const previousPrayers = { ...prayers };
    const newPrayers = {
      ...prayers,
      [prayerName]: newState
    };

    // Optimistically update UI
    setPrayers(newPrayers);
    setError(''); // Clear any previous errors

    // Save to API
    try {
      await savePrayerRecord(selectedDate, newPrayers);
    } catch (error) {
      console.error('Error saving prayer record:', error);
      setError(t('tracker.saveError'));
      // Revert on error
      setPrayers(previousPrayers);
    }
  };

  const handleDateChange = (dateString) => {
    setSelectedDate(dateString);
  };

  const goToToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  };

  const goToPreviousDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const goToNextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const arabicMonths = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    const arabicDays = [
      'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'
    ];
    
    const day = arabicDays[date.getDay()];
    const dayNumber = date.getDate();
    const month = arabicMonths[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day}، ${dayNumber} ${month} ${year}`;
  };

  const isToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return selectedDate === today;
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">{t('tracker.loading')}</div>
      </div>
    );
  }

  if (!prayerTimes) {
    return (
      <div className="app">
        <div className="loading">{t('tracker.error')}</div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="prayer-tracker-container">
        <div className="tracker-header">
          <h1>{t('tracker.title')}</h1>
          {error && <div className="error-message" style={{ marginBottom: '20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto 20px' }}>{error}</div>}
          <div className="date-navigation">
            <div className="date-display">
              <div className="date">{formatDate(selectedDate)}</div>
              {!isToday() && <span className="date-indicator">{t('tracker.viewingPastDate')}</span>}
            </div>
            <div className="date-controls">
              <button className="nav-button" onClick={goToNextDay} title={t('tracker.nextDay')}>
                →
              </button>
              <input
                type="date"
                className="date-picker"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
              />
              <button className="nav-button" onClick={goToPreviousDay} title={t('tracker.previousDay')}>
                ←
              </button>
              {!isToday() && (
                <button className="today-button" onClick={goToToday}>
                  {t('tracker.today')}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="prayers-grid">
          <PrayerCard
            prayerName="fajr"
            prayerTime={prayerTimes.fajr}
            prayerState={prayers.fajr}
            onStateChange={(state) => handleStateChange('fajr', state)}
          />
          <PrayerCard
            prayerName="dhuhr"
            prayerTime={prayerTimes.dhuhr}
            prayerState={prayers.dhuhr}
            onStateChange={(state) => handleStateChange('dhuhr', state)}
          />
          <PrayerCard
            prayerName="asr"
            prayerTime={prayerTimes.asr}
            prayerState={prayers.asr}
            onStateChange={(state) => handleStateChange('asr', state)}
          />
          <PrayerCard
            prayerName="maghrib"
            prayerTime={prayerTimes.maghrib}
            prayerState={prayers.maghrib}
            onStateChange={(state) => handleStateChange('maghrib', state)}
          />
          <PrayerCard
            prayerName="isha"
            prayerTime={prayerTimes.isha}
            prayerState={prayers.isha}
            onStateChange={(state) => handleStateChange('isha', state)}
          />
        </div>
      </div>
    </div>
  );
};

export default PrayerTracker;

