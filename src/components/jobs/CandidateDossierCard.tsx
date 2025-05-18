
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUser, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CandidateDossier } from '@/services/dossier/candidateDossierService';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface CandidateDossierCardProps {
  dossier: CandidateDossier;
}

const CandidateDossierCard: React.FC<CandidateDossierCardProps> = ({ dossier }) => {
  const [isOpen, setIsOpen] = React.useState(true);
  
  return (
    <Card className="mb-10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileUser className="h-5 w-5 text-purple-500" />
          Candidate Dossier
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary and Score Section */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-2">Summary</h3>
              <p className="text-gray-600">{dossier.summary}</p>
            </div>
            <div className="md:w-48 flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">OVERALL FITMENT</h3>
              <div className="text-4xl font-bold text-purple-700">{dossier.fitmentScore}%</div>
            </div>
          </div>
          
          {/* Key Strengths Section */}
          <div>
            <h3 className="text-lg font-medium mb-3">Key Strengths</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {dossier.keyStrengths.map((strength, idx) => (
                <div key={idx} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>{strength}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Career Trajectory */}
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Career Trajectory</h3>
              <CollapsibleTrigger className="p-1 rounded-full hover:bg-gray-100">
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent>
              <div className="space-y-4">
                {/* Career Path */}
                <div>
                  <h4 className="text-sm uppercase text-gray-500 font-medium mb-2">Career Path</h4>
                  <div className="flex items-center overflow-x-auto py-2">
                    {dossier.careerTrajectory.path.split('→').map((step, idx, arr) => (
                      <React.Fragment key={idx}>
                        <div className="shrink-0 bg-purple-50 border border-purple-100 rounded-lg px-3 py-1 text-sm">
                          {step.trim()}
                        </div>
                        {idx < arr.length - 1 && (
                          <svg className="shrink-0 h-6 w-6 text-purple-300 mx-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                
                {/* Growth Areas */}
                <div>
                  <h4 className="text-sm uppercase text-gray-500 font-medium mb-2">Growth Areas</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {dossier.careerTrajectory.growthAreas.map((area, idx) => (
                      <li key={idx} className="text-gray-600">{area}</li>
                    ))}
                  </ul>
                </div>
                
                {/* Recommendations */}
                <div>
                  <h4 className="text-sm uppercase text-gray-500 font-medium mb-2">Recommendations</h4>
                  <div className="space-y-2">
                    {dossier.careerTrajectory.recommendations.map((rec, idx) => (
                      <div key={idx} className="bg-blue-50 border-l-4 border-blue-300 p-3">
                        <p className="text-blue-800">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateDossierCard;
