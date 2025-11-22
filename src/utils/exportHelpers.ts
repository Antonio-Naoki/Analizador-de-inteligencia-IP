import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ExportData {
    ip: string;
    timestamp: string;
    ipInfo?: any;
    threatIntel?: any;
    networkInfo?: any;
    portInfo?: any;
}

// Export to JSON
export function exportToJSON(data: ExportData): void {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ip-analysis-${data.ip}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

// Export to CSV
export function exportToCSV(data: ExportData): void {
    const rows: string[][] = [
        ['Field', 'Value'],
        ['IP Address', data.ip],
        ['Analysis Date', data.timestamp],
        ['', ''],
        ['=== BASIC INFO ===', ''],
    ];

    if (data.ipInfo) {
        rows.push(
            ['Country', `${data.ipInfo.country || 'N/A'} (${data.ipInfo.country_code || 'N/A'})`],
            ['City', data.ipInfo.city || 'N/A'],
            ['Region', data.ipInfo.regionName || 'N/A'],
            ['ISP', data.ipInfo.isp || 'N/A'],
            ['Organization', data.ipInfo.org || 'N/A'],
            ['AS', data.ipInfo.as || 'N/A']
        );
    }

    if (data.threatIntel) {
        rows.push(
            ['', ''],
            ['=== THREAT INTELLIGENCE ===', ''],
            ['Threat Level', data.threatIntel.threatLevel || 'N/A'],
            ['Is Malicious', data.threatIntel.isMalicious ? 'Yes' : 'No'],
            ['Score', (data.threatIntel.aggregatedScore || 0).toString()],
            ['Detections', data.threatIntel.detections?.join('; ') || 'None']
        );
    }

    if (data.networkInfo?.reverseDns) {
        rows.push(
            ['', ''],
            ['=== NETWORK INFO ===', ''],
            ['Reverse DNS', data.networkInfo.reverseDns.join(', ')]
        );
    }

    const csvContent = rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ip-analysis-${data.ip}-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

// Export to PDF
export function exportToPDF(data: ExportData): void {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(33, 150, 243);
    doc.text('IP Analysis Report', 14, 20);

    // Subtitle
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date(data.timestamp).toLocaleString()}`, 14, 28);

    // IP Address
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(`IP: ${data.ip}`, 14, 38);

    let yPos = 48;

    // Basic Information
    if (data.ipInfo) {
        doc.setFontSize(14);
        doc.setTextColor(33, 150, 243);
        doc.text('Basic Information', 14, yPos);
        yPos += 8;

        const basicData = [
            ['Country', `${data.ipInfo.country || 'N/A'} (${data.ipInfo.country_code || 'N/A'})`],
            ['City', data.ipInfo.city || 'N/A'],
            ['Region', data.ipInfo.regionName || 'N/A'],
            ['Postal Code', data.ipInfo.zip || 'N/A'],
            ['Timezone', data.ipInfo.timezone || 'N/A'],
            ['ISP', data.ipInfo.isp || 'N/A'],
            ['Organization', data.ipInfo.org || 'N/A'],
            ['AS', data.ipInfo.as || 'N/A'],
            ['Latitude', data.ipInfo.lat?.toString() || 'N/A'],
            ['Longitude', data.ipInfo.lon?.toString() || 'N/A'],
        ];

        autoTable(doc, {
            startY: yPos,
            head: [['Field', 'Value']],
            body: basicData,
            theme: 'grid',
            headStyles: { fillColor: [33, 150, 243] },
        });

        yPos = (doc as any).lastAutoTable.finalY + 10;
    }

    // Threat Intelligence
    if (data.threatIntel && yPos < 250) {
        doc.setFontSize(14);
        doc.setTextColor(244, 67, 54);
        doc.text('Threat Intelligence', 14, yPos);
        yPos += 8;

        const threatData = [
            ['Threat Level', data.threatIntel.threatLevel || 'N/A'],
            ['Is Malicious', data.threatIntel.isMalicious ? 'Yes' : 'No'],
            ['Aggregated Score', `${data.threatIntel.aggregatedScore || 0}/100`],
            ['Detections', data.threatIntel.detections?.join('\n') || 'None'],
        ];

        autoTable(doc, {
            startY: yPos,
            head: [['Field', 'Value']],
            body: threatData,
            theme: 'grid',
            headStyles: { fillColor: [244, 67, 54] },
        });

        yPos = (doc as any).lastAutoTable.finalY + 10;
    }

    // Network Information
    if (data.networkInfo && yPos < 250) {
        if (yPos > 240) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFontSize(14);
        doc.setTextColor(76, 175, 80);
        doc.text('Network Information', 14, yPos);
        yPos += 8;

        const networkData = [];

        if (data.networkInfo.reverseDns) {
            networkData.push(['Reverse DNS', data.networkInfo.reverseDns.join(', ')]);
        }

        if (data.networkInfo.asn) {
            networkData.push(
                ['ASN Number', data.networkInfo.asn.number || 'N/A'],
                ['ASN Name', data.networkInfo.asn.name || 'N/A'],
                ['ASN Country', data.networkInfo.asn.country || 'N/A']
            );
        }

        if (networkData.length > 0) {
            autoTable(doc, {
                startY: yPos,
                head: [['Field', 'Value']],
                body: networkData,
                theme: 'grid',
                headStyles: { fillColor: [76, 175, 80] },
            });

            yPos = (doc as any).lastAutoTable.finalY + 10;
        }
    }

    // Port Information
    if (data.portInfo?.shodan?.ports && yPos < 250) {
        if (yPos > 240) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFontSize(14);
        doc.setTextColor(156, 39, 176);
        doc.text('Open Ports', 14, yPos);
        yPos += 8;

        const portData = data.portInfo.shodan.ports.slice(0, 20).map((port: number) => [port.toString()]);

        if (portData.length > 0) {
            autoTable(doc, {
                startY: yPos,
                head: [['Port']],
                body: portData,
                theme: 'grid',
                headStyles: { fillColor: [156, 39, 176] },
            });
        }
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(
            `Page ${i} of ${pageCount} - IP OSINT Analyzer`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
        );
    }

    doc.save(`ip-analysis-${data.ip}-${Date.now()}.pdf`);
}

// Export to Markdown
export function exportToMarkdown(data: ExportData): void {
    let markdown = `# IP Analysis Report\n\n`;
    markdown += `**IP Address:** ${data.ip}\n\n`;
    markdown += `**Generated:** ${new Date(data.timestamp).toLocaleString()}\n\n`;
    markdown += `---\n\n`;

    // Basic Information
    if (data.ipInfo) {
        markdown += `## Basic Information\n\n`;
        markdown += `| Field | Value |\n`;
        markdown += `|-------|-------|\n`;
        markdown += `| Country | ${data.ipInfo.country || 'N/A'} (${data.ipInfo.country_code || 'N/A'}) |\n`;
        markdown += `| City | ${data.ipInfo.city || 'N/A'} |\n`;
        markdown += `| Region | ${data.ipInfo.regionName || 'N/A'} |\n`;
        markdown += `| ISP | ${data.ipInfo.isp || 'N/A'} |\n`;
        markdown += `| Organization | ${data.ipInfo.org || 'N/A'} |\n`;
        markdown += `| AS | ${data.ipInfo.as || 'N/A'} |\n\n`;
    }

    // Threat Intelligence
    if (data.threatIntel) {
        markdown += `## Threat Intelligence\n\n`;
        markdown += `| Field | Value |\n`;
        markdown += `|-------|-------|\n`;
        markdown += `| Threat Level | ${data.threatIntel.threatLevel || 'N/A'} |\n`;
        markdown += `| Is Malicious | ${data.threatIntel.isMalicious ? 'Yes' : 'No'} |\n`;
        markdown += `| Score | ${data.threatIntel.aggregatedScore || 0}/100 |\n\n`;

        if (data.threatIntel.detections && data.threatIntel.detections.length > 0) {
            markdown += `### Detections\n\n`;
            data.threatIntel.detections.forEach((det: string) => {
                markdown += `- ${det}\n`;
            });
            markdown += `\n`;
        }
    }

    // Network Information
    if (data.networkInfo) {
        markdown += `## Network Information\n\n`;

        if (data.networkInfo.reverseDns) {
            markdown += `**Reverse DNS:** ${data.networkInfo.reverseDns.join(', ')}\n\n`;
        }

        if (data.networkInfo.asn) {
            markdown += `**ASN:**\n`;
            markdown += `- Number: ${data.networkInfo.asn.number}\n`;
            markdown += `- Name: ${data.networkInfo.asn.name}\n`;
            markdown += `- Country: ${data.networkInfo.asn.country}\n\n`;
        }
    }

    // Port Information
    if (data.portInfo?.shodan?.ports) {
        markdown += `## Open Ports\n\n`;
        markdown += data.portInfo.shodan.ports.map((p: number) => `- Port ${p}`).join('\n');
        markdown += `\n`;
    }

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ip-analysis-${data.ip}-${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
}
