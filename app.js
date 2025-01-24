const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/weather', async (req, res) => {
    const { city } = req.query;

    if (!city) {
        return res.status(400).json({ error: 'City is required' });
    }

    try {
        // Fetch weather data from OpenWeatherMap API
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather`,
            {
                params: {
                    q: city,
                    appid: WEATHER_API_KEY,
                    units: 'metric', // Get temperature in Celsius
                },
            }
        );

        const data = response.data;
        res.json({
            city: data.name,
            temperature: data.main.temp,
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
        });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.status(404).json({ error: 'City not found' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
