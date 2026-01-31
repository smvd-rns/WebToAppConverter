"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Globe, Smartphone, Package, Loader2 } from 'lucide-react';
import axios from 'axios';

// NOTE: When deploying to Vercel, change this to your Render Backend URL
// For local dev, we assume backend is on port 3001
const API_BASE = "http://localhost:3001/api";

export default function Home() {
    const [formData, setFormData] = useState({
        appName: '',
        appUrl: '',
        iconUrl: ''
    });
    const [status, setStatus] = useState('idle'); // idle, building, success, error
    const [buildInfo, setBuildInfo] = useState(null);
    const [logs, setLogs] = useState([]);

    // Mock log simulation for effect
    const addLog = (msg) => setLogs(prev => [...prev, msg]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('building');
        setLogs([]);
        addLog("🚀 Initializing build engine...");

        try {
            await axios.post(`${API_BASE}/build`, formData);
            addLog("✅ Configuration sent to GitHub Actions.");
            addLog("⏳ Waiting for build to start...");
        } catch (err) {
            console.error(err);
            setStatus('error');
            addLog("❌ Error: Failed to contact backend.");
        }
    };

    // Poll for status
    useEffect(() => {
        let interval;
        if (status === 'building') {
            interval = setInterval(async () => {
                try {
                    const res = await axios.get(`${API_BASE}/status`);
                    if (res.data.status === 'success' && res.data.ageMinutes < 20) {
                        // Found a fresh build!
                        setBuildInfo(res.data);
                        setStatus('success');
                        addLog("🎉 Build Completed! preparing downloads...");
                        clearInterval(interval);
                    } else {
                        // Still waiting
                        if (Math.random() > 0.7) addLog("⚙️ Compiling assets...");
                    }
                } catch (err) {
                    // ignore network blips
                }
            }, 5000); // Check every 5s
        }
        return () => clearInterval(interval);
    }, [status]);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 relative overflow-hidden">

            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

            <div className="z-10 w-full max-w-lg">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                        WebToApp
                    </h1>
                    <p className="text-gray-300">Turn any website into a native APK & EXE in minutes.</p>
                </div>

                {/* Dynamic Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-8 rounded-2xl"
                >
                    {status === 'idle' && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">App Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="My Awesome App"
                                    onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Website URL</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                                    <input
                                        type="url"
                                        required
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 pl-10 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="https://mysite.com"
                                        onChange={(e) => setFormData({ ...formData, appUrl: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Icon URL (PNG)</label>
                                <input
                                    type="url"
                                    required
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="https://mysite.com/logo.png"
                                    onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25"
                            >
                                Generate App
                            </button>
                        </form>
                    )}

                    {status === 'building' && (
                        <div className="text-center py-10">
                            <Loader2 className="h-16 w-16 text-blue-500 animate-spin mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-white mb-2">Building your App...</h3>
                            <p className="text-gray-400 mb-6">This usually takes about 5-8 minutes.</p>

                            <div className="bg-slate-900/50 rounded-lg p-4 h-32 overflow-y-auto text-left text-sm font-mono text-green-400 border border-slate-800">
                                {logs.map((log, i) => (
                                    <div key={i} className="mb-1">{log}</div>
                                ))}
                                <div className="animate-pulse">_</div>
                            </div>
                        </div>
                    )}

                    {status === 'success' && buildInfo && (
                        <div className="text-center">
                            <div className="mb-6 flex justify-center">
                                <div className="bg-green-500/20 p-4 rounded-full">
                                    <Package className="h-12 w-12 text-green-400" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">Ready to Download!</h2>
                            <p className="text-gray-400 mb-8">Your app "{buildInfo.releaseName}" is baked fresh.</p>

                            <div className="grid gap-4">
                                <a href={buildInfo.downloads.apk} target="_blank" className="flex items-center justify-between bg-slate-800 hover:bg-slate-700 p-4 rounded-xl border border-slate-700 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Smartphone className="text-green-400" />
                                        <span className="font-medium text-white">Android APK</span>
                                        <span className="text-xs text-gray-500 bg-slate-900 px-2 py-1 rounded">Universal</span>
                                    </div>
                                    <Download className="h-5 w-5 text-gray-400" />
                                </a>

                                <a href={buildInfo.downloads.aab} target="_blank" className="flex items-center justify-between bg-slate-800 hover:bg-slate-700 p-4 rounded-xl border border-slate-700 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Smartphone className="text-yellow-400" />
                                        <span className="font-medium text-white">Android Bundle (AAB)</span>
                                        <span className="text-xs text-gray-500 bg-slate-900 px-2 py-1 rounded">Store Ready</span>
                                    </div>
                                    <Download className="h-5 w-5 text-gray-400" />
                                </a>

                                <a href={buildInfo.downloads.exe} target="_blank" className="flex items-center justify-between bg-slate-800 hover:bg-slate-700 p-4 rounded-xl border border-slate-700 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="text-blue-400 font-bold px-1">W</div>
                                        <span className="font-medium text-white">Windows Setup (.exe)</span>
                                    </div>
                                    <Download className="h-5 w-5 text-gray-400" />
                                </a>
                            </div>

                            <button
                                onClick={() => setStatus('idle')}
                                className="mt-8 text-gray-500 hover:text-white text-sm"
                            >
                                Build Another App
                            </button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="text-center py-10">
                            <p className="text-red-400 text-lg mb-4">Something went wrong contacting the server.</p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="bg-slate-700 px-6 py-2 rounded-lg text-white"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </main>
    );
}
