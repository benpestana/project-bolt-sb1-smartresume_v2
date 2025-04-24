import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useResume } from '../../context/ResumeContext';
import TemplateSelection from '../resume/TemplateSelection';
import ResumeBuilder from '../resume/ResumeBuilder';
import { Plus, Pencil, FileText, LogOut } from 'lucide-react';
import Button from '../ui/Button';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  // Use resumeData and loading from ResumeContext
  const { resumeData, loading, loadResume, createResume } = useResume();
  // Determine initial view based on whether resumeData is already loaded
  const [activeView, setActiveView] = useState<'dashboard' | 'new' | 'edit'>(
    resumeData ? 'edit' : 'dashboard'
  );

  // Load resume when user logs in or component mounts
  useEffect(() => {
    if (user?.email && !resumeData) { // Only load if user exists and no resumeData is loaded yet
      loadResume();
    }
  }, [user, loadResume, resumeData]); // Depend on user, loadResume, and resumeData

  // Template selection completed - create a new resume locally and switch to edit
  const handleTemplateSelectionComplete = async (templateId: string) => {
     // createResume is now handled in ResumeContext and sets resumeData
     // The useEffect above will handle loading if needed, but createResume sets data directly
     await createResume(templateId);
     setActiveView('edit'); // Switch to edit view after creating
  };

  // Start editing the loaded resume
  const handleEditResume = () => {
    // If resumeData exists, switch to edit view
    if (resumeData) {
      setActiveView('edit');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      // Optionally clear resume data or navigate to login page
      // setResumeData(null); // This might be handled by AuthContext effect in ResumeContext
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Render active view
  const renderActiveView = () => {
    switch (activeView) {
      case 'new':
        // Pass the createResume function from context to TemplateSelection
        return <TemplateSelection onComplete={handleTemplateSelectionComplete} />;
      case 'edit':
        // Pass the resumeData from context to ResumeBuilder
        // resumeId prop might still be needed by ResumeBuilder, pass resumeData.id
        return resumeData ? <ResumeBuilder resumeId={resumeData.id} /> : null;
      default: // 'dashboard' view
        return (
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
                  <p className="text-gray-600">Create and manage your professional resumes</p>
                </div>
                {/* Create New Resume button */}
                <Button
                  variant="primary"
                  onClick={() => setActiveView('new')}
                  icon={<Plus className="h-5 w-5" />}
                  disabled={loading} // Disable while loading
                >
                  Create New Resume
                </Button>
              </div>

              {loading ? (
                 <div className="flex justify-center items-center h-64">
                   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                 </div>
              ) : (
                // Display the single loaded resume or the "no resumes" message
                resumeData ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Display the single resume */}
                    <div
                      key={resumeData.id}
                      className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="p-4">
                        <h3 className="font-medium text-lg">{resumeData.contact.fullName || 'Untitled Resume'}</h3>
                        <p className="text-sm text-gray-500">
                          Last updated: {new Date(resumeData.lastUpdated).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="bg-white p-3 border-t border-gray-200">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleEditResume} // Edit the loaded resume
                          icon={<Pencil className="h-4 w-4" />}
                          fullWidth
                        >
                          Edit Resume
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // No resumes found
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
                )
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
