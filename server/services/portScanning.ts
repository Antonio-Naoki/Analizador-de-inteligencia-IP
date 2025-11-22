import axios from 'axios';

interface PortInfo {
    shodan?: {
        ports?: number[];
        services?: any[];
        vulns?: string[];
        hostnames?: string[];
        os?: string;
        tags?: string[];
    };
    commonPorts?: {
        port: number;
        service: string;
        status: 'open' | 'closed' | 'unknown';
    }[];
}

// Common ports to check
const COMMON_PORTS = [
    { port: 21, service: 'FTP' },
    { port: 22, service: 'SSH' },
    { port: 23, service: 'Telnet' },
    { port: 25, service: 'SMTP' },
    { port: 53, service: 'DNS' },
    { port: 80, service: 'HTTP' },
    { port: 110, service: 'POP3' },
    { port: 143, service: 'IMAP' },
    { port: 443, service: 'HTTPS' },
    { port: 445, service: 'SMB' },
    { port: 3306, service: 'MySQL' },
    { port: 3389, service: 'RDP' },
    { port: 5432, service: 'PostgreSQL' },
    { port: 5900, service: 'VNC' },
    { port: 8080, service: 'HTTP-Alt' },
    { port: 8443, service: 'HTTPS-Alt' },
];

export async function getPortInfo(ip: string): Promise<PortInfo> {
    const result: PortInfo = {
        commonPorts: COMMON_PORTS.map(p => ({ ...p, status: 'unknown' as const })),
    };

    // Shodan integration (if API key available)
    if (process.env.SHODAN_API_KEY) {
        try {
            const response = await axios.get(
                `https://api.shodan.io/shodan/host/${ip}?key=${process.env.SHODAN_API_KEY}`
            );

            const data = response.data;

            result.shodan = {
                ports: data.ports || [],
                services: data.data || [],
                vulns: data.vulns || [],
                hostnames: data.hostnames || [],
                os: data.os || undefined,
                tags: data.tags || [],
            };

            // Update common ports status based on Shodan data
            if (data.ports && Array.isArray(data.ports)) {
                result.commonPorts = result.commonPorts.map(p => ({
                    ...p,
                    status: data.ports.includes(p.port) ? 'open' as const : 'closed' as const,
                }));
            }
        } catch (err: any) {
            if (err.response?.status === 404) {
                console.log('IP not found in Shodan database');
            } else {
                console.error('Shodan Error:', err.message);
            }
        }
    }

    return result;
}
