import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';
import { analyzeThreatIntelligence } from './services/threatIntel.js';
import { getNetworkInfo } from './services/networkTools.js';
import { getPortInfo } from './services/portScanning.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Cache with 10 minute TTL
const cache = new NodeCache({ stdTTL: 600 });

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Threat Intelligence endpoint
app.get('/api/threat-intel/:ip', async (req, res) => {
    try {
        const { ip } = req.params;

        // Check cache first
        const cacheKey = `threat-${ip}`;
        const cached = cache.get(cacheKey);
        if (cached) {
            return res.json({ ...cached, cached: true });
        }

        const data = await analyzeThreatIntelligence(ip);
        cache.set(cacheKey, data);

        res.json({ ...data, cached: false });
    } catch (error: any) {
        console.error('Threat Intel Error:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch threat intelligence' });
    }
});

// Network tools endpoint
app.get('/api/network/:ip', async (req, res) => {
    try {
        const { ip } = req.params;

        const cacheKey = `network-${ip}`;
        const cached = cache.get(cacheKey);
        if (cached) {
            return res.json({ ...cached, cached: true });
        }

        const data = await getNetworkInfo(ip);
        cache.set(cacheKey, data);

        res.json({ ...data, cached: false });
    } catch (error: any) {
        console.error('Network Info Error:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch network information' });
    }
});

// Port scanning endpoint
app.get('/api/ports/:ip', async (req, res) => {
    try {
        const { ip } = req.params;

        const cacheKey = `ports-${ip}`;
        const cached = cache.get(cacheKey);
        if (cached) {
            return res.json({ ...cached, cached: true });
        }

        const data = await getPortInfo(ip);
        cache.set(cacheKey, data);

        res.json({ ...data, cached: false });
    } catch (error: any) {
        console.error('Port Info Error:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch port information' });
    }
});

// Combined endpoint for all data
app.get('/api/analyze/:ip', async (req, res) => {
    try {
        const { ip } = req.params;

        const cacheKey = `full-${ip}`;
        const cached = cache.get(cacheKey);
        if (cached) {
            return res.json({ ...cached, cached: true });
        }

        // Fetch all data in parallel
        const [threatData, networkData, portData] = await Promise.allSettled([
            analyzeThreatIntelligence(ip),
            getNetworkInfo(ip),
            getPortInfo(ip)
        ]);

        const result = {
            threatIntel: threatData.status === 'fulfilled' ? threatData.value : null,
            network: networkData.status === 'fulfilled' ? networkData.value : null,
            ports: portData.status === 'fulfilled' ? portData.value : null,
        };

        cache.set(cacheKey, result);

        res.json({ ...result, cached: false });
    } catch (error: any) {
        console.error('Analysis Error:', error);
        res.status(500).json({ error: error.message || 'Failed to analyze IP' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api/`);

    // Check for API keys
    const hasKeys = {
        abuseipdb: !!process.env.ABUSEIPDB_API_KEY,
        virustotal: !!process.env.VIRUSTOTAL_API_KEY,
        ipqualityscore: !!process.env.IPQUALITYSCORE_API_KEY,
        alienvault: !!process.env.ALIENVALUT_OTX_API_KEY,
        shodan: !!process.env.SHODAN_API_KEY,
    };

    console.log('🔑 API Keys configured:', hasKeys);
});
