import React from 'react';
import { Shield, AlertTriangle, CheckCircle, TrendingUp, Database } from 'lucide-react';

interface ThreatIntelCardProps {
    data: {
        aggregatedScore: number;
        threatLevel: string;
        isMalicious: boolean;
        detections: string[];
        abuseipdb?: any;
        virustotal?: any;
        ipqualityscore?: any;
        alienvault?: any;
    } | null;
    loading: boolean;
}

export function ThreatIntelCard({ data, loading }: ThreatIntelCardProps) {
    if (loading) {
        return (
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <Shield className="h-5 w-5 text-red-400" />
                    <h2 className="text-xl font-semibold">Threat Intelligence</h2>
                </div>
                <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                </div>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    const getThreatColor = (level: string) => {
        switch (level) {
            case 'critical': return 'bg-red-900 text-red-200 border-red-700';
            case 'high': return 'bg-orange-900 text-orange-200 border-orange-700';
            case 'medium': return 'bg-yellow-900 text-yellow-200 border-yellow-700';
            case 'low': return 'bg-blue-900 text-blue-200 border-blue-700';
            default: return 'bg-green-900 text-green-200 border-green-700';
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-red-400';
        if (score >= 60) return 'text-orange-400';
        if (score >= 40) return 'text-yellow-400';
        if (score >= 20) return 'text-blue-400';
        return 'text-green-400';
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 col-span-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                    <Shield className="h-6 w-6 text-red-400" />
                    <h2 className="text-2xl font-semibold">Threat Intelligence Analysis</h2>
                </div>
                <div className={`px-4 py-2 rounded-lg border-2 ${getThreatColor(data.threatLevel)}`}>
                    <span className="font-bold uppercase">{data.threatLevel}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Aggregated Score */}
                <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">Aggregated Score</span>
                        <TrendingUp className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className={`text-4xl font-bold ${getScoreColor(data.aggregatedScore)}`}>
                        {data.aggregatedScore}/100
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2 mt-3">
                        <div
                            className={`h-2 rounded-full transition-all ${data.aggregatedScore >= 80 ? 'bg-red-500' :
                                    data.aggregatedScore >= 60 ? 'bg-orange-500' :
                                        data.aggregatedScore >= 40 ? 'bg-yellow-500' :
                                            data.aggregatedScore >= 20 ? 'bg-blue-500' : 'bg-green-500'
                                }`}
                            style={{ width: `${data.aggregatedScore}%` }}
                        ></div>
                    </div>
                </div>

                {/* Status */}
                <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">Status</span>
                        {data.isMalicious ? (
                            <AlertTriangle className="h-5 w-5 text-red-400" />
                        ) : (
                            <CheckCircle className="h-5 w-5 text-green-400" />
                        )}
                    </div>
                    <div className={`text-2xl font-bold ${data.isMalicious ? 'text-red-400' : 'text-green-400'}`}>
                        {data.isMalicious ? 'Malicious' : 'Clean'}
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                        {data.isMalicious ? 'This IP has been flagged as malicious' : 'No malicious activity detected'}
                    </p>
                </div>

                {/* Sources */}
                <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">Data Sources</span>
                        <Database className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="space-y-1">
                        {data.abuseipdb && (
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm">AbuseIPDB</span>
                            </div>
                        )}
                        {data.virustotal && (
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm">VirusTotal</span>
                            </div>
                        )}
                        {data.ipqualityscore && (
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm">IPQualityScore</span>
                            </div>
                        )}
                        {data.alienvault && (
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm">AlienVault OTX</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Detections */}
            {data.detections && data.detections.length > 0 && (
                <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold mb-3 flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-orange-400" />
                        <span>Detections ({data.detections.length})</span>
                    </h3>
                    <ul className="space-y-2">
                        {data.detections.map((detection, idx) => (
                            <li key={idx} className="flex items-start space-x-2 text-sm">
                                <span className="text-orange-400 mt-1">•</span>
                                <span className="text-gray-300">{detection}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Detailed Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {data.abuseipdb && (
                    <div className="bg-gray-700 rounded-lg p-4">
                        <h3 className="font-semibold mb-2 text-blue-400">AbuseIPDB Details</h3>
                        <div className="space-y-1 text-sm">
                            <div><span className="text-gray-400">Abuse Score:</span> <span className="font-mono">{data.abuseipdb.abuseConfidenceScore}%</span></div>
                            <div><span className="text-gray-400">Reports:</span> <span className="font-mono">{data.abuseipdb.totalReports || 0}</span></div>
                            <div><span className="text-gray-400">Country:</span> <span>{data.abuseipdb.countryCode || 'N/A'}</span></div>
                        </div>
                    </div>
                )}

                {data.virustotal && (
                    <div className="bg-gray-700 rounded-lg p-4">
                        <h3 className="font-semibold mb-2 text-purple-400">VirusTotal Details</h3>
                        <div className="space-y-1 text-sm">
                            <div><span className="text-gray-400">Malicious:</span> <span className="font-mono text-red-400">{data.virustotal.last_analysis_stats?.malicious || 0}</span></div>
                            <div><span className="text-gray-400">Suspicious:</span> <span className="font-mono text-yellow-400">{data.virustotal.last_analysis_stats?.suspicious || 0}</span></div>
                            <div><span className="text-gray-400">Harmless:</span> <span className="font-mono text-green-400">{data.virustotal.last_analysis_stats?.harmless || 0}</span></div>
                        </div>
                    </div>
                )}

                {data.ipqualityscore && (
                    <div className="bg-gray-700 rounded-lg p-4">
                        <h3 className="font-semibold mb-2 text-green-400">IPQualityScore Details</h3>
                        <div className="space-y-1 text-sm">
                            <div><span className="text-gray-400">Fraud Score:</span> <span className="font-mono">{data.ipqualityscore.fraud_score}%</span></div>
                            <div><span className="text-gray-400">VPN:</span> <span>{data.ipqualityscore.vpn ? 'Yes' : 'No'}</span></div>
                            <div><span className="text-gray-400">Tor:</span> <span>{data.ipqualityscore.tor ? 'Yes' : 'No'}</span></div>
                            <div><span className="text-gray-400">Proxy:</span> <span>{data.ipqualityscore.proxy ? 'Yes' : 'No'}</span></div>
                        </div>
                    </div>
                )}

                {data.alienvault && (
                    <div className="bg-gray-700 rounded-lg p-4">
                        <h3 className="font-semibold mb-2 text-orange-400">AlienVault OTX Details</h3>
                        <div className="space-y-1 text-sm">
                            <div><span className="text-gray-400">Pulses:</span> <span className="font-mono">{data.alienvault.pulse_info?.count || 0}</span></div>
                            <div><span className="text-gray-400">References:</span> <span className="font-mono">{data.alienvault.pulse_info?.references?.length || 0}</span></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
