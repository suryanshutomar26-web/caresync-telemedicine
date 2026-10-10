const express = require('express');
const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

// Doctor creates a prescription after a consultation
router.post('/', protect, requireRole('doctor'), async (req, res) => {
  try {
    const { appointment, patient, notes, medicines } = req.body;

    const prescription = await Prescription.create({
      appointment,
      patient,
      doctor: req.user.id,
      notes,
      medicines,
    });

    await Appointment.findByIdAndUpdate(appointment, { status: 'completed' });

    res.status(201).json(prescription);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Patient views their prescriptions
router.get('/', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'doctor' ? { doctor: req.user.id } : { patient: req.user.id };
    const prescriptions = await Prescription.find(filter)
      .populate('doctor', 'name specialization')
      .populate('appointment', 'mode createdAt')
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id).populate(
      'doctor',
      'name specialization'
    );
    if (!prescription) return res.status(404).json({ message: 'Not found' });
    res.json(prescription);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
