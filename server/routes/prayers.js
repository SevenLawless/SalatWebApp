import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getPrayerRecord, savePrayerRecord, getPrayerRecordsInRange, calculateStatistics } from '../models/prayerRecord.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get prayer record for specific date
router.get('/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.id;
    
    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }
    
    const record = await getPrayerRecord(userId, date);
    
    if (!record) {
      // Return default state if no record exists
      return res.json({
        date,
        prayers: {
          fajr: 'not_prayed',
          dhuhr: 'not_prayed',
          asr: 'not_prayed',
          maghrib: 'not_prayed',
          isha: 'not_prayed'
        }
      });
    }
    
    res.json({
      date: record.date,
      prayers: {
        fajr: record.fajr,
        dhuhr: record.dhuhr,
        asr: record.asr,
        maghrib: record.maghrib,
        isha: record.isha
      }
    });
  } catch (error) {
    console.error('Get prayer record error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Save/update prayer record for date
router.post('/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const { prayers } = req.body;
    const userId = req.user.id;
    
    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }
    
    // Validate prayers object
    if (!prayers || typeof prayers !== 'object') {
      return res.status(400).json({ error: 'Prayers object is required' });
    }
    
    const validStates = ['not_prayed', 'prayed', 'missed'];
    const prayerNames = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    
    for (const prayerName of prayerNames) {
      if (!validStates.includes(prayers[prayerName])) {
        return res.status(400).json({ error: `Invalid state for ${prayerName}. Must be one of: ${validStates.join(', ')}` });
      }
    }
    
    const record = await savePrayerRecord(userId, date, {
      fajr: prayers.fajr || 'not_prayed',
      dhuhr: prayers.dhuhr || 'not_prayed',
      asr: prayers.asr || 'not_prayed',
      maghrib: prayers.maghrib || 'not_prayed',
      isha: prayers.isha || 'not_prayed'
    });
    
    res.json({
      date: record.date,
      prayers: {
        fajr: record.fajr,
        dhuhr: record.dhuhr,
        asr: record.asr,
        maghrib: record.maghrib,
        isha: record.isha
      }
    });
  } catch (error) {
    console.error('Save prayer record error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get statistics for date range
router.get('/statistics/range', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.id;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate query parameters are required' });
    }
    
    // Validate date formats
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }
    
    const records = await getPrayerRecordsInRange(userId, startDate, endDate);
    const statistics = calculateStatistics(records);
    
    res.json(statistics);
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

