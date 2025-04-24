from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from models import User, Resume

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory database
users = {}
resumes = {}

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
    resumes[resume.email] = resume
    return {"message": "Resume saved successfully"}

@app.get("/resume/{email}")
async def get_resume(email: str):
    if email not in resumes:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resumes[email].data

@app.get("/api/message")
async def get_message():
    return {"message": "Hello from the backend!"}
