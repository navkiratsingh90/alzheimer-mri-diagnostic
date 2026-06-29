from pydantic import BaseModel
from datetime import datetime

class ChatMessageCreate(BaseModel):
    question: str
    answer: str

class ChatMessageResponse(BaseModel):
    id: int
    question: str
    answer: str
    timestamp: datetime

    class Config:
        from_attributes = True