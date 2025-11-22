import React from 'react';
import { Server, AlertTriangle, Shield, Info } from 'lucide-react';

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

interface PortVisualizationProps {
    data: PortInfo | null;
    loading: boolean;
}

export function PortVisualization({ data, loading }: PortVisualizationProps) {
    if (loading) {
        return (
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <Server className="h-5 w-5 text-purple-400" />
                    <h2 className="text-xl font-semibold">Port Analysis</h2>
                </div>
                <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    const getRiskLevel = (port: number): string => {
        // High-risk ports
        if ([21, 23, 3389, 5900, 445].includes(port)) return 'critical';
        // Medium-risk ports
        if ([22, 3306, 5432, 8080].includes(port)) return 'medium';
        // Common web ports
        if ([80, 443, 8443].includes(port)) return 'low';
        return 'info';
    };

    const getRiskBadgeClass = (risk: string): string => {
        switch (risk) {
            case 'critical': return 'bg-red-900 text-red-200 border-red-700';
            case 'medium': return 'bg-yellow-900 text-yellow-200 border-yellow-700';
            case 'low': return 'bg-blue-900 text-blue-200 border-blue-700';
            default: return 'bg-gray-700 text-gray-300 border-gray-600';
        }
    };

    const openPorts = data.commonPorts?.filter(p => p.status === 'open') || [];
    const shodanPorts = data.shodan?.ports || [];

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 col-span-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                    <Server className="h-6 w-6 text-purple-400" />
                    <h2 className="text-2xl font-semibold">Port Analysis</h2>
                </div>
                {shodanPorts.length > 0 && (
                    <span className="bg-purple-900 text-purple-200 px-3 py-1 rounded-full text-sm">
                        {shodanPorts.length} ports detected
                    </span>
                )}
            </div>

            {/* Shodan Information */}
            {data.shodan && shodanPorts.length > 0 && (
                <div className="mb-6">
                    <h3 className="font-semibold mb-4 flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-purple-400" />
                        <span>Shodan Intelligence</span>
                    </h3>

                    {data.shodan.os && (
                        <div className="bg-gray-700 rounded-lg p-3 mb-3">
                            <span className="text-gray-400 text-sm">Operating System:</span>
                            <span className="ml-2 font-semibold">{data.shodan.os}</span>
                        </div>
                    )}

                    {data.shodan.hostnames && data.shodan.hostnames.length > 0 && (
                        <div className="bg-gray-700 rounded-lg p-3 mb-3">
                            <span className="text-gray-400 text-sm">Hostnames:</span>
                            <div className="mt-1">
                                {data.shodan.hostnames.map((hostname, idx) => (
                                    <span key={idx} className="inline-block bg-gray-600 px-2 py-1 rounded text-sm mr-2 mb-1">
                                        {hostname}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {data.shodan.tags && data.shodan.tags.length > 0 && (
                        <div className="bg-gray-700 rounded-lg p-3 mb-3">
                            <span className="text-gray-400 text-sm">Tags:</span>
                            <div className="mt-1 flex flex-wrap gap-2">
                                {data.shodan.tags.map((tag, idx) => (
                                    <span key={idx} className="bg-indigo-900 text-indigo-200 px-2 py-1 rounded-full text-xs">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {data.shodan.vulns && data.shodan.vulns.length > 0 && (
                        <div className="bg-red-900 border border-red-700 rounded-lg p-3 mb-3">
                            <div className="flex items-center space-x-2 mb-2">
                                <AlertTriangle className="h-5 w-5 text-red-400" />
                                <span className="font-semibold text-red-200">Vulnerabilities Detected</span>
                            </div>
                            <div className="space-y-1">
                                {data.shodan.vulns.slice(0, 10).map((vuln, idx) => (
                                    <div key={idx} className="text-sm text-red-300 font-mono">
                                        {vuln}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Open Ports Grid */}
            {shodanPorts.length > 0 ? (
                <div>
                    <h3 className="font-semibold mb-3">Open Ports</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {shodanPorts.map((port) => {
                            const risk = getRiskLevel(port);
                            const service = data.commonPorts?.find(cp => cp.port === port);

                            return (
                                <div
                                    key={port}
                                    className={`border-2 rounded-lg p-3 ${getRiskBadgeClass(risk)}`}
                                >
                                    <div className="text-2xl font-bold font-mono">{port}</div>
                                    {service && (
                                        <div className="text-xs mt-1 opacity-80">{service.service}</div>
                                    )}
                                    <div className="text-xs mt-1 capitalize opacity-60">{risk}</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Services Details */}
                    {data.shodan?.services && data.shodan.services.length > 0 && (
                        <div className="mt-6">
                            <h3 className="font-semibold mb-3">Service Details</h3>
                            <div className="space-y-3">
                                {data.shodan.services.slice(0, 5).map((service, idx) => (
                                    <div key={idx} className="bg-gray-700 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold">Port {service.port}</span>
                                            <span className="text-sm bg-purple-900 text-purple-200 px-2 py-1 rounded">
                                                {service.transport || 'tcp'}
                                            </span>
                                        </div>
                                        {service.product && (
                                            <div className="text-sm text-gray-300 mb-1">
                                                <span className="text-gray-400">Product:</span> {service.product}
                                                {service.version && ` v${service.version}`}
                                            </div>
                                        )}
                                        {service.data && (
                                            <div className="text-xs text-gray-400 mt-2 font-mono bg-gray-800 p-2 rounded overflow-x-auto max-h-20 overflow-y-auto">
                                                {service.data.substring(0, 200)}
                                                {service.data.length > 200 && '...'}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-8">
                    <Info className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500">
                        {data.commonPorts ? 'No open ports detected or Shodan data not available' : 'Port scan data not available'}
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                        Configure SHODAN_API_KEY for detailed port scan information
                    </p>
                </div>
            )}
        </div>
    );
}
