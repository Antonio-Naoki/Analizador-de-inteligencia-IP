import React, { useState } from 'react';
import { Server, Copy, CheckCircle } from 'lucide-react';

interface DnsRecord {
    type: string;
    value: string | string[];
}

interface DnsRecordsTableProps {
    data: {
        a?: string[];
        aaaa?: string[];
        mx?: any[];
        ns?: string[];
        txt?: string[][];
        cname?: string[];
    } | null;
    reverseDns?: string[];
    loading: boolean;
}

export function DnsRecordsTable({ data, reverseDns, loading }: DnsRecordsTableProps) {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    if (loading) {
        return (
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <Server className="h-5 w-5 text-green-400" />
                    <h2 className="text-xl font-semibold">DNS Records</h2>
                </div>
                <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (!data && !reverseDns) {
        return null;
    }

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const records: DnsRecord[] = [];

    if (reverseDns && reverseDns.length > 0) {
        records.push({ type: 'PTR (Reverse DNS)', value: reverseDns });
    }

    if (data) {
        if (data.a && data.a.length > 0) {
            records.push({ type: 'A', value: data.a });
        }
        if (data.aaaa && data.aaaa.length > 0) {
            records.push({ type: 'AAAA', value: data.aaaa });
        }
        if (data.mx && data.mx.length > 0) {
            records.push({
                type: 'MX',
                value: data.mx.map(mx => `${mx.priority} ${mx.exchange}`).join(', ')
            });
        }
        if (data.ns && data.ns.length > 0) {
            records.push({ type: 'NS', value: data.ns });
        }
        if (data.txt && data.txt.length > 0) {
            records.push({ type: 'TXT', value: data.txt.map(t => t.join(' ')) });
        }
        if (data.cname && data.cname.length > 0) {
            records.push({ type: 'CNAME', value: data.cname });
        }
    }

    if (records.length === 0) {
        return (
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <Server className="h-5 w-5 text-green-400" />
                    <h2 className="text-xl font-semibold">DNS Records</h2>
                </div>
                <p className="text-gray-500">No DNS records available</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
                <Server className="h-5 w-5 text-green-400" />
                <h2 className="text-xl font-semibold">DNS Records</h2>
                <span className="ml-auto text-sm bg-green-900 text-green-200 px-2 py-1 rounded-full">
                    {records.length} records
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-700">
                            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Type</th>
                            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Value</th>
                            <th className="text-right py-3 px-4 text-gray-400 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record, idx) => {
                            const valueStr = Array.isArray(record.value) ? record.value.join(', ') : record.value;
                            const recordKey = `${record.type}-${idx}`;

                            return (
                                <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                                    <td className="py-3 px-4">
                                        <span className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs font-mono">
                                            {record.type}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="font-mono text-sm text-gray-300 break-all">
                                            {valueStr}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <button
                                            onClick={() => copyToClipboard(valueStr, recordKey)}
                                            className="text-blue-400 hover:text-blue-300 transition-colors"
                                            title="Copy to clipboard"
                                        >
                                            {copiedField === recordKey ? (
                                                <CheckCircle className="h-5 w-5 text-green-400" />
                                            ) : (
                                                <Copy className="h-5 w-5" />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
