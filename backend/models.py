from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    id: Optional[str] = None # Make ID optional during creation, assign later
    email: str
    password: str
    name: str

class Resume(BaseModel):
    email: str
    template: str
    data: dict
