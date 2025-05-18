
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { exportJobFitmentToPDF } from '@/services/pdfExportService';

interface JobFitmentExportProps {
  contentRef: React.RefObject<HTMLDivElement>;
}

const JobFitmentExport: React.FC<JobFitmentExportProps> = ({ contentRef }) => {
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExportPDF = async () => {
    if (!contentRef.current) return;
    
    try {
      setIsExporting(true);
      await exportJobFitmentToPDF('fitment-content', `job-fitment-${Date.now()}.pdf`);
      toast({
        title: "PDF Export Successful",
        description: "Your job fitment analysis has been downloaded as a PDF.",
      });
    } catch (error) {
      toast({
        title: "PDF Export Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleExportPDF}
      disabled={isExporting}
    >
      <Download className="mr-2 h-4 w-4" />
      {isExporting ? "Exporting..." : "Export as PDF"}
    </Button>
  );
};

export default JobFitmentExport;
