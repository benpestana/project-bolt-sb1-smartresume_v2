from fastapi import FastAPI, HTTPException
from backend.models import User, Resume

app = FastAPI()

# In-memory database
users = {}
resumes = {}

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/signup/")
async def create_user(user: User):
    if user.email in users:
        raise HTTPException(status_code=400, detail="Email already registered")
    users[user.email] = user
    return {"message": "User created successfully"}

@app.post("/login/")
async def login_user(user: User):
    if user.email not in users:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    if users[user.email].password != user.password:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    return {"message": "Login successful"}

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
