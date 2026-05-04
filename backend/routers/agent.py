import logging
from fastapi import APIRouter, HTTPException
from schemas.chat import ChatRequest, ChatResponse
from services.agent_service import process_chat

logger = logging.getLogger(__name__)
agent_router = APIRouter()

@agent_router.post("/chat", response_model=ChatResponse)
async def chat_with_agent(request: ChatRequest):
    try:
        response_text = await process_chat(request.message)
        return ChatResponse(response=response_text)
    except Exception as e:
        logger.error(f"Error in chat_with_agent: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An internal error occurred.")
