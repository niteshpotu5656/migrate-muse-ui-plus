
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  FileDown, 
  FileText, 
  Database, 
  Image,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

interface ExportConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: string;
  migrationData?: any;
}

export const ExportConfirmationModal: React.FC<ExportConfirmationModalProps> = ({
  isOpen,
  onClose,
  reportType,
  migrationData
}) => {
  const [format, setFormat] = useState('pdf');
  const [includeDetails, setIncludeDetails] = useState(true);
  const [includeLogs, setIncludeLogs] = useState(false);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const formatOptions = [
    { value: 'pdf', label: 'PDF Document', icon: FileText, description: 'Formatted report with charts and graphs' },
    { value: 'csv', label: 'CSV Export', icon: Database, description: 'Raw data in spreadsheet format' },
    { value: 'json', label: 'JSON Data', icon: FileText, description: 'Structured data for API integration' },
    { value: 'html', label: 'HTML Report', icon: Image, description: 'Web-viewable report with interactive elements' }
  ];

  const selectedFormat = formatOptions.find(f => f.value === format);

  const generateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate download
    const fileName = `${reportType}-report-${Date.now()}.${format}`;
    
    toast({
      title: "Report Generated Successfully",
      description: `${fileName} has been downloaded to your device.`,
      duration: 5000,
    });
    
    setIsGenerating(false);
    onClose();
  };

  const getEstimatedSize = () => {
    const baseSize = format === 'pdf' ? 2.5 : format === 'csv' ? 0.8 : format === 'json' ? 1.2 : 3.1;
    const multiplier = (includeDetails ? 1.5 : 1) * (includeLogs ? 2 : 1) * (includeCharts ? 1.3 : 1);
    return (baseSize * multiplier).toFixed(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-white">
            <FileDown className="h-5 w-5 mr-2" />
            Export {reportType} Report
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Configure your report settings and download options
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label className="text-white">Export Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-white/20">
                {formatOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {selectedFormat && (
              <p className="text-sm text-gray-400">{selectedFormat.description}</p>
            )}
          </div>

          {/* Include Options */}
          <div className="space-y-3">
            <Label className="text-white">Include in Report</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="details" 
                  checked={includeDetails}
                  onCheckedChange={(checked) => setIncludeDetails(checked === true)}
                />
                <Label htmlFor="details" className="text-sm text-gray-300">
                  Detailed Analysis & Metrics
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="logs" 
                  checked={includeLogs}
                  onCheckedChange={(checked) => setIncludeLogs(checked === true)}
                />
                <Label htmlFor="logs" className="text-sm text-gray-300">
                  Migration Logs & Timeline
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="charts" 
                  checked={includeCharts}
                  onCheckedChange={(checked) => setIncludeCharts(checked === true)}
                />
                <Label htmlFor="charts" className="text-sm text-gray-300">
                  Visual Charts & Graphs
                </Label>
              </div>
            </div>
          </div>

          {/* Report Summary */}
          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">Report Summary</span>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                {selectedFormat?.label}
              </Badge>
            </div>
            <div className="space-y-1 text-sm text-gray-400">
              <div className="flex justify-between">
                <span>Estimated Size:</span>
                <span>{getEstimatedSize()} MB</span>
              </div>
              <div className="flex justify-between">
                <span>Generation Time:</span>
                <span>~30 seconds</span>
              </div>
              <div className="flex justify-between">
                <span>Data Sources:</span>
                <span>{reportType === 'Migration' ? '3' : '2'} databases</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1 border-white/20 text-white hover:bg-white/10"
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button 
              onClick={generateReport}
              disabled={isGenerating}
              className="flex-1 bg-white text-gray-900 font-semibold hover:bg-gray-100"
            >
              {isGenerating ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileDown className="h-4 w-4 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
          </div>

          {/* Security Notice */}
          <div className="flex items-start space-x-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded">
            <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5" />
            <p className="text-xs text-yellow-300">
              Reports may contain sensitive database information. Ensure secure handling.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
