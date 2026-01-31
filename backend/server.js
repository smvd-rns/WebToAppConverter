require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.REPO_OWNER; // e.g. 'username'
const REPO_NAME = process.env.REPO_NAME;   // e.g. 'repo-name'

const GITHUB_API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

// Helper to set headers
const getHeaders = () => ({
    'Authorization': `Bearer ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'X-GitHub-Api-Version': '2022-11-28'
});

// Endpoint: Trigger a new build
app.post('/api/build', async (req, res) => {
    try {
        const { appName, appUrl, iconUrl, appId } = req.body;

        if (!appName || !appUrl || !iconUrl) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        console.log(`[BUILD START] ${appName} (${appUrl})`);

        // Trigger 'workflow_dispatch' event
        await axios.post(
            `${GITHUB_API_BASE}/actions/workflows/build-app.yml/dispatches`,
            {
                ref: 'main', // Branch to use
                inputs: {
                    app_name: appName,
                    app_url: appUrl,
                    icon_url: iconUrl,
                    app_id: appId || 'com.myapp.web'
                }
            },
            { headers: getHeaders() }
        );

        res.json({ success: true, message: 'Build started! GitHub is working.' });

    } catch (error) {
        console.error('Build Error:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Failed to start build', 
            details: error.response?.data 
        });
    }
});

// Endpoint: Check for latest release
app.get('/api/status', async (req, res) => {
    try {
        const response = await axios.get(`${GITHUB_API_BASE}/releases`, { headers: getHeaders() });
        const latestInfo = response.data[0]; // First item is latest

        if (!latestInfo) {
            return res.json({ status: 'waiting', message: 'No releases found yet.' });
        }

        // Check if this release was created recently (e.g., in last 15 mins)
        // Ideally we would track the workflow run ID, but checking time is a simple approximation
        const createdAt = new Date(latestInfo.created_at).getTime();
        const now = new Date().getTime();
        const diffMinutes = (now - createdAt) / 1000 / 60;

        // Extract assets
        const androidApk = latestInfo.assets.find(a => a.name.endsWith('.apk'))?.browser_download_url;
        const androidAab = latestInfo.assets.find(a => a.name.endsWith('.aab'))?.browser_download_url;
        const windowsExe = latestInfo.assets.find(a => a.name.endsWith('.exe'))?.browser_download_url;

        res.json({
            status: 'success',
            releaseName: latestInfo.name, // e.g., "App Build - My Shop"
            ageMinutes: Math.round(diffMinutes),
            downloads: {
                apk: androidApk,
                aab: androidAab,
                exe: windowsExe
            }
        });

    } catch (error) {
        console.error('Status Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to check status' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
