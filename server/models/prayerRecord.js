import pool from '../config/database.js';

export const getPrayerRecord = async (userId, date) => {
  const [rows] = await pool.execute(
    'SELECT * FROM prayer_records WHERE userId = ? AND date = ?',
    [userId, date]
  );
  
  return rows.length > 0 ? rows[0] : null;
};

export const savePrayerRecord = async (userId, date, prayers) => {
  const { fajr, dhuhr, asr, maghrib, isha } = prayers;
  
  const [result] = await pool.execute(
    `INSERT INTO prayer_records (userId, date, fajr, dhuhr, asr, maghrib, isha)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
     fajr = VALUES(fajr),
     dhuhr = VALUES(dhuhr),
     asr = VALUES(asr),
     maghrib = VALUES(maghrib),
     isha = VALUES(isha),
     updatedAt = CURRENT_TIMESTAMP`,
    [userId, date, fajr, dhuhr, asr, maghrib, isha]
  );
  
  return await getPrayerRecord(userId, date);
};

export const getPrayerRecordsInRange = async (userId, startDate, endDate) => {
  const [rows] = await pool.execute(
    'SELECT * FROM prayer_records WHERE userId = ? AND date BETWEEN ? AND ? ORDER BY date DESC',
    [userId, startDate, endDate]
  );
  
  return rows;
};

export const calculateStatistics = (records) => {
  let totalPrayed = 0;
  let totalMissed = 0;
  let totalNotPrayed = 0;
  const dailyBreakdown = [];
  
  records.forEach(record => {
    const prayers = [record.fajr, record.dhuhr, record.asr, record.maghrib, record.isha];
    
    const prayedCount = prayers.filter(p => p === 'prayed').length;
    const missedCount = prayers.filter(p => p === 'missed').length;
    const notPrayedCount = prayers.filter(p => p === 'not_prayed').length;
    
    totalPrayed += prayedCount;
    totalMissed += missedCount;
    totalNotPrayed += notPrayedCount;
    
    dailyBreakdown.push({
      date: record.date,
      prayed: prayedCount,
      missed: missedCount,
      notPrayed: notPrayedCount,
      completion: (prayedCount / 5) * 100
    });
  });
  
  const totalDays = records.length;
  const totalPossible = totalDays * 5;
  const completionPercentage = totalPossible > 0 
    ? (totalPrayed / totalPossible) * 100 
    : 0;
  
  return {
    totalPrayed,
    totalMissed,
    totalNotPrayed,
    totalDays,
    completionPercentage: Math.round(completionPercentage * 100) / 100,
    dailyBreakdown: dailyBreakdown.sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    )
  };
};

