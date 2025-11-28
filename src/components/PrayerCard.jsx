import { t } from '../utils/translations.js';
import '../styles/App.css';

const PrayerCard = ({ prayerName, prayerTime, prayerState, onStateChange }) => {
  const prayerNames = {
    fajr: t('prayer.fajr'),
    dhuhr: t('prayer.dhuhr'),
    asr: t('prayer.asr'),
    maghrib: t('prayer.maghrib'),
    isha: t('prayer.isha')
  };
  
  const stateLabels = {
    not_prayed: t('prayer.notPrayed'),
    prayed: t('prayer.prayed'),
    missed: t('prayer.missed')
  };

  // Normalize state (handle old boolean data)
  const normalizedState = typeof prayerState === 'boolean' 
    ? (prayerState ? 'prayed' : 'not_prayed')
    : (prayerState || 'not_prayed');

  const handlePrayedClick = () => {
    onStateChange('prayed');
  };

  const handleMissedClick = () => {
    onStateChange('missed');
  };

  return (
    <div className={`prayer-card prayer-card-${normalizedState}`}>
      <div className="prayer-info">
        <div className="prayer-name">{prayerNames[prayerName] || prayerName}</div>
        <div className="prayer-time">{prayerTime}</div>
      </div>
      <div className="prayer-buttons-container">
        <button
          className={`prayer-action-button prayer-action-prayed ${normalizedState === 'prayed' ? 'active' : ''}`}
          onClick={handlePrayedClick}
          aria-label={`Mark ${prayerNames[prayerName]} as prayed`}
          title={stateLabels.prayed}
        >
          <span className="action-icon">✓</span>
        </button>
        <button
          className={`prayer-action-button prayer-action-missed ${normalizedState === 'missed' ? 'active' : ''}`}
          onClick={handleMissedClick}
          aria-label={`Mark ${prayerNames[prayerName]} as missed`}
          title={stateLabels.missed}
        >
          <span className="action-icon">✗</span>
        </button>
      </div>
    </div>
  );
};

export default PrayerCard;

