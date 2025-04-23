from pydantic import BaseModel

class User(BaseModel):
    email: str
    password: str

class Resume(BaseModel):
    email: str
    template: str
    data: dict
