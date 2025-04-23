import React, { useState } from 'react';
import { templates } from '../../data/templates';
import { Template, TemplateCategory } from '../../types';
import { useResume } from '../../context/ResumeContext';
import Button from '../ui/Button';
import { FileText, CheckCircle } from 'lucide-react';

const TemplateSelection: React.FC<{ onComplete: (resumeId: string) => void }> = ({ onComplete }) => {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>('STEM');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const { createResume, loading } = useResume();
  
  // Filter templates by selected category
  const filteredTemplates = templates.filter(template => template.category === selectedCategory);
  
  const handleCreateResume = async () => {
    if (!selectedTemplate) return;
    
    try {
      const resumeId = await createResume(selectedTemplate.id);
      onComplete(resumeId);
    } catch (error) {
      console.error('Error creating resume:', error);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Choose a Resume Template</h1>
      
      {/* Category Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          {(['STEM', 'Business', 'Humanities'] as TemplateCategory[]).map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm font-medium ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } ${
                category === 'STEM'
                  ? 'rounded-l-md'
                  : category === 'Humanities'
                  ? 'rounded-r-md'
                  : ''
              } border border-gray-300`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => setSelectedTemplate(template)}
            className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 transform ${
              selectedTemplate?.id === template.id ? 'ring-4 ring-primary-500 scale-[1.02]' : 'hover:scale-[1.01]'
            }`}
          >
            {/* Template Preview Image */}
            <div className="aspect-[8.5/11] bg-gray-100 relative">
              <img
                src={template.preview}
                alt={template.name}
                className="w-full h-full object-cover"
              />
              
              {selectedTemplate?.id === template.id && (
                <div className="absolute top-2 right-2 bg-primary-500 text-white rounded-full p-1">
                  <CheckCircle className="h-6 w-6" />
                </div>
              )}
            </div>
            
            {/* Template Name */}
            <div className="p-4 bg-white border border-gray-200 border-t-0">
              <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
              <p className="text-gray-500 text-sm">Perfect for {template.category} majors</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Action Button */}
      <div className="flex justify-center">
        <Button
          variant="primary"
          size="lg"
          isLoading={loading}
          disabled={!selectedTemplate}
          onClick={handleCreateResume}
          icon={<FileText className="h-5 w-5" />}
        >
          Create Resume with this Template
        </Button>
      </div>
    </div>
  );
};

export default TemplateSelection;