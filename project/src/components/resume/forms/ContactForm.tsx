import React from 'react';
import Input from '../../ui/Input';
import { 
  User, Mail, Phone, MapPin, Linkedin, Globe, Github 
} from 'lucide-react';

interface Contact {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
  github?: string;
}

interface ContactFormProps {
  contact: Contact;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ contact, onChange }) => {
  return (
    <div className="space-y-6 max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-medium text-gray-900">Contact Information</h2>
      <p className="text-sm text-gray-500 mb-6">
        This information will appear at the top of your resume.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          id="fullName"
          name="fullName"
          label="Full Name"
          placeholder="John Doe"
          value={contact.fullName}
          onChange={onChange}
          startIcon={<User className="h-5 w-5 text-gray-400" />}
          required
        />
        
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          value={contact.email}
          onChange={onChange}
          startIcon={<Mail className="h-5 w-5 text-gray-400" />}
          required
        />
        
        <Input
          id="phone"
          name="phone"
          label="Phone"
          placeholder="(123) 456-7890"
          value={contact.phone || ''}
          onChange={onChange}
          startIcon={<Phone className="h-5 w-5 text-gray-400" />}
        />
        
        <Input
          id="location"
          name="location"
          label="Location"
          placeholder="City, State"
          value={contact.location || ''}
          onChange={onChange}
          startIcon={<MapPin className="h-5 w-5 text-gray-400" />}
        />
        
        <Input
          id="linkedin"
          name="linkedin"
          label="LinkedIn"
          placeholder="linkedin.com/in/username"
          value={contact.linkedin || ''}
          onChange={onChange}
          startIcon={<Linkedin className="h-5 w-5 text-gray-400" />}
        />
        
        <Input
          id="website"
          name="website"
          label="Personal Website"
          placeholder="yourwebsite.com"
          value={contact.website || ''}
          onChange={onChange}
          startIcon={<Globe className="h-5 w-5 text-gray-400" />}
        />
        
        <Input
          id="github"
          name="github"
          label="GitHub"
          placeholder="github.com/username"
          value={contact.github || ''}
          onChange={onChange}
          startIcon={<Github className="h-5 w-5 text-gray-400" />}
        />
      </div>
    </div>
  );
};

export default ContactForm;
