const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mode: { type: String, enum: ['video', 'in-person'], required: true },
    symptoms: { type: String, required: true },
    predictedSpecialization: { type: String },
    urgency: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    slot: { type: String },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    videoRoom: { type: String }, // room name for Jitsi
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
