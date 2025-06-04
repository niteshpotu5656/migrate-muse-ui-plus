
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  FileDown, 
  FileText, 
  Download,
  Calendar,
  Filter,
  Mail,
  Share,
  FileSpreadsheet,
  FileImage,
  Clock,
  CheckCircle,
  BarChart
} from 'lucide-react';

interface ExportReportsProps {
  migrationHistory?: any[];
}

export const ExportReports: React.FC<ExportReportsProps> = ({ migrationHistory = [] }) => {
  const [selectedReportType, setSelectedReportType] = useState('comprehensive');
  const [selectedMigrations, setSelectedMigrations] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState('last-30-days');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);

  const reportTypes = [
    {
      id: 'comprehensive',
      name: 'Comprehensive Migration Report',
      description: 'Complete overview including performance metrics, validation results, and recommendations',
      icon: FileText,
      size: '2-5 MB'
    },
    {
      id: 'summary',
      name: 'Executive Summary',
      description: 'High-level overview for stakeholders with key metrics and outcomes',
      icon: BarChart,
      size: '500 KB'
    },
    {
      id: 'technical',
      name: 'Technical Details Report',
      description: 'In-depth technical analysis including logs, error details, and system metrics',
      icon: FileSpreadsheet,
      size: '1-3 MB'
    },
    {
      id: 'compliance',
      name: 'Compliance & Audit Report',
      description: 'Security compliance, audit trails, and validation evidence',
      icon: CheckCircle,
      size: '1-2 MB'
    }
  ];

  const recentMigrations = [
    {
      id: 'mig-001',
      name: 'PostgreSQL → MongoDB Migration',
      date: '2024-06-01',
      status: 'completed',
      duration: '4.2h',
      records: '2.4M'
    },
    {
      id: 'mig-002',
      name: 'MySQL → PostgreSQL Migration',
      date: '2024-05-28',
      status: 'completed',
      duration: '2.1h',
      records: '850K'
    },
    {
      id: 'mig-003',
      name: 'Oracle → Elasticsearch Migration',
      date: '2024-05-25',
      status: 'failed',
      duration: '6.3h',
      records: '1.2M'
    }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // In a real implementation, this would generate and download the actual file
    const fileName = `migration-report-${selectedReportType}-${Date.now()}.${exportFormat}`;
    console.log(`Exporting ${fileName} with selected migrations:`, selectedMigrations);
    
    setIsExporting(false);
  };

  const toggleMigrationSelection = (migrationId: string) => {
    setSelectedMigrations(prev =>
      prev.includes(migrationId)
        ? prev.filter(id => id !== migrationId)
        : [...prev, migrationId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center">
            <FileDown className="h-6 w-6 mr-3" />
            Export Migration Reports
          </CardTitle>
          <CardDescription className="text-gray-400">
            Generate comprehensive reports and documentation for your migrations
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Type Selection */}
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Report Type</CardTitle>
              <CardDescription className="text-gray-400">
                Choose the type of report to generate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {reportTypes.map((report) => (
                <div
                  key={report.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedReportType === report.id
                      ? 'bg-blue-500/20 border-blue-500 ring-2 ring-blue-500/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => setSelectedReportType(report.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <report.icon className="h-5 w-5 text-blue-400" />
                      <div>
                        <div className="text-white font-medium">{report.name}</div>
                        <div className="text-sm text-gray-400">{report.description}</div>
                      </div>
                    </div>
                    <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                      {report.size}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Migration Selection */}
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Select Migrations</CardTitle>
              <CardDescription className="text-gray-400">
                Choose which migrations to include in the report
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 mb-4">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-7-days">Last 7 days</SelectItem>
                    <SelectItem value="last-30-days">Last 30 days</SelectItem>
                    <SelectItem value="last-90-days">Last 90 days</SelectItem>
                    <SelectItem value="all-time">All time</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMigrations(recentMigrations.map(m => m.id))}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Select All
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMigrations([])}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Clear All
                </Button>
              </div>

              <div className="space-y-2">
                {recentMigrations.map((migration) => (
                  <div key={migration.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <Checkbox
                      id={migration.id}
                      checked={selectedMigrations.includes(migration.id)}
                      onCheckedChange={() => toggleMigrationSelection(migration.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={migration.id} className="text-white font-medium cursor-pointer">
                          {migration.name}
                        </Label>
                        <Badge className={`${
                          migration.status === 'completed' 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}>
                          {migration.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-400">
                        {migration.date} • {migration.duration} • {migration.records} records
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Export Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Export Format</Label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="xlsx">Excel Spreadsheet</SelectItem>
                      <SelectItem value="csv">CSV Data</SelectItem>
                      <SelectItem value="json">JSON Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Include Attachments</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="logs" defaultChecked />
                      <Label htmlFor="logs" className="text-gray-400">Migration logs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="schemas" defaultChecked />
                      <Label htmlFor="schemas" className="text-gray-400">Schema diagrams</Label>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-white/10" />

              <div className="space-y-2">
                <Label className="text-white">Additional Notes</Label>
                <Textarea
                  placeholder="Add any additional context or notes for this report..."
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Summary & Actions */}
        <div className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Export Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Report Type:</span>
                  <span className="text-white text-sm">
                    {reportTypes.find(r => r.id === selectedReportType)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Migrations:</span>
                  <span className="text-white">{selectedMigrations.length} selected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Format:</span>
                  <span className="text-white">{exportFormat.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Est. Size:</span>
                  <span className="text-white">
                    {reportTypes.find(r => r.id === selectedReportType)?.size}
                  </span>
                </div>
              </div>

              <Separator className="bg-white/10" />

              <Button
                onClick={handleExport}
                disabled={selectedMigrations.length === 0 || isExporting}
                className="w-full bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
              >
                {isExporting ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </>
                )}
              </Button>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email Report
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  <Share className="h-4 w-4 mr-2" />
                  Share Link
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-white/20 text-white hover:bg-white/10 justify-start"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Report
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-white/20 text-white hover:bg-white/10 justify-start"
              >
                <Filter className="h-4 w-4 mr-2" />
                Save Template
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
