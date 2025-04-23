import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useResume } from '../../context/ResumeContext';
import TemplateSelection from '../resume/TemplateSelection';
import ResumeBuilder from '../resume/ResumeBuilder';
import { Plus, Pencil, FileText, LogOut } from 'lucide-react';
import Button from '../ui/Button';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'new' | 'edit'>('dashboard');
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);
  const [savedResumes, setSavedResumes] = useState<{ id: string; name: string; updated: string }[]>([]);
  
  // Fetch saved resumes from localStorage
  useEffect(() => {
    if (!user) return;
    
    const resumes: { id: string; name: string; updated: string }[] = [];
    
    // Scan localStorage for resume data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key && key.startsWith('resume-')) {
        try {
          const resumeData = JSON.parse(localStorage.getItem(key) || '');
          
          if (resumeData.userId === user.id) {
            resumes.push({
              id: resumeData.id,
              name: resumeData.contact.fullName || 'Untitled Resume',
              updated: resumeData.lastUpdated,
            });
          }
        } catch (error) {
          console.error('Error parsing resume data:', error);
        }
      }
    }
    
    // Sort by last updated
    resumes.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());
    setSavedResumes(resumes);
  }, [user]);
  
  // Template selection completed
  const handleTemplateSelectionComplete = (resumeId: string) => {
    setActiveResumeId(resumeId);
    setActiveView('edit');
  };
  
  // Start editing an existing resume
  const handleEditResume = (resumeId: string) => {
    setActiveResumeId(resumeId);
    setActiveView('edit');
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  // Render active view
  const renderActiveView = () => {
    switch (activeView) {
      case 'new':
        return <TemplateSelection onComplete={handleTemplateSelectionComplete} />;
      case 'edit':
        return activeResumeId ? <ResumeBuilder resumeId={activeResumeId} /> : null;
      default:
        return (
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
                  <p className="text-gray-600">Create and manage your professional resumes</p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => setActiveView('new')}
                  icon={<Plus className="h-5 w-5" />}
                >
                  Create New Resume
                </Button>
              </div>
              
              {savedResumes.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h2 className="text-lg font-medium text-gray-900 mb-1">No resumes yet</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Create your first resume to get started on your job search
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setActiveView('new')}
                    icon={<Plus className="h-4 w-4" />}
                  >
                    Create New Resume
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedResumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="p-4">
                        <h3 className="font-medium text-lg">{resume.name}</h3>
                        <p className="text-sm text-gray-500">
                          Last updated: {new Date(resume.updated).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="bg-white p-3 border-t border-gray-200">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditResume(resume.id)}
                          icon={<Pencil className="h-4 w-4" />}
                          fullWidth
                        >
                          Edit Resume
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary-600" />
              <span className="ml-2 font-semibold text-xl text-gray-900">
                Smart Resume Builder
              </span>
            </div>
            
            <div className="flex items-center">
              {activeView !== 'dashboard' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveView('dashboard')}
                  className="mr-4"
                >
                  Back to Dashboard
                </Button>
              )}
              
              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-3">
                  {user?.name || user?.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  icon={<LogOut className="h-4 w-4" />}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main>
        {renderActiveView()}
      </main>
    </div>
  );
};

export default Dashboard;