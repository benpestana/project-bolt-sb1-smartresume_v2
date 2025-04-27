import React, { useState, useEffect, useCallback } from 'react';
import { useResume } from '../../context/ResumeContext';
import ContactForm from './forms/ContactForm';
import EducationForm from './forms/EducationForm';
import ExperienceForm from './forms/ExperienceForm';
import SkillsForm from './forms/SkillsForm';
import ProjectsForm from './forms/ProjectsForm';
import {
  User, BookOpen, Briefcase, Code, Blocks,
  Lightbulb, CheckSquare, Plus, Save
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Education, Experience, Skill, Project, Contact, ResumeData } from '../../types';
import Button from '../ui/Button'; // Import Button component

interface ResumeFormProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({
  activeSection,
  onSectionChange
}) => {
  // Get necessary items from context, including saveResume
  const { resumeData, updateSection, loading: isResumeLoading, saveResume: contextSaveResume } = useResume();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Local state for each section, initialized from context
  const [contact, setContact] = useState<Contact>(resumeData?.contact || {
    fullName: '', email: '', phone: '', location: '', linkedin: '', website: '', github: '',
  });
  const [education, setEducation] = useState<Education[]>(resumeData?.education || []);
  const [experience, setExperience] = useState<Experience[]>(resumeData?.experience || []);
  const [skills, setSkills] = useState<Skill[]>(resumeData?.skills || []);
  const [projects, setProjects] = useState<Project[]>(resumeData?.projects || []);

  // State for adding new skills
  const [newSkill, setNewSkill] = useState('');
  const [newLevel, setNewLevel] = useState<Skill['level']>('Intermediate');

  // Effect to update local state when resumeData from context changes (e.g., after initial load or save)
  // This ensures the form reflects the latest data from the context
  useEffect(() => {
    if (resumeData) {
      setContact(resumeData.contact || { fullName: '', email: '', phone: '', location: '', linkedin: '', website: '', github: '' });
      setEducation(resumeData.education || []);
      setExperience(resumeData.experience || []);
      setSkills(resumeData.skills || []);
      setProjects(resumeData.projects || []);
    }
  }, [resumeData]);

  // --- Handler Functions (Update Local State ONLY) ---

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContact(prev => ({ ...prev, [name]: value }));
  };

  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    setEducation(prev => prev.map((edu, i) => i === index ? { ...edu, [field]: value } : edu));
  };

  const handleAddEducation = () => {
    const newEducation: Education = {
      id: `edu-${Date.now()}`, institution: '', degree: '', field: '', startDate: '', endDate: '',
    };
    setEducation(prev => [...prev, newEducation]);
  };

  const handleRemoveEducation = (index: number) => {
    setEducation(prev => prev.filter((_, i) => i !== index));
  };

  const handleExperienceChange = (index: number, field: keyof Experience, value: any) => {
    setExperience(prev => prev.map((exp, i) => i === index ? { ...exp, [field]: value } : exp));
  };

  const handleAddExperience = () => {
    const newExperience: Experience = {
      id: `exp-${Date.now()}`, company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '', bullets: [''],
    };
    setExperience(prev => [...prev, newExperience]);
  };

  const handleRemoveExperience = (index: number) => {
    setExperience(prev => prev.filter((_, i) => i !== index));
  };

  const handleBulletChange = (expIndex: number, bulletIndex: number, value: string) => {
     setExperience(prev => prev.map((exp, i) => {
        if (i === expIndex) {
            const updatedBullets = [...exp.bullets];
            updatedBullets[bulletIndex] = value;
            return { ...exp, bullets: updatedBullets };
        }
        return exp;
     }));
  };

  const handleAddBullet = (index: number) => {
    setExperience(prev => prev.map((exp, i) => i === index ? { ...exp, bullets: [...exp.bullets, ''] } : exp));
  };

  const handleRemoveBullet = (expIndex: number, bulletIndex: number) => {
    setExperience(prev => prev.map((exp, i) => {
        if (i === expIndex) {
            return { ...exp, bullets: exp.bullets.filter((_, bi) => bi !== bulletIndex) };
        }
        return exp;
    }));
  };

  const handleSkillsChange = (value: string) => {
    setNewSkill(value);
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    const skill: Skill = {
      id: `skill-${Date.now()}`, name: newSkill.trim(), level: newLevel,
    };
    setSkills(prev => [...prev, skill]);
    setNewSkill(''); // Reset input field
  };

  const handleRemoveSkill = (id: string) => {
    setSkills(prev => prev.filter(skill => skill.id !== id));
  };

  const handleProjectsChange = (index: number, field: keyof Project, value: any) => {
    setProjects(prev => prev.map((proj, i) => i === index ? { ...proj, [field]: value } : proj));
  };

  const handleAddProject = () => {
    const newProject: Project = {
      id: `proj-${Date.now()}`, name: '', description: '', startDate: '', endDate: '', bullets: [''],
    };
    setProjects(prev => [...prev, newProject]);
  };

  const handleRemoveProject = (index: number) => {
    setProjects(prev => prev.filter((_, i) => i !== index));
  };

  const handleBulletProjectChange = (projIndex: number, bulletIndex: number, value: string) => {
     setProjects(prev => prev.map((proj, i) => {
        if (i === projIndex) {
            const updatedBullets = [...proj.bullets];
            updatedBullets[bulletIndex] = value;
            return { ...proj, bullets: updatedBullets };
        }
        return proj;
     }));
  };

  const handleAddBulletProject = (index: number) => {
    setProjects(prev => prev.map((proj, i) => i === index ? { ...proj, bullets: [...proj.bullets, ''] } : proj));
  };

  const handleRemoveBulletProject = (projIndex: number, bulletIndex: number) => {
     setProjects(prev => prev.map((proj, i) => {
        if (i === projIndex) {
            return { ...proj, bullets: proj.bullets.filter((_, bi) => bi !== bulletIndex) };
        }
        return proj;
    }));
  };

  // --- Manual Save Function (Calls Context Save) ---
  const handleSave = async () => {
    if (!user || !resumeData) {
      alert('Please log in and ensure resume data is loaded before saving.');
      return;
    }

    setIsSaving(true);
    try {
      // Construct the data to send using the current local state
      const dataToSave: ResumeData = {
          ...resumeData, // Start with existing resumeData (includes id, userId, templateId, etc.)
          contact, // Override with latest local state
          education,
          experience,
          skills,
          projects,
          // additionalSections are already part of resumeData if they exist
      };

      // Call the context's saveResume function with the local state data
      await contextSaveResume(dataToSave);

      // No need to manually update local state here, useEffect will handle it when context updates

      alert('Resume saved successfully!');

    } catch (error) {
      console.error('Error saving resume:', error);
      alert('Error saving resume. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };


  // --- Render Logic ---
  const sections = [
    { id: 'contact', name: 'Contact Information', icon: <User className="h-5 w-5" /> },
    { id: 'education', name: 'Education', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'experience', name: 'Experience', icon: <Briefcase className="h-5 w-5" /> },
    { id: 'skills', name: 'Skills', icon: <Code className="h-5 w-5" /> },
    { id: 'projects', name: 'Projects', icon: <Blocks className="h-5 w-5" /> },
  ];

  const renderActiveForm = () => {
    // Pass local state and handlers to child forms
    switch (activeSection) {
      case 'contact':
        return <ContactForm contact={contact} onChange={handleContactChange} />;
      case 'education':
        return <EducationForm education={education} onChange={handleEducationChange} onAdd={handleAddEducation} onRemove={handleRemoveEducation} />;
      case 'experience':
        return <ExperienceForm experience={experience} onChange={handleExperienceChange} onAdd={handleAddExperience} onRemove={handleRemoveExperience} onBulletChange={handleBulletChange} onAddBullet={handleAddBullet} onRemoveBullet={handleRemoveBullet} />;
      case 'skills':
        // Pass setNewLevel directly if SkillsForm needs it
        return <SkillsForm skills={skills} newSkill={newSkill} newLevel={newLevel} setNewSkill={handleSkillsChange} setNewLevel={setNewLevel} onAdd={handleAddSkill} onRemove={handleRemoveSkill} />;
      case 'projects':
        return <ProjectsForm projects={projects} onChange={handleProjectsChange} onAdd={handleAddProject} onRemove={handleRemoveProject} onBulletChange={handleBulletProjectChange} onAddBullet={handleAddBulletProject} onRemoveBullet={handleRemoveBulletProject} />;
      default:
        return <ContactForm contact={contact} onChange={handleContactChange} />;
    }
  };

  if (isResumeLoading) {
      return <div>Loading resume data...</div>; // Show loading state
  }

  return (
    <div className="flex flex-col h-full">
      {/* Section Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <nav className="flex space-x-4 overflow-x-auto pb-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                activeSection === section.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="mr-1.5">{section.icon}</span>
              {section.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {renderActiveForm()}
      </div>

      {/* Save Button moved to Form */}
      <button
        onClick={handleSave}
        disabled={isSaving || isResumeLoading} // Disable save while loading or saving
        className="mt-4 w-full bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 disabled:opacity-50"
      >
        {isSaving ? 'Saving...' : 'Save Resume'}
      </button>
    </div>
  );
};

export default ResumeForm;
