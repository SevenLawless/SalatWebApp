// Helper functions for localStorage operations

const USERS_KEY = 'salatChecker_users';
const PRAYER_RECORDS_KEY = 'salatChecker_prayerRecords';
const CURRENT_USER_KEY = 'salatChecker_currentUser';

// User Management
export const addUser = (username, phoneNumber) => {
  const users = getUsers();
  
  // Check if phone number already exists
  if (users.some(user => user.phoneNumber === phoneNumber)) {
    throw new Error('Phone number already registered');
  }
  
  const newUser = {
    username,
    phoneNumber,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return newUser;
};

export const getUserByPhone = (phoneNumber) => {
  const users = getUsers();
  return users.find(user => user.phoneNumber === phoneNumber);
};

export const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const setCurrentUser = (phoneNumber) => {
  localStorage.setItem(CURRENT_USER_KEY, phoneNumber);
};

export const getCurrentUser = () => {
  const phoneNumber = localStorage.getItem(CURRENT_USER_KEY);
  return phoneNumber ? getUserByPhone(phoneNumber) : null;
};

export const clearCurrentUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Prayer Records Management
export const savePrayerRecord = (date, phoneNumber, prayers) => {
  const records = getPrayerRecords();
  const recordIndex = records.findIndex(
    record => record.date === date && record.phoneNumber === phoneNumber
  );
  
  // Ensure all prayer states are valid strings
  const normalizePrayerState = (state) => {
    if (typeof state === 'boolean') {
      // Migrate old boolean data to new format
      return state ? 'prayed' : 'not_prayed';
    }
    if (state === 'prayed' || state === 'not_prayed' || state === 'missed') {
      return state;
    }
    return 'not_prayed'; // Default state
  };
  
  const newRecord = {
    date,
    phoneNumber,
    prayers: {
      fajr: normalizePrayerState(prayers.fajr),
      dhuhr: normalizePrayerState(prayers.dhuhr),
      asr: normalizePrayerState(prayers.asr),
      maghrib: normalizePrayerState(prayers.maghrib),
      isha: normalizePrayerState(prayers.isha)
    }
  };
  
  if (recordIndex >= 0) {
    records[recordIndex] = newRecord;
  } else {
    records.push(newRecord);
  }
  
  localStorage.setItem(PRAYER_RECORDS_KEY, JSON.stringify(records));
  return newRecord;
};

export const getPrayerRecord = (date, phoneNumber) => {
  const records = getPrayerRecords();
  return records.find(
    record => record.date === date && record.phoneNumber === phoneNumber
  );
};

export const getPrayerRecords = () => {
  const records = localStorage.getItem(PRAYER_RECORDS_KEY);
  return records ? JSON.parse(records) : [];
};

export const getPrayerRecordsByPhone = (phoneNumber) => {
  const records = getPrayerRecords();
  return records.filter(record => record.phoneNumber === phoneNumber);
};

export const getPrayerRecordsInRange = (phoneNumber, startDate, endDate) => {
  const records = getPrayerRecordsByPhone(phoneNumber);
  return records.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate >= startDate && recordDate <= endDate;
  });
};

// Statistics Calculations
export const calculateStatistics = (phoneNumber, startDate, endDate) => {
  const records = getPrayerRecordsInRange(phoneNumber, startDate, endDate);
  
  let totalPrayed = 0;
  let totalMissed = 0;
  let totalNotPrayed = 0;
  const dailyBreakdown = [];
  
  records.forEach(record => {
    const prayers = Object.values(record.prayers);
    
    // Count each state
    const prayedCount = prayers.filter(p => p === 'prayed' || (typeof p === 'boolean' && p)).length;
    const missedCount = prayers.filter(p => p === 'missed').length;
    const notPrayedCount = prayers.filter(p => p === 'not_prayed' || (typeof p === 'boolean' && !p)).length;
    
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

