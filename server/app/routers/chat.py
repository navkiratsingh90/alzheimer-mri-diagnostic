from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.config import settings
from app.models.user import User
from app.models.chat_message import ChatMessage
from app.schemas.chat import ChatRequest, ChatMessageResponse

import openai

router = APIRouter(tags=["chat"])


@router.post(
    "/chat",
    response_model=ChatMessageResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        401: {"description": "Unauthorized"},
        503: {"description": "OpenAI service unavailable"},
        500: {"description": "Internal server error"},
    },
)
async def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Send a question to the AI assistant.
    The conversation is saved to history.
    """
    if not settings.OPENAI_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="OpenAI API key not configured. Please contact the administrator."
        )

    openai.api_key = settings.OPENAI_API_KEY

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant specialized in Alzheimer's disease and MRI analysis."},
                {"role": "user", "content": request.question}
            ],
            temperature=0.7,
            max_tokens=500,
        )
        answer = response.choices[0].message.content.strip()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"OpenAI API error: {str(e)}"
        )

    # Save to database
    chat_message = ChatMessage(
        user_id=user.id,
        question=request.question,
        answer=answer,
    )
    db.add(chat_message)
    db.commit()
    db.refresh(chat_message)

    return ChatMessageResponse(
        id=chat_message.id,
        question=chat_message.question,
        answer=chat_message.answer,
        timestamp=chat_message.timestamp,
    )


@router.get(
    "/chat/history",
    response_model=List[ChatMessageResponse],
    responses={
        401: {"description": "Unauthorized"},
    },
)
async def get_chat_history(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Retrieve all chat messages for the current user, ordered newest first.
    """
    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.user_id == user.id)
        .order_by(ChatMessage.timestamp.desc())
        .all()
    )
    return messages