import axios from 'axios';
import dns from 'dns';
import { promisify } from 'util';
import whois from 'whois-json';

const dnsResolve4 = promisify(dns.resolve4);
const dnsResolve6 = promisify(dns.resolve6);
const dnsResolveMx = promisify(dns.resolveMx);
const dnsResolveNs = promisify(dns.resolveNs);
const dnsResolveTxt = promisify(dns.resolveTxt);
const dnsResolveCname = promisify(dns.resolveCname);
const dnsReverse = promisify(dns.reverse);

interface NetworkInfo {
    dns?: {
        a?: string[];
        aaaa?: string[];
        mx?: any[];
        ns?: string[];
        txt?: string[][];
        cname?: string[];
    };
    reverseDns?: string[];
    whois?: any;
    asn?: {
        number: string;
        name: string;
        country: string;
        routes: string[];
    };
    geolocation?: any;
}

export async function getNetworkInfo(ip: string): Promise<NetworkInfo> {
    const result: NetworkInfo = {};

    // DNS lookups (try reverse DNS for the IP)
    try {
        const hostnames = await dnsReverse(ip);
        result.reverseDns = hostnames;

        // If we got a hostname, do forward lookups
        if (hostnames && hostnames.length > 0) {
            const hostname = hostnames[0];
            result.dns = {};

            try {
                result.dns.a = await dnsResolve4(hostname).catch(() => undefined);
            } catch (e) { }

            try {
                result.dns.aaaa = await dnsResolve6(hostname).catch(() => undefined);
            } catch (e) { }

            try {
                result.dns.mx = await dnsResolveMx(hostname).catch(() => undefined);
            } catch (e) { }

            try {
                result.dns.ns = await dnsResolveNs(hostname).catch(() => undefined);
            } catch (e) { }

            try {
                result.dns.txt = await dnsResolveTxt(hostname).catch(() => undefined);
            } catch (e) { }

            try {
                result.dns.cname = await dnsResolveCname(hostname).catch(() => undefined);
            } catch (e) { }
        }
    } catch (err) {
        console.log('Reverse DNS lookup failed:', err);
    }

    // WHOIS lookup
    try {
        const whoisData = await whois(ip, { timeout: 5000 });
        result.whois = whoisData;
    } catch (err) {
        console.error('WHOIS Error:', err);
    }

    // ASN and BGP information from RIPEstat
    try {
        const asnResponse = await axios.get(
            `https://stat.ripe.net/data/prefix-overview/data.json?resource=${ip}`
        );

        if (asnResponse.data.data) {
            const asns = asnResponse.data.data.asns;
            if (asns && asns.length > 0) {
                result.asn = {
                    number: asns[0].asn,
                    name: asns[0].holder,
                    country: asnResponse.data.data.resource || '',
                    routes: asnResponse.data.data.announced_prefixes || [],
                };
            }
        }
    } catch (err) {
        console.error('ASN lookup error:', err);
    }

    // Enhanced geolocation from ip-api.com (free, no key required)
    try {
        const geoResponse = await axios.get(
            `http://ip-api.com/json/${ip}?fields=66846719`
        );

        if (geoResponse.data.status !== 'fail') {
            result.geolocation = geoResponse.data;
        }
    } catch (err) {
        console.error('Geolocation error:', err);
    }

    return result;
}
