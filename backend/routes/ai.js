const express = require('express');
const { analyzeSymptoms } = require('../utils/symptomMapper');
const User = require('../models/User');
const { getDistanceKm } = require('../utils/geo');

const router = express.Router();

// POST /api/ai/analyze-symptoms
// body: { symptoms: string, lat: number, lng: number, radiusKm?: number }
router.post('/analyze-symptoms', async (req, res) => {
  try {
    const { symptoms, lat, lng, radiusKm } = req.body;
    if (!symptoms || !symptoms.trim()) {
      return res.status(400).json({ message: 'Symptoms text is required' });
    }

    const analysis = analyzeSymptoms(symptoms);

    let matchedDoctors = await User.find({
      role: 'doctor',
      specialization: analysis.predictedSpecialization,
    })
      .select('-password')
      .lean();

    if (lat && lng) {
      const pLat = parseFloat(lat);
      const pLng = parseFloat(lng);
      const radius = radiusKm ? parseFloat(radiusKm) : 25;

      matchedDoctors = matchedDoctors
        .filter((d) => d.location && d.location.lat != null && d.location.lng != null)
        .map((d) => ({
          ...d,
          distanceKm: Number(
            getDistanceKm(pLat, pLng, d.location.lat, d.location.lng).toFixed(2)
          ),
        }))
        .filter((d) => d.distanceKm <= radius)
        .sort((a, b) => a.distanceKm - b.distanceKm);
    }

    // Fallback: if no doctors of predicted specialization nearby, show general physicians
    if (matchedDoctors.length === 0 && analysis.predictedSpecialization !== 'General Physician') {
      matchedDoctors = await User.find({ role: 'doctor', specialization: 'General Physician' })
        .select('-password')
        .lean();
    }

    res.json({
      analysis,
      matchedDoctors,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
