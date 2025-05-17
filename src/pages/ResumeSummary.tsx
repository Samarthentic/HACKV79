
import React, { useState, useEffect } from 'react';
import { Edit, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { getResumeData, saveResumeData, ParsedResume } from '@/services/resumeParsingService';
import { Skeleton } from '@/components/ui/skeleton';

type EditableSection = 'personalInfo' | 'skills' | 'education' | 'experience' | 'certifications';
type EditDialogProps = {
  title: string;
  content: any;
  onSave: (updatedContent: any) => void;
};

const EditDialog = ({ title, content, onSave }: EditDialogProps) => {
  const [editedContent, setEditedContent] = useState(content);
  
  const handleSave = () => {
    onSave(editedContent);
    toast({
      title: "Changes saved",
      description: `Your ${title.toLowerCase()} has been updated.`,
    });
  };

  // Determine the type of editor based on content structure
  const renderEditor = () => {
    if (typeof content === 'string' || typeof content === 'number') {
      return (
        <Input
          value={editedContent as string}
          onChange={(e) => setEditedContent(e.target.value)}
          className="h-10"
        />
      );
    } else if (Array.isArray(content) && typeof content[0] === 'string') {
      // For arrays of strings like skills
      return (
        <Textarea
          value={(editedContent as string[]).join(', ')}
          onChange={(e) => setEditedContent(e.target.value.split(', '))}
          className="min-h-[120px]"
          placeholder="Separate items with commas"
        />
      );
    } else {
      // For objects or complex arrays, use JSON representation
      return (
        <Textarea
          value={JSON.stringify(editedContent, null, 2)}
          onChange={(e) => {
            try {
              setEditedContent(JSON.parse(e.target.value));
            } catch (error) {
              // Allow incomplete JSON while typing
            }
          }}
          className="min-h-[200px] font-mono text-sm"
        />
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit {title}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit {title}</DialogTitle>
          <DialogDescription>
            Make changes to your {title.toLowerCase()} information. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {renderEditor()}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ResumeSummary = () => {
  const [resumeData, setResumeData] = useState<ParsedResume | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the resume data when the component mounts
    const fetchResumeData = async () => {
      try {
        const data = await getResumeData();
        if (data) {
          setResumeData(data);
        } else {
          toast({
            title: "Resume data not found",
            description: "Please upload and process your resume first.",
            variant: "destructive",
          });
          navigate('/upload');
        }
      } catch (error) {
        console.error("Error fetching resume data:", error);
        toast({
          title: "Error fetching resume data",
          description: "There was an error retrieving your resume data.",
          variant: "destructive",
        });
        navigate('/upload');
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, [navigate]);

  const handleSectionUpdate = async (section: EditableSection, updatedData: any) => {
    if (!resumeData) return;

    const updatedResumeData = {
      ...resumeData,
      [section]: updatedData
    };
    
    setResumeData(updatedResumeData);
    
    try {
      // Save the updated resume data
      await saveResumeData(updatedResumeData);
    } catch (error) {
      console.error("Error saving updated resume data:", error);
      toast({
        title: "Error saving changes",
        description: "There was an error saving your changes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    navigate('/upload');
  };

  const handleContinue = () => {
    navigate('/job-fitment');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 section-padding container mx-auto max-w-4xl py-10">
          <h1 className="text-3xl font-bold mb-6 text-talentsleuth">Resume Summary</h1>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <Card key={index} className="mb-6">
                <CardHeader className="pb-3">
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 section-padding container mx-auto max-w-4xl py-10 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-talentsleuth">No Resume Data Found</h1>
            <p className="text-gray-600 mb-6">
              Please upload and process your resume first to view the summary.
            </p>
            <Button 
              className="bg-talentsleuth hover:bg-talentsleuth-light"
              onClick={() => navigate('/upload')}
            >
              Upload Resume
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 section-padding container mx-auto max-w-4xl py-10">
        <h1 className="text-3xl font-bold mb-6 text-talentsleuth">Resume Summary</h1>
        <p className="text-gray-600 mb-8">
          Here's the information we've extracted from your resume. You can edit any section if needed.
        </p>

        {/* Personal Information */}
        <Card className="mb-6">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle>Personal Information</CardTitle>
            <EditDialog 
              title="Personal Information"
              content={resumeData.personalInfo}
              onSave={(updated) => handleSectionUpdate('personalInfo', updated)}
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h3 className="font-bold text-xl">{resumeData.personalInfo.name}</h3>
              <div className="text-gray-600 grid gap-1">
                <p>{resumeData.personalInfo.email}</p>
                <p>{resumeData.personalInfo.phone}</p>
                <p>{resumeData.personalInfo.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="mb-6">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle>Skills</CardTitle>
            <EditDialog 
              title="Skills"
              content={resumeData.skills}
              onSave={(updated) => handleSectionUpdate('skills', updated)}
            />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <span 
                  key={index}
                  className="bg-talentsleuth/10 text-talentsleuth px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Education */}
        <Card className="mb-6">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle>Education</CardTitle>
            <EditDialog 
              title="Education"
              content={resumeData.education}
              onSave={(updated) => handleSectionUpdate('education', updated)}
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resumeData.education.map((edu, index) => (
                <div key={index} className={index > 0 ? "pt-4 border-t" : ""}>
                  <h3 className="font-semibold">{edu.degree}</h3>
                  <p className="text-gray-600">{edu.institution}</p>
                  <p className="text-gray-500 text-sm">{edu.year}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Experience */}
        <Card className="mb-6">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle>Experience</CardTitle>
            <EditDialog 
              title="Experience"
              content={resumeData.experience}
              onSave={(updated) => handleSectionUpdate('experience', updated)}
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {resumeData.experience.map((exp, index) => (
                <div key={index} className={index > 0 ? "pt-6 border-t" : ""}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{exp.title}</h3>
                    <span className="text-gray-500 text-sm">{exp.period}</span>
                  </div>
                  <p className="text-gray-600">{exp.company}</p>
                  <p className="text-gray-700 mt-2 text-sm">{exp.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card className="mb-10">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle>Certifications</CardTitle>
            <EditDialog 
              title="Certifications"
              content={resumeData.certifications}
              onSave={(updated) => handleSectionUpdate('certifications', updated)}
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resumeData.certifications.map((cert, index) => (
                <div key={index} className={index > 0 ? "pt-4 border-t" : ""}>
                  <h3 className="font-semibold">{cert.name}</h3>
                  <p className="text-gray-600">{cert.issuer}</p>
                  <p className="text-gray-500 text-sm">{cert.year}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button 
            className="bg-talentsleuth hover:bg-talentsleuth-light flex items-center gap-2"
            onClick={handleContinue}
          >
            Continue to Job Matches
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ResumeSummary;
