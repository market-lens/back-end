import https from 'https';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/*', (req, res) => {
    const apiKey = process.env.POLYGON_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    const path = req.params[0];
    const query = req.query;

    const queryString = new URLSearchParams({ ...query, apiKey }).toString();

    const options = {
        hostname: 'api.polygon.io',
        port: 443,
        path: `/${path}?${queryString}`,
        method: 'GET',
    };

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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

