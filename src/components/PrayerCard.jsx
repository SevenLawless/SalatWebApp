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

  const cycleState = () => {
    let nextState;
    if (normalizedState === 'not_prayed') {
      nextState = 'prayed';
    } else if (normalizedState === 'prayed') {
      nextState = 'missed';
    } else {
      nextState = 'not_prayed';
    }
    onStateChange(nextState);
  };

  const getStateIcon = () => {
    if (normalizedState === 'prayed') return '✓';
    if (normalizedState === 'missed') return '✗';
    return '○';
  };

  return (
    <div className={`prayer-card prayer-card-${normalizedState}`}>
      <div className="prayer-info">
        <div className="prayer-name">{prayerNames[prayerName] || prayerName}</div>
        <div className="prayer-time">{prayerTime}</div>
      </div>
      <button
        className={`prayer-state-button prayer-state-${normalizedState}`}
        onClick={cycleState}
        aria-label={`Mark ${prayerNames[prayerName]} as ${normalizedState}`}
        title={`انقر للتبديل: ${stateLabels[normalizedState]}`}
      >
        <span className="state-icon">{getStateIcon()}</span>
        <span className="state-label">
          {stateLabels[normalizedState]}
        </span>
      </button>
    </div>
  );
};

export default PrayerCard;

