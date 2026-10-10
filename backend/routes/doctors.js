const express = require('express');
const User = require('../models/User');
const { getDistanceKm } = require('../utils/geo');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all doctors, optionally filtered by specialization + location radius
router.get('/', async (req, res) => {
  try {
    const { specialization, lat, lng, radiusKm } = req.query;

    const query = { role: 'doctor' };
    if (specialization) query.specialization = specialization;

    let doctors = await User.find(query).select('-password').lean();

    if (lat && lng) {
      const pLat = parseFloat(lat);
      const pLng = parseFloat(lng);
      const radius = radiusKm ? parseFloat(radiusKm) : 25; // default 25 km

      doctors = doctors
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

    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single doctor
router.get('/:id', async (req, res) => {
  try {
    const doctor = await User.findOne({ _id: req.params.id, role: 'doctor' }).select('-password');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update doctor profile (self only)
router.put('/:id', protect, requireRole('doctor', 'admin'), async (req, res) => {
  try {
    if (req.user.role === 'doctor' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Cannot edit another doctor profile' });
    }
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select('-password');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
