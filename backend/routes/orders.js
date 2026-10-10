const express = require('express');
const Order = require('../models/Order');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

// Place an order (patient checks out their cart / selected prescription items)
router.post('/', protect, requireRole('patient'), async (req, res) => {
  try {
    const { items, deliveryAddress } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );

    const order = await Order.create({
      patient: req.user.id,
      items,
      totalAmount,
      deliveryAddress,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get orders for logged-in patient (or all, for admin)
router.get('/', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { patient: req.user.id };
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin/pharmacy updates order status
router.put('/:id/status', protect, requireRole('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
