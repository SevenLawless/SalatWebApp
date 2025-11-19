// Prayer times utility functions using Aladhan API

const PRAYER_TIMES_CACHE_KEY = 'salatChecker_prayerTimesCache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Get user's location or use default
export const getUserLocation = () => {
  return new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        () => {
          // Default to Makkah if geolocation fails
          resolve({
            latitude: 21.4225,
            longitude: 39.8262,
            city: 'Makkah',
            country: 'Saudi Arabia'
          });
        }
      );
    } else {
      // Default to Makkah if geolocation not available
      resolve({
        latitude: 21.4225,
        longitude: 39.8262,
        city: 'Makkah',
        country: 'Saudi Arabia'
      });
    }
  });
};

// Fetch prayer times from Aladhan API
export const fetchPrayerTimes = async (date = new Date()) => {
  const dateStr = date.toISOString().split('T')[0];
  
  // Check cache first
  const cached = getCachedPrayerTimes(dateStr);
  if (cached) {
    return cached;
  }
  
  try {
    const location = await getUserLocation();
    
    // Use coordinates if available, otherwise use city
    let apiUrl;
    if (location.latitude && location.longitude) {
      apiUrl = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${location.latitude}&longitude=${location.longitude}&method=2`;
    } else {
      // Fallback to city-based lookup
      const city = location.city || 'Makkah';
      apiUrl = `https://api.aladhan.com/v1/timings/${dateStr}?city=${city}&country=${location.country || 'Saudi Arabia'}&method=2`;
    }
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (data.code === 200 && data.data) {
      const timings = data.data.timings;
      const prayerTimes = {
        date: dateStr,
        fajr: timings.Fajr,
        dhuhr: timings.Dhuhr,
        asr: timings.Asr,
        maghrib: timings.Maghrib,
        isha: timings.Isha
      };
      
      // Cache the result
      cachePrayerTimes(dateStr, prayerTimes);
      
      return prayerTimes;
    } else {
      throw new Error('Failed to fetch prayer times');
    }
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    // Return default times as fallback
    return {
      date: dateStr,
      fajr: '05:00',
      dhuhr: '12:00',
      asr: '15:30',
      maghrib: '18:00',
      isha: '19:30'
    };
  }
};

// Cache management
const getCachedPrayerTimes = (dateStr) => {
  try {
    const cache = localStorage.getItem(PRAYER_TIMES_CACHE_KEY);
    if (!cache) return null;
    
    const cachedData = JSON.parse(cache);
    const cached = cachedData[dateStr];
    
    if (cached && cached.timestamp) {
      const age = Date.now() - cached.timestamp;
      if (age < CACHE_DURATION) {
        return cached.times;
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
};

const cachePrayerTimes = (dateStr, prayerTimes) => {
  try {
    const cache = localStorage.getItem(PRAYER_TIMES_CACHE_KEY);
    const cachedData = cache ? JSON.parse(cache) : {};
    
    cachedData[dateStr] = {
      times: prayerTimes,
      timestamp: Date.now()
    };
    
    localStorage.setItem(PRAYER_TIMES_CACHE_KEY, JSON.stringify(cachedData));
  } catch (error) {
    console.error('Error caching prayer times:', error);
  }
};

