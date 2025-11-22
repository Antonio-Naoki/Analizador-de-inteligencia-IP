import React, { useState } from 'react';
import { Download, FileJson, FileText, FileDown, FileSpreadsheet } from 'lucide-react';
import { exportToJSON, exportToCSV, exportToPDF, exportToMarkdown, ExportData } from '../utils/exportHelpers';

interface ExportMenuProps {
    data: ExportData;
    disabled?: boolean;
}

export function ExportMenu({ data, disabled }: ExportMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleExport = (format: 'json' | 'csv' | 'pdf' | 'markdown') => {
        switch (format) {
            case 'json':
                exportToJSON(data);
                break;
            case 'csv':
                exportToCSV(data);
                break;
            case 'pdf':
                exportToPDF(data);
                break;
            case 'markdown':
                exportToMarkdown(data);
                break;
        }
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled}
                className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
            >
                <Download className="h-4 w-4" />
                <span>Export Report</span>
            </button>

            {isOpen && !disabled && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    ></div>

                    <div className="absolute bottom-full left-0 mb-2 w-full bg-gray-700 rounded-lg shadow-lg overflow-hidden z-20 border border-gray-600">
                        <button
                            onClick={() => handleExport('json')}
                            className="w-full px-4 py-3 hover:bg-gray-600 transition-colors flex items-center space-x-3 text-left"
                        >
                            <FileJson className="h-5 w-5 text-blue-400" />
                            <div>
                                <div className="font-medium">JSON</div>
                                <div className="text-xs text-gray-400">Machine-readable format</div>
                            </div>
                        </button>

                        <button
                            onClick={() => handleExport('csv')}
                            className="w-full px-4 py-3 hover:bg-gray-600 transition-colors flex items-center space-x-3 text-left border-t border-gray-600"
                        >
                            <FileSpreadsheet className="h-5 w-5 text-green-400" />
                            <div>
                                <div className="font-medium">CSV</div>
                                <div className="text-xs text-gray-400">Spreadsheet compatible</div>
                            </div>
                        </button>

                        <button
                            onClick={() => handleExport('pdf')}
                            className="w-full px-4 py-3 hover:bg-gray-600 transition-colors flex items-center space-x-3 text-left border-t border-gray-600"
                        >
                            <FileDown className="h-5 w-5 text-red-400" />
                            <div>
                                <div className="font-medium">PDF</div>
                                <div className="text-xs text-gray-400">Professional report</div>
                            </div>
                        </button>

                        <button
                            onClick={() => handleExport('markdown')}
                            className="w-full px-4 py-3 hover:bg-gray-600 transition-colors flex items-center space-x-3 text-left border-t border-gray-600"
                        >
                            <FileText className="h-5 w-5 text-purple-400" />
                            <div>
                                <div className="font-medium">Markdown</div>
                                <div className="text-xs text-gray-400">Documentation format</div>
                            </div>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
