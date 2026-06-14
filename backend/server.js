const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow all origins for Expo testing
app.use(express.json());

// Routes
const authRouter = require('./routes/auth');
const appointmentsRouter = require('./routes/appointments');
const patientsRouter = require('./routes/patients');
const testimonialsRouter = require('./routes/testimonials');

app.use('/api/auth', authRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/patients', patientsRouter);
app.use('/api/testimonials', testimonialsRouter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Dental Clinic API is running.' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
