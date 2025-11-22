import { FileText, Calendar, User, MapPin } from 'lucide-react';

interface WhoisInfoProps {
    data: any;
    loading: boolean;
}

export function WhoisInfo({ data, loading }: WhoisInfoProps) {
    if (loading) {
        return (
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <FileText className="h-5 w-5 text-yellow-400" />
                    <h2 className="text-xl font-semibold">WHOIS Information</h2>
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

    // Extract relevant WHOIS fields (structure varies by registrar)
    const extractField = (field: string): string => {
        if (!data || typeof data !== 'object') return 'N/A';

        const value = data[field] || data[field.toLowerCase()] || data[field.toUpperCase()];
        if (Array.isArray(value)) return value.join(', ');
        return value || 'N/A';
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-5 w-5 text-yellow-400" />
                <h2 className="text-xl font-semibold">WHOIS Information</h2>
            </div>

            <div className="space-y-4">
                {/* Network Information */}
                <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold mb-3 flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-blue-400" />
                        <span>Network Details</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                            <span className="text-gray-400">Network Name:</span>
                            <div className="font-mono mt-1">{extractField('netname') || extractField('OrgName')}</div>
                        </div>
                        <div>
                            <span className="text-gray-400">Network Range:</span>
                            <div className="font-mono mt-1">{extractField('inetnum') || extractField('NetRange')}</div>
                        </div>
                        <div>
                            <span className="text-gray-400">CIDR:</span>
                            <div className="font-mono mt-1">{extractField('cidr') || extractField('CIDR')}</div>
                        </div>
                        <div>
                            <span className="text-gray-400">Country:</span>
                            <div className="font-mono mt-1">{extractField('country') || extractField('Country')}</div>
                        </div>
                    </div>
                </div>

                {/* Organization Information */}
                <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold mb-3 flex items-center space-x-2">
                        <User className="h-4 w-4 text-green-400" />
                        <span>Organization</span>
                    </h3>
                    <div className="space-y-2 text-sm">
                        <div>
                            <span className="text-gray-400">Organization:</span>
                            <div className="mt-1">{extractField('org') || extractField('organization') || extractField('OrgName')}</div>
                        </div>
                        {(data.address || data.Address) && (
                            <div>
                                <span className="text-gray-400">Address:</span>
                                <div className="mt-1">{extractField('address') || extractField('Address')}</div>
                            </div>
                        )}
                        {(data.email || data.OrgAbuseEmail || data.OrgTechEmail) && (
                            <div>
                                <span className="text-gray-400">Contact Email:</span>
                                <div className="mt-1 font-mono text-blue-400">
                                    {extractField('email') || extractField('OrgAbuseEmail') || extractField('OrgTechEmail')}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Registration Dates */}
                {(data.created || data.RegDate || data.changed || data.Updated) && (
                    <div className="bg-gray-700 rounded-lg p-4">
                        <h3 className="font-semibold mb-3 flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-purple-400" />
                            <span>Registration Dates</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            {(data.created || data.RegDate) && (
                                <div>
                                    <span className="text-gray-400">Created:</span>
                                    <div className="mt-1">{extractField('created') || extractField('RegDate')}</div>
                                </div>
                            )}
                            {(data.changed || data.Updated) && (
                                <div>
                                    <span className="text-gray-400">Updated:</span>
                                    <div className="mt-1">{extractField('changed') || extractField('Updated')}</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Raw WHOIS (collapsed by default) */}
                <details className="bg-gray-700 rounded-lg p-4">
                    <summary className="font-semibold cursor-pointer hover:text-blue-400 transition-colors">
                        View Raw WHOIS Data
                    </summary>
                    <pre className="mt-3 text-xs font-mono bg-gray-800 p-3 rounded overflow-x-auto max-h-60 overflow-y-auto">
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </details>
            </div>
        </div>
    );
}
