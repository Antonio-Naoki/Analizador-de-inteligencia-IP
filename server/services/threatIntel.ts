import axios from 'axios';

interface ThreatIntelResult {
    abuseipdb?: any;
    virustotal?: any;
    ipqualityscore?: any;
    alienvault?: any;
    aggregatedScore: number;
    threatLevel: 'critical' | 'high' | 'medium' | 'low' | 'clean';
    isMalicious: boolean;
    detections: string[];
}

export async function analyzeThreatIntelligence(ip: string): Promise<ThreatIntelResult> {
    const results: ThreatIntelResult = {
        aggregatedScore: 0,
        threatLevel: 'clean',
        isMalicious: false,
        detections: [],
    };

    const promises = [];

    // AbuseIPDB
    if (process.env.ABUSEIPDB_API_KEY) {
        promises.push(
            axios.get(`https://api.abuseipdb.com/api/v2/check`, {
                params: { ipAddress: ip, maxAgeInDays: 90 },
                headers: {
                    'Key': process.env.ABUSEIPDB_API_KEY,
                    'Accept': 'application/json',
                },
            })
                .then(response => {
                    results.abuseipdb = response.data.data;
                    if (response.data.data.abuseConfidenceScore > 50) {
                        results.detections.push('AbuseIPDB: High abuse score');
                    }
                    return response.data.data.abuseConfidenceScore;
                })
                .catch(err => {
                    console.error('AbuseIPDB Error:', err.message);
                    return 0;
                })
        );
    }

    // VirusTotal
    if (process.env.VIRUSTOTAL_API_KEY) {
        promises.push(
            axios.get(`https://www.virustotal.com/api/v3/ip_addresses/${ip}`, {
                headers: {
                    'x-apikey': process.env.VIRUSTOTAL_API_KEY,
                },
            })
                .then(response => {
                    results.virustotal = response.data.data.attributes;
                    const malicious = response.data.data.attributes.last_analysis_stats?.malicious || 0;
                    if (malicious > 0) {
                        results.detections.push(`VirusTotal: ${malicious} malicious detections`);
                    }
                    return malicious * 10; // Scale to 0-100
                })
                .catch(err => {
                    console.error('VirusTotal Error:', err.message);
                    return 0;
                })
        );
    }

    // IPQualityScore
    if (process.env.IPQUALITYSCORE_API_KEY) {
        promises.push(
            axios.get(`https://ipqualityscore.com/api/json/ip/${process.env.IPQUALITYSCORE_API_KEY}/${ip}`, {
                params: { strictness: 0, allow_public_access_points: true },
            })
                .then(response => {
                    results.ipqualityscore = response.data;
                    if (response.data.fraud_score > 75) {
                        results.detections.push('IPQualityScore: High fraud score');
                    }
                    return response.data.fraud_score;
                })
                .catch(err => {
                    console.error('IPQualityScore Error:', err.message);
                    return 0;
                })
        );
    }

    // AlienVault OTX
    if (process.env.ALIENVALUT_OTX_API_KEY) {
        promises.push(
            axios.get(`https://otx.alienvault.com/api/v1/indicators/IPv4/${ip}/general`, {
                headers: {
                    'X-OTX-API-KEY': process.env.ALIENVALUT_OTX_API_KEY,
                },
            })
                .then(response => {
                    results.alienvault = response.data;
                    const pulses = response.data.pulse_info?.count || 0;
                    if (pulses > 0) {
                        results.detections.push(`AlienVault: Found in ${pulses} threat pulses`);
                    }
                    return pulses > 0 ? 70 : 0;
                })
                .catch(err => {
                    console.error('AlienVault Error:', err.message);
                    return 0;
                })
        );
    }

    // Wait for all promises
    const scores = await Promise.all(promises);

    // Calculate aggregated score (0-100)
    if (scores.length > 0) {
        results.aggregatedScore = Math.min(100, Math.round(scores.reduce((a, b) => a + b, 0) / scores.length));
    }

    // Determine threat level and malicious status
    if (results.aggregatedScore >= 80) {
        results.threatLevel = 'critical';
        results.isMalicious = true;
    } else if (results.aggregatedScore >= 60) {
        results.threatLevel = 'high';
        results.isMalicious = true;
    } else if (results.aggregatedScore >= 40) {
        results.threatLevel = 'medium';
        results.isMalicious = false;
    } else if (results.aggregatedScore >= 20) {
        results.threatLevel = 'low';
        results.isMalicious = false;
    } else {
        results.threatLevel = 'clean';
        results.isMalicious = false;
    }

    return results;
}
