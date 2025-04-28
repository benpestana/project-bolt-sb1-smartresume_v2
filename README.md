The Smart Resume Builder is an application designed to help college students create professional resumes quickly and easily. The system addresses challenges like formatting, language choices, and domain-specific requirements, providing users with a guided, user-friendly platform to create personalized resumes. 

---------------------------------------------------- Requirements Analysis ---------------------------------------------------

Functional Requirements
Template Selection: Users can choose from pre-designed templates specific to academic domains such as STEM, Business, and Humanities. Templates are customizable to fit personal preferences and career needs.

User Input: The system allows users to fill in templates through structured, fill-in-the-blank fields. These fields automatically populate different sections of the resume.

Dynamic Sections: Users can add or remove sections as needed, tailoring the resume to specific job opportunities.

Non-Functional Requirements
Responsiveness: The application should render input and templates within 5 seconds for a smooth user experience.

Reliability: Autosave functionality ensures that users' work is not lost due to unexpected crashes or network interruptions.

Cross-Platform Compatibility: The application should work across different operating systems and devices to ensure accessibility for a wide range of users.

User Requirements
Simplicity and Guidance: The application guides users through a step-by-step process, ensuring that even those with limited resume-building experience can create a high-quality resume.

Revisability: Users can easily revisit and revise previous inputs, providing flexibility throughout the resume-building process.

Technical Requirements
Frontend: The frontend is developed using TypeScript to provide a modern, interactive user interface. It is responsible for collecting user input and displaying various templates.

Backend: The backend is developed in Python and manages data storage, user authentication, and the dynamic generation of resumes based on user input. A lightweight relational database stores user profiles, templates, and resume drafts.

Project Design
The Smart Resume Builder is structured using a modular architecture, separating the system into two primary components: the frontend and backend.

Frontend (TypeScript)
The frontend is built with TypeScript, chosen for its ability to create interactive web applications with robust type safety and scalability. The interface collects user data via fill-in-the-blank forms and offers a variety of resume templates tailored to academic and professional domains. The user interface is designed with usability and visual appeal in mind, ensuring it is accessible to students regardless of their technical experience.

Backend (Python)
The backend, built in Python, handles processing user input, coordinating data between the frontend and the database. It will support dynamic resume generation by mapping user-provided data to template sections, and it will also manage user authentication and session management. A lightweight relational database stores essential information such as user profiles, template metadata, and resume drafts. The backend is designed for scalability and maintainability, with an emphasis on flexibility as the project evolves.

Setup
To run this project locally, follow these steps:

--------------------------------------------------- Frontend ----------------------------------------------

Install dependencies:

(do this in terminal)

cd project

npm install


Run frontend:

npm run dev

--------------------------------------------------- Backend ----------------------------------------------

Run Backend (you might need to install dependencies)

python -m uvicorn backend.main:app --reload




