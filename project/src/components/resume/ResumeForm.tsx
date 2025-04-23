import React, { useState, useEffect } from 'react';
import { useResume } from '../../context/ResumeContext';
import ContactForm from './forms/ContactForm';
import EducationForm from './forms/EducationForm';
import ExperienceForm from './forms/ExperienceForm';
import SkillsForm from './forms/SkillsForm';
import ProjectsForm from './forms/ProjectsForm';
import { 
  User, BookOpen, Briefcase, Code, Blocks, 
  Lightbulb, CheckSquare, Plus 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Education, Experience, Skill, Project } from '../../types';

interface ResumeFormProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ 
  activeSection, 
  onSectionChange 
}) => {
  const { resumeData, updateSection } = useResume();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  const [contact, setContact] = useState(resumeData?.contact || {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    github: '',
  });

  const [education, setEducation] = useState<Education[]>(resumeData?.education || []);
  const [experience, setExperience] = useState<Experience[]>(resumeData?.experience || []);
  const [skills, setSkills] = useState<Skill[]>(resumeData?.skills || []);
  const [projects, setProjects] = useState<Project[]>(resumeData?.projects || []);
  const [newSkill, setNewSkill] = useState('');
  const [newLevel, setNewLevel] = useState<Skill['level']>('Intermediate');

  useEffect(() => {
    if (resumeData?.contact) {
      setContact(resumeData.contact);
    }
    if (resumeData?.education) {
      setEducation(resumeData.education);
    }
    if (resumeData?.experience) {
      setExperience(resumeData.experience);
    }
    if (resumeData?.skills) {
      setSkills(resumeData.skills);
    }
    if (resumeData?.projects) {
      setProjects(resumeData.projects);
    }
  }, [resumeData]);

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContact(prev => ({
      ...prev,
      [name]: value,
    }));
    updateSection('contact', contact);
  };

  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    const updatedEducation = [...education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };
    setEducation(updatedEducation);
    updateSection('education', updatedEducation);
  };

  const handleAddEducation = () => {
    const newEducation: Education = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
    };
    const updatedEducation = [...education, newEducation];
    setEducation(updatedEducation);
    updateSection('education', updatedEducation);
  };

  const handleRemoveEducation = (index: number) => {
    const updatedEducation = education.filter((_, i) => i !== index);
    setEducation(updatedEducation);
    updateSection('education', updatedEducation);
  };

  const handleExperienceChange = (index: number, field: keyof Experience, value: any) => {
    const updatedExperience = [...experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value,
    };
    setExperience(updatedExperience);
    updateSection('experience', updatedExperience);
  };

  const handleAddExperience = () => {
    const newExperience: Experience = {
      id: `exp-${Date.now()}`,
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      bullets: [''],
    };
    const updatedExperience = [...experience, newExperience];
    setExperience(updatedExperience);
    updateSection('experience', updatedExperience);
  };

  const handleRemoveExperience = (index: number) => {
    const updatedExperience = experience.filter((_, i) => i !== index);
    setExperience(updatedExperience);
    updateSection('experience', updatedExperience);
  };

  const handleBulletChange = (expIndex: number, bulletIndex: number, value: string) => {
    const updatedExperience = [...experience];
    updatedExperience[expIndex].bullets[bulletIndex] = value;
    setExperience(updatedExperience);
    updateSection('experience', updatedExperience);
  };

  const handleAddBullet = (index: number) => {
    const updatedExperience = [...experience];
    updatedExperience[index].bullets.push('');
    setExperience(updatedExperience);
    updateSection('experience', updatedExperience);
  };

  const handleRemoveBullet = (expIndex: number, bulletIndex: number) => {
    const updatedExperience = [...experience];
    updatedExperience[expIndex].bullets = updatedExperience[expIndex].bullets.filter((_, i) => i !== bulletIndex);
    setExperience(updatedExperience);
    updateSection('experience', updatedExperience);
  };

  const handleSkillsChange = (value: string) => {
    setNewSkill(value);
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    
    const skill: Skill = {
      id: `skill-${Date.now()}`,
      name: newSkill.trim(),
      level: newLevel,
    };
    
    const updatedSkills = [...skills, skill];
    setSkills(updatedSkills);
    updateSection('skills', updatedSkills);
    setNewSkill('');
  };

  const handleRemoveSkill = (id: string) => {
    const updatedSkills = skills.filter(skill => skill.id !== id);
    setSkills(updatedSkills);
    updateSection('skills', updatedSkills);
  };

  const handleProjectsChange = (index: number, field: keyof Project, value: any) => {
    const updatedProjects = [...projects];
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value,
    };
    setProjects(updatedProjects);
    updateSection('projects', updatedProjects);
  };

  const handleAddProject = () => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      bullets: [''],
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    updateSection('projects', updatedProjects);
  };

  const handleRemoveProject = (index: number) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    setProjects(updatedProjects);
    updateSection('projects', updatedProjects);
  };

  const handleBulletProjectChange = (projIndex: number, bulletIndex: number, value: string) => {
    const updatedProjects = [...projects];
    updatedProjects[projIndex].bullets[bulletIndex] = value;
    setProjects(updatedProjects);
    updateSection('projects', updatedProjects);
  };

  const handleAddBulletProject = (index: number) => {
    const updatedProjects = [...projects];
    updatedProjects[index].bullets.push('');
    setProjects(updatedProjects);
    updateSection('projects', updatedProjects);
  };

  const handleRemoveBulletProject = (projIndex: number, bulletIndex: number) => {
    const updatedProjects = [...projects];
    updatedProjects[projIndex].bullets = updatedProjects[projIndex].bullets.filter((_, i) => i !== bulletIndex);
    setProjects(updatedProjects);
    updateSection('projects', updatedProjects);
  };
  
  if (!resumeData) return null;

  const saveResume = async () => {
    if (!user) {
      alert('Please log in to save your resume.');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/resume/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          template: 'default',
          data: resumeData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Resume saved successfully:', data.message);
        alert('Resume saved successfully!');
      } else {
        console.error('Failed to save resume:', data.detail);
        alert(`Failed to save resume: ${data.detail}`);
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      alert('Error saving resume. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Define sections and their icons
  const sections = [
    { id: 'contact', name: 'Contact Information', icon: <User className="h-5 w-5" /> },
    { id: 'education', name: 'Education', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'experience', name: 'Experience', icon: <Briefcase className="h-5 w-5" /> },
    { id: 'skills', name: 'Skills', icon: <Code className="h-5 w-5" /> },
    { id: 'projects', name: 'Projects', icon: <Blocks className="h-5 w-5" /> },
  ];
  
  // Render the active form section
  const renderActiveForm = () => {
    switch (activeSection) {
      case 'contact':
        return <ContactForm contact={contact} onChange={handleContactChange} />;
      case 'education':
        return <EducationForm education={education} onChange={handleEducationChange} onAdd={handleAddEducation} onRemove={handleRemoveEducation} />;
      case 'experience':
        return <ExperienceForm experience={experience} onChange={handleExperienceChange} onAdd={handleAddExperience} onRemove={handleRemoveExperience} onBulletChange={handleBulletChange} onAddBullet={handleAddBullet} onRemoveBullet={handleRemoveBullet} />;
      case 'skills':
        return <SkillsForm skills={skills} newSkill={newSkill} newLevel={newLevel} setNewSkill={handleSkillsChange} setNewLevel={setNewLevel} onAdd={handleAddSkill} onRemove={handleRemoveSkill} />;
      case 'projects':
        return <ProjectsForm projects={projects} onChange={handleProjectsChange} onAdd={handleAddProject} onRemove={handleRemoveProject} onBulletChange={handleBulletProjectChange} onAddBullet={handleAddBulletProject} onRemoveBullet={handleRemoveBulletProject} />;
      default:
        return <ContactForm contact={contact} onChange={handleContactChange} />;
    }
  };
  
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
          
          <button
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md whitespace-nowrap"
          >
            <Plus className="h-5 w-5 mr-1.5" />
            Add Section
          </button>
        </nav>
      </div>
      
      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {renderActiveForm()}
      </div>

      <button
        onClick={saveResume}
        disabled={isSaving}
        className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
      >
        {isSaving ? 'Saving...' : 'Save Resume'}
      </button>
    </div>
  );
};

export default ResumeForm;
