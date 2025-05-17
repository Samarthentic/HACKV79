
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Your account information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>User ID:</strong> {user?.id.substring(0, 8)}...</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Resume Status</CardTitle>
                <CardDescription>Your uploaded documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p>No resumes uploaded yet.</p>
                </div>
                <Button asChild>
                  <Link to="/upload">Upload Resume</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Job Matches</CardTitle>
                <CardDescription>Personalized job recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Upload your resume to get job recommendations.</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-talentsleuth/20 text-talentsleuth flex items-center justify-center font-semibold mt-0.5">1</div>
                <div>
                  <h3 className="font-medium">Upload your resume</h3>
                  <p className="text-gray-600">Let our AI analyze your resume and extract key information.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-talentsleuth/20 text-talentsleuth flex items-center justify-center font-semibold mt-0.5">2</div>
                <div>
                  <h3 className="font-medium">Review your resume summary</h3>
                  <p className="text-gray-600">See how employers view your resume and identify improvement areas.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-talentsleuth/20 text-talentsleuth flex items-center justify-center font-semibold mt-0.5">3</div>
                <div>
                  <h3 className="font-medium">Explore job fitment</h3>
                  <p className="text-gray-600">Find jobs that match your skills and experience.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
