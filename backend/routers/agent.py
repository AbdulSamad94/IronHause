import json
import logging

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse

from schemas.chat import ChatRequest, ChatResponse
from services.agent_service import process_chat, stream_chat
from core.auth import verify_api_key

logger = logging.getLogger(__name__)
agent_router = APIRouter(dependencies=[Depends(verify_api_key)])


@agent_router.post("/chat", response_model=ChatResponse)
async def chat_with_agent(request: ChatRequest):
    try:
        response_text = await process_chat(request.message, session_id=request.session_id)
        return ChatResponse(response=response_text)
    except Exception as e:
        logger.error("Error in chat_with_agent: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="An internal error occurred.")


@agent_router.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    async def generate():
        try:
            async for token in stream_chat(request.message, session_id=request.session_id):
                yield f"data: {json.dumps({'token': token})}\n\n"
        except Exception as e:
            logger.error("Streaming error: %s", e, exc_info=True)
            yield f"data: {json.dumps({'error': 'An error occurred while generating the response.'})}\n\n"
        finally:
            yield "data: [DONE]\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",  # disable nginx buffering for SSE
        },
    )
