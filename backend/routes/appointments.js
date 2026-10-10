const express = require('express');
const Appointment = require('../models/Appointment');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

// Book an appointment (patient only)
router.post('/', protect, requireRole('patient'), async (req, res) => {
  try {
    const { doctor, mode, symptoms, predictedSpecialization, urgency, slot } = req.body;

    const videoRoom =
      mode === 'video' ? `telemed-${req.user.id}-${Date.now()}` : undefined;

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor,
      mode,
      symptoms,
      predictedSpecialization,
      urgency,
      slot,
      videoRoom,
      status: 'confirmed',
    });

    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get appointments for logged in user (patient sees their own, doctor sees theirs)
router.get('/', protect, async (req, res) => {
  try {
    const filter =
      req.user.role === 'doctor' ? { doctor: req.user.id } : { patient: req.user.id };

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization address location fee')
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single appointment
router.get('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization address location fee');
    if (!appointment) return res.status(404).json({ message: 'Not found' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update status (doctor marks completed, either party can cancel)
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
