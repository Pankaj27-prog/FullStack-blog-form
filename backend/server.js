const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/yourDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const inputSchema = new mongoose.Schema({
  value: String,
});

const Input = mongoose.model('Input', inputSchema);

// Get all inputs
app.get('/api/inputs', async (req, res) => {
  try {
    const inputs = await Input.find();
    res.json(inputs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching inputs' });
  }
});

// Add new input
app.post('/api/submit', async (req, res) => {
  try {
    const newInput = new Input({ value: req.body.value });
    await newInput.save();
    res.json(newInput);
  } catch (err) {
    res.status(500).json({ message: 'Error saving input' });
  }
});

// Update input by ID
app.put('/api/inputs/:id', async (req, res) => {
  try {
    const updatedInput = await Input.findByIdAndUpdate(
      req.params.id,
      { value: req.body.value },
      { new: true }
    );
    if (!updatedInput) return res.status(404).json({ message: 'Input not found' });
    res.json(updatedInput);
  } catch (err) {
    res.status(500).json({ message: 'Error updating input' });
  }
});

// Delete input by ID
app.delete('/api/inputs/:id', async (req, res) => {
  try {
    const deleted = await Input.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Input not found' });
    res.json({ message: 'Input deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting input' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
