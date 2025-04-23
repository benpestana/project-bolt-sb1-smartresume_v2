import React, { useState } from 'react';
import { Project } from '../../../types';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import { 
  Blocks, Plus, ChevronDown, ChevronUp, Trash2, Link
} from 'lucide-react';

interface ProjectsFormProps {
  projects: Project[];
  onChange: (index: number, field: keyof Project, value: any) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onBulletChange: (projIndex: number, bulletIndex: number, value: string) => void;
  onAddBullet: (index: number) => void;
  onRemoveBullet: (projIndex: number, bulletIndex: number) => void;
}

const ProjectsForm: React.FC<ProjectsFormProps> = ({ projects, onChange, onAdd, onRemove, onBulletChange, onAddBullet, onRemoveBullet }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  
  // Toggle expanded state
  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-gray-900">Projects</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onAdd}
          icon={<Plus className="h-4 w-4" />}
        >
          Add Project
        </Button>
      </div>
      
      {projects.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-dashed border-gray-300 text-center">
          <Blocks className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Projects Added</h3>
          <p className="text-gray-500 mb-4">
            Add projects to showcase your skills and accomplishments.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={onAdd}
            icon={<Plus className="h-4 w-4" />}
          >
            Add Project
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project, index) => (
            <div key={project.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Header */}
              <div 
                className="px-6 py-4 cursor-pointer flex justify-between items-center"
                onClick={() => toggleExpanded(index)}
              >
                <div>
                  <h3 className="font-medium text-gray-900">
                    {project.name || 'New Project'}
                  </h3>
                  {project.startDate && (
                    <p className="text-sm text-gray-500">
                      {new Date(project.startDate).toLocaleDateString(undefined, { 
                        year: 'numeric', 
                        month: 'short' 
                      })} - {project.endDate ? new Date(project.endDate).toLocaleDateString(undefined, { 
                        year: 'numeric', 
                        month: 'short' 
                      }) : 'Present'}
                    </p>
                  )}
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(index);
                    }}
                    className="text-gray-400 hover:text-error-500 mr-2"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  {expandedIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>
              
              {/* Expanded Content */}
              {expandedIndex === index && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      id={`name-${index}`}
                      label="Project Name"
                      placeholder="Project Title"
                      value={project.name}
                      onChange={(e) => onChange(index, 'name', e.target.value)}
                    />
                    
                    <Input
                      id={`link-${index}`}
                      label="Project Link (Optional)"
                      placeholder="https://github.com/username/project"
                      value={project.link || ''}
                      onChange={(e) => onChange(index, 'link', e.target.value)}
                      startIcon={<Link className="h-5 w-5 text-gray-400" />}
                    />
                    
                    <Input
                      id={`startDate-${index}`}
                      label="Start Date"
                      type="month"
                      placeholder="YYYY-MM"
                      value={project.startDate}
                      onChange={(e) => onChange(index, 'startDate', e.target.value)}
                    />
                    
                    <Input
                      id={`endDate-${index}`}
                      label="End Date"
                      type="month"
                      placeholder="YYYY-MM"
                      value={project.endDate}
                      onChange={(e) => onChange(index, 'endDate', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        id={`description-${index}`}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        rows={2}
                        placeholder="Brief overview of the project"
                        value={project.description}
                        onChange={(e) => onChange(index, 'description', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Key Features & Accomplishments
                        </label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onAddBullet(index)}
                          icon={<Plus className="h-4 w-4" />}
                        >
                          Add Bullet
                        </Button>
                      </div>
                      
                      {project.bullets.map((bullet, bulletIndex) => (
                        <div key={bulletIndex} className="mb-3">
                          <div className="flex items-start">
                            <div className="mt-2 mr-2 text-gray-400">•</div>
                            <div className="flex-1">
                              <div className="relative">
                                <textarea
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm pr-10"
                                  rows={2}
                                  placeholder="Describe a feature or accomplishment"
                                  value={bullet}
                                  onChange={(e) => onBulletChange(index, bulletIndex, e.target.value)}
                                />
                                <div className="absolute right-0 top-0 pr-3 pt-2">
                                  <button
                                    type="button"
                                    className="text-gray-400 hover:text-error-500"
                                    onClick={() => onRemoveBullet(index, bulletIndex)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsForm;
