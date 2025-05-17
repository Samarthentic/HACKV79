
import React, { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
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

type ResumeData = {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  skills: string[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  experience: {
    title: string;
    company: string;
    period: string;
    description: string;
  }[];
  certifications: {
    name: string;
    issuer: string;
    year: string;
  }[];
};

const fallbackResumeData: ResumeData = {
  personalInfo: {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA"
  },
  skills: [
    "JavaScript", "React", "TypeScript", "Node.js", "GraphQL", "AWS", 
    "Product Management", "Agile", "Team Leadership"
  ],
  education: [
    {
      degree: "Master of Science in Computer Science",
      institution: "Stanford University",
      year: "2018 - 2020"
    },
    {
      degree: "Bachelor of Engineering in Software Engineering",
      institution: "University of California, Berkeley",
      year: "2014 - 2018"
    }
  ],
  experience: [
    {
      title: "Senior Frontend Developer",
      company: "Tech Solutions Inc.",
      period: "2020 - Present",
      description: "Led frontend development for multiple client projects. Improved site performance by 35% through code optimization."
    },
    {
      title: "Software Engineer",
      company: "Innovative Apps LLC",
      period: "2018 - 2020",
      description: "Developed and maintained multiple React applications. Collaborated with design team to implement UI/UX improvements."
    }
  ],
  certifications: [
    {
      name: "AWS Certified Developer - Associate",
      issuer: "Amazon Web Services",
      year: "2021"
    },
    {
      name: "Professional Scrum Master I",
      issuer: "Scrum.org",
      year: "2019"
    }
  ]
};

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
  const [resumeData, setResumeData] = useState<ResumeData>(fallbackResumeData);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Load parsed resume data from session storage
    const loadResumeData = () => {
      const parsedResumeJson = sessionStorage.getItem('parsedResumeData');
      
      if (!parsedResumeJson) {
        toast({
          title: "No parsed resume data",
          description: "Please upload and process your resume first.",
          variant: "destructive"
        });
        navigate('/upload');
        return;
      }

      try {
        const parsedResume = JSON.parse(parsedResumeJson);
        setResumeData(parsedResume);
        setIsLoading(false);
      } catch (error) {
        console.error('Error parsing resume data:', error);
        toast({
          title: "Data error",
          description: "There was an error with your resume data. Using default template.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };

    loadResumeData();
  }, [navigate]);

  const handleSectionUpdate = (section: EditableSection, updatedData: any) => {
    setResumeData({
      ...resumeData,
      [section]: updatedData
    });
    
    // Update session storage with new data
    const updatedResumeData = {
      ...resumeData,
      [section]: updatedData
    };
    sessionStorage.setItem('parsedResumeData', JSON.stringify(updatedResumeData));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 section-padding container mx-auto max-w-4xl py-10">
        <h1 className="text-3xl font-bold mb-6 text-talentsleuth">Resume Summary</h1>
        <p className="text-gray-600 mb-8">
          Here's the information we've extracted from your resume. You can edit any section if needed.
        </p>

        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <Loader className="h-8 w-8 animate-spin text-talentsleuth" />
          </div>
        ) : (
          <>
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
                  {resumeData.certifications && resumeData.certifications.length > 0 ? (
                    resumeData.certifications.map((cert, index) => (
                      <div key={index} className={index > 0 ? "pt-4 border-t" : ""}>
                        <h3 className="font-semibold">{cert.name}</h3>
                        <p className="text-gray-600">{cert.issuer}</p>
                        <p className="text-gray-500 text-sm">{cert.year}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No certifications found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button 
                variant="outline" 
                className="mr-2"
                onClick={() => navigate('/upload')}
              >
                Back
              </Button>
              <Button 
                className="bg-talentsleuth hover:bg-talentsleuth-light"
                onClick={() => navigate('/job-fitment')}
              >
                Continue to Job Matches
              </Button>
            </div>
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default ResumeSummary;
