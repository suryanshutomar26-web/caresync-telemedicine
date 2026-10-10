const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
    phone: { type: String },

    // Doctor-only fields
    specialization: { type: String },
    fee: { type: Number },
    address: { type: String },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    availableSlots: [{ type: String }],

    // Patient-only fields
    lastKnownLocation: {
      lat: { type: Number },
      lng: { type: Number },
    },
    cart: [
      {
        name: String,
        dosage: String,
        price: Number,
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
