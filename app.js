import https from 'https';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from a .env file

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// API Forwarder Endpoint
app.get('/api/*', (req, res) => {
    const apiKey = process.env.POLYGON_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    // Get the full path (captures everything after '/api/')
    const path = req.params[0]; // Use req.params[0] to get the dynamic part after '/api/'
    const query = req.query; // Get query parameters

    // Construct query string, adding the API key
    const queryString = new URLSearchParams({ ...query, apiKey }).toString();

    // Define the options for the Polygon API request
    const options = {
        hostname: 'api.polygon.io',
        port: 443,
        path: `/${path}?${queryString}`,
        method: 'GET',
    };

    // Make the request to the Polygon API
    const request = https.request(options, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            res.status(response.statusCode).send(data);
        });
    });

    request.on('error', (e) => {
        res.status(500).json({ error: e.message });
    });

    request.end();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

