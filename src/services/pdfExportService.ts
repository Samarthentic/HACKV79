
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ParsedResume } from '@/services/resumeParsingService';
import { JobMatch } from '@/services/jobs/jobMatchingService';

export const exportJobFitmentToPDF = async (
  containerId: string,
  fileName: string = 'job-fitment-analysis.pdf'
): Promise<void> => {
  try {
    // Get the HTML element to be converted to PDF
    const element = document.getElementById(containerId);
    
    if (!element) {
      throw new Error('Element to export not found');
    }

    // Create canvas from the HTML element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      logging: false,
      useCORS: true,
      allowTaint: true
    });

    // Calculate PDF dimensions based on the canvas
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Create PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // Add canvas as image to PDF
    pdf.addImage(
      canvas.toDataURL('image/png'), 
      'PNG', 
      0, 
      position, 
      imgWidth, 
      imgHeight
    );

    // Handle multi-page content
    let heightLeft = imgHeight;
    position = -pageHeight;

    while (heightLeft > 0) {
      position += pageHeight;
      heightLeft -= pageHeight;
      
      if (heightLeft > 0) {
        pdf.addPage();
        pdf.addImage(
          canvas.toDataURL('image/png'), 
          'PNG', 
          0, 
          position, 
          imgWidth, 
          imgHeight
        );
      }
    }

    // Download the PDF
    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
