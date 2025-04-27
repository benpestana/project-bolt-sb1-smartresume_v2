import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from models import User, Resume
from typing import List, Dict # Import List and Dict

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory database: Store a list of resumes per user email
resumes: Dict[str, List[Resume]] = {} # Change resumes to store a list

# In-memory database for users
users = {}

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/signup/")
async def create_user(user: User):
    print(f"Received signup request for email: {user.email}")
    import uuid
    if user.email in users:
        print(f"Email {user.email} already registered")
        raise HTTPException(status_code=400, detail="Email already registered")
    user.id = str(uuid.uuid4())
    users[user.email] = user
    # Initialize an empty list of resumes for the new user
    resumes[user.email] = [] 
    print(f"User {user.email} created successfully")
    # Return the created user object
    return {"id": user.id, "email": user.email, "name": user.name}

class LoginCredentials(BaseModel):
    email: str
    password: str

@app.post("/login/")
async def login_user(credentials: LoginCredentials):
    if credentials.email not in users:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    if users[credentials.email].password != credentials.password:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    user = users[credentials.email]
    print(f"Login successful for user: {user}")
    return {"id": user.id, "email": user.email, "name": user.name}

@app.post("/resume/")
async def save_resume(resume: Resume):
    if resume.email not in resumes:
        # This should not happen if user is logged in and resumes list is initialized
        raise HTTPException(status_code=400, detail="User not found or resumes list not initialized")
    
    user_resumes = resumes[resume.email]
    
    # Check if resume with this ID already exists
    existing_resume_index = -1
    for i, existing_resume in enumerate(user_resumes):
        if existing_resume.id == resume.id:
            existing_resume_index = i
            break
            
    if existing_resume_index != -1:
        # Update existing resume
        user_resumes[existing_resume_index] = resume
        print(f"Resume with ID {resume.id} updated successfully for user {resume.email}")
    else:
        # Add new resume
        user_resumes.append(resume)
        print(f"New resume with ID {resume.id} added successfully for user {resume.email}")
        
    return {"message": "Resume saved successfully"}

# Change this endpoint to return a list of resumes for the user
@app.get("/resumes/{email}", response_model=List[Resume]) # New endpoint path and response model
async def get_all_resumes(email: str):
    if email not in resumes:
        # Return empty list if user not found or no resumes
        return [] 
    
    # Return the list of resumes for the user
    return resumes[email]

# Remove the old get_resume endpoint as we now get all resumes
# @app.get("/resume/{email}")
# async def get_resume(email: str):
#     if email not in resumes:
#         raise HTTPException(status_code=404, detail="Resume not found")
#     return resumes[email].data


@app.get("/api/message")
async def get_message():
    return {"message": "Hello from the backend!"}

class ExportRequest(BaseModel):
    email: str
    template: str
    data: Resume
    format: str # 'pdf' or 'docx'

@app.post("/export/")
async def export_resume(request: ExportRequest):
    print(f"Received export request for email: {request.email}, format: {request.format}")
    # In a real application, this would generate the file
    # For now, we just return a success message
    return {"message": f"Mock export successful for {request.format.upper()}."}
