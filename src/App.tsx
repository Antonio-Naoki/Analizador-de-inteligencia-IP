import React, { useState, useEffect } from 'react';
import { Search, Globe, Shield, Server, MapPin, Clock, AlertTriangle, ExternalLink, Network, Sun, Moon } from 'lucide-react';
import { ThreatIntelCard } from './components/ThreatIntelCard';
import { DnsRecordsTable } from './components/DnsRecordsTable';
import { PortVisualization } from './components/PortVisualization';
import { WhoisInfo } from './components/WhoisInfo';
import { ExportMenu } from './components/ExportMenu';
import type { ExportData } from './utils/exportHelpers';

interface IPInfo {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  country_code?: string;
  postal?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  isp?: string;
  org?: string;
  as?: string;
  asname?: string;
  continent_code?: string;
  currency?: string;
  languages?: string;
  mobile?: boolean;
  proxy?: boolean;
  hosting?: boolean;
  query?: string;
  status?: string;
  regionName?: string;
  zip?: string;
  lat?: number;
  lon?: number;
}

function App() {
  const [ip, setIp] = useState('');
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [threatIntel, setThreatIntel] = useState<any>(null);
  const [networkInfo, setNetworkInfo] = useState<any>(null);
  const [portInfo, setPortInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [userIP, setUserIP] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    getUserIP();
    const history = localStorage.getItem('ipSearchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const getUserIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setUserIP(data.ip);
    } catch (error) {
      console.log('Could not fetch user IP');
    }
  };

  const validateIP = (ip: string): boolean => {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  };

  const fetchIPInfo = async (targetIP: string) => {
    setLoading(true);
    setError('');
    setIpInfo(null);
    setThreatIntel(null);
    setNetworkInfo(null);
    setPortInfo(null);

    if (!validateIP(targetIP)) {
      setError('Por favor ingresa una dirección IP válida');
      setLoading(false);
      return;
    }

    try {
      // Fetch basic IP info
      const ipApiResponse = await fetch(`http://ip-api.com/json/${targetIP}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,asname,mobile,proxy,hosting,query`);
      const ipApiData = await ipApiResponse.json();

      if (ipApiData.status !== 'fail') {
        setIpInfo(ipApiData);
      }

      // Fetch enhanced data from our backend
      const [threatRes, networkRes, portsRes] = await Promise.allSettled([
        fetch(`/api/threat-intel/${targetIP}`).then(r => r.json()),
        fetch(`/api/network/${targetIP}`).then(r => r.json()),
        fetch(`/api/ports/${targetIP}`).then(r => r.json()),
      ]);

      if (threatRes.status === 'fulfilled' && !threatRes.value.error) {
        setThreatIntel(threatRes.value);
      }

      if (networkRes.status === 'fulfilled' && !networkRes.value.error) {
        setNetworkInfo(networkRes.value);
      }

      if (portsRes.status === 'fulfilled' && !portsRes.value.error) {
        setPortInfo(portsRes.value);
      }

      // Update search history
      const newHistory = [targetIP, ...searchHistory.filter(h => h !== targetIP)].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('ipSearchHistory', JSON.stringify(newHistory));

    } catch (err) {
      console.error('Error fetching IP info:', err);
      setError('Error al obtener información de la IP. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ip.trim()) {
      fetchIPInfo(ip.trim());
    }
  };

  const exportData: ExportData = {
    ip: ipInfo?.ip || ip,
    timestamp: new Date().toISOString(),
    ipInfo,
    threatIntel,
    networkInfo,
    portInfo,
  };

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-700 rounded w-2/3"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Analizador de Inteligencia IP</h1>
                <p className="text-sm text-gray-400">Análisis completo OSINT de direcciones IP</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title="Toggle theme"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              {userIP && (
                <div className="text-right">
                  <p className="text-sm text-gray-400">Tu IP:</p>
                  <p className="text-lg font-mono text-blue-400">{userIP}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="Ingresa una dirección IP (ej: 8.8.8.8)"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Analizando...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Analizar IP</span>
                </>
              )}
            </button>
          </form>

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">Búsquedas recientes:</p>
              <div className="flex flex-wrap gap-2">
                {searchHistory.slice(0, 5).map((historyIP, index) => (
                  <button
                    key={index}
                    onClick={() => setIp(historyIP)}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-sm text-gray-300 rounded-full transition-colors duration-200 font-mono"
                  >
                    {historyIP}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-900 border border-red-700 rounded-lg flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <p className="text-red-200">{error}</p>
            </div>
          )}
        </div>

        {/* Results */}
        {(loading || ipInfo) && (
          <div className="space-y-6">
            {/* Threat Intelligence - Full Width */}
            <ThreatIntelCard data={threatIntel} loading={loading} />

            {/* Basic Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Basic Information */}
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Globe className="h-5 w-5 text-blue-400" />
                  <h2 className="text-xl font-semibold">Información Básica</h2>
                </div>
                {loading ? (
                  <LoadingSkeleton />
                ) : ipInfo ? (
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400">IP:</span>
                      <span className="ml-2 font-mono text-blue-400">{ipInfo.ip}</span>
                    </div>
                    {ipInfo.country && (
                      <div>
                        <span className="text-gray-400">País:</span>
                        <span className="ml-2">{ipInfo.country} ({ipInfo.country_code})</span>
                      </div>
                    )}
                    {ipInfo.city && (
                      <div>
                        <span className="text-gray-400">Ciudad:</span>
                        <span className="ml-2">{ipInfo.city}</span>
                      </div>
                    )}
                    {ipInfo.regionName && (
                      <div>
                        <span className="text-gray-400">Región:</span>
                        <span className="ml-2">{ipInfo.regionName}</span>
                      </div>
                    )}
                    {ipInfo.zip && (
                      <div>
                        <span className="text-gray-400">Código Postal:</span>
                        <span className="ml-2">{ipInfo.zip}</span>
                      </div>
                    )}
                    {ipInfo.timezone && (
                      <div>
                        <span className="text-gray-400">Zona Horaria:</span>
                        <span className="ml-2">{ipInfo.timezone}</span>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              {/* Geolocation */}
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="h-5 w-5 text-green-400" />
                  <h2 className="text-xl font-semibold">Geolocalización</h2>
                </div>
                {loading ? (
                  <LoadingSkeleton />
                ) : ipInfo && (ipInfo.lat || ipInfo.latitude) ? (
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400">Latitud:</span>
                      <span className="ml-2 font-mono">{ipInfo.lat || ipInfo.latitude}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Longitud:</span>
                      <span className="ml-2 font-mono">{ipInfo.lon || ipInfo.longitude}</span>
                    </div>
                    <a
                      href={`https://www.google.com/maps?q=${ipInfo.lat || ipInfo.latitude},${ipInfo.lon || ipInfo.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                    >
                      <span>Ver en Google Maps</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                ) : (
                  <p className="text-gray-500">No disponible</p>
                )}
              </div>

              {/* Network Information */}
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Server className="h-5 w-5 text-purple-400" />
                  <h2 className="text-xl font-semibold">Red e ISP</h2>
                </div>
                {loading ? (
                  <LoadingSkeleton />
                ) : ipInfo ? (
                  <div className="space-y-3">
                    {ipInfo.isp && (
                      <div>
                        <span className="text-gray-400">ISP:</span>
                        <span className="ml-2">{ipInfo.isp}</span>
                      </div>
                    )}
                    {ipInfo.org && (
                      <div>
                        <span className="text-gray-400">Organización:</span>
                        <span className="ml-2">{ipInfo.org}</span>
                      </div>
                    )}
                    {ipInfo.as && (
                      <div>
                        <span className="text-gray-400">AS:</span>
                        <span className="ml-2 font-mono">{ipInfo.as}</span>
                      </div>
                    )}
                    {ipInfo.asname && (
                      <div>
                        <span className="text-gray-400">AS Name:</span>
                        <span className="ml-2">{ipInfo.asname}</span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {ipInfo.mobile && (
                        <span className="px-2 py-1 bg-blue-900 text-blue-200 text-xs rounded-full">Móvil</span>
                      )}
                      {ipInfo.proxy && (
                        <span className="px-2 py-1 bg-yellow-900 text-yellow-200 text-xs rounded-full">Proxy</span>
                      )}
                      {ipInfo.hosting && (
                        <span className="px-2 py-1 bg-purple-900 text-purple-200 text-xs rounded-full">Hosting</span>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>

              {/* ASN Information */}
              {networkInfo?.asn && (
                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Network className="h-5 w-5 text-indigo-400" />
                    <h2 className="text-xl font-semibold">AS Network</h2>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400">ASN:</span>
                      <span className="ml-2 font-mono">{networkInfo.asn.number}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Name:</span>
                      <span className="ml-2">{networkInfo.asn.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Country:</span>
                      <span className="ml-2">{networkInfo.asn.country}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="h-5 w-5 text-indigo-400" />
                  <h2 className="text-xl font-semibold">Acciones</h2>
                </div>
                <div className="space-y-3">
                  <ExportMenu data={exportData} disabled={!ipInfo} />

                  {ipInfo && (
                    <a
                      href={`https://www.shodan.io/host/${ipInfo.query || ipInfo.ip}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Ver en Shodan</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* DNS Records */}
            <DnsRecordsTable
              data={networkInfo?.dns}
              reverseDns={networkInfo?.reverseDns}
              loading={loading}
            />

            {/* WHOIS Information */}
            <WhoisInfo data={networkInfo?.whois} loading={loading} />

            {/* Port Analysis */}
            <PortVisualization data={portInfo} loading={loading} />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500">
          <p>© 2025 Analizador de Inteligencia IP - Herramienta OSINT para análisis de direcciones IP</p>
          <p className="text-sm mt-2">Datos obtenidos de múltiples fuentes públicas. Use esta información de manera responsable.</p>
          <p className="text-xs mt-2 text-gray-600">
            Powered by: IP-API, AbuseIPDB, VirusTotal, IPQualityScore, AlienVault OTX, Shodan
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;