"""
Agent endpoints for Litestar
"""
from litestar import Router, get, post
from litestar.exceptions import NotFoundException
from typing import Any, Dict, List, Optional
from pydantic import BaseModel
from app.agents.orchestrator import orchestrator
import logging

logger = logging.getLogger(__name__)


class ChatMessage(BaseModel):
    role: str
    content: str
    id: Optional[str] = None


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    agent_id: str
    specialization: str


class TaskRequest(BaseModel):
    task: str
    agent_id: str
    specialization: str
    tools: Optional[List[str]] = None


@get("/api/agents")
async def list_agents() -> dict:
    """List all available agents"""
    return {
        "status": "success",
        "agents": orchestrator.get_all_agents(),
        "count": len(orchestrator.agents),
    }


@get("/api/agents/{agent_id:str}")
async def get_agent(agent_id: str) -> dict:
    """Get specific agent details"""
    agent = orchestrator.get_agent(agent_id)
    if not agent:
        raise NotFoundException(f"Agent {agent_id} not found")
    return {"status": "success", "agent": agent}


@post("/api/agents/chat")
async def chat_with_agent(data: ChatRequest) -> dict:
    """Chat with an agent"""
    try:
        # Extract the last user message
        user_messages = [m for m in data.messages if m.role == "user"]
        if not user_messages:
            raise ValueError("No user message found")

        task = user_messages[-1].content

        # Execute task with agent
        result = await orchestrator.execute_task(data.agent_id, task)

        return result
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise


@post("/api/agents/execute")
async def execute_agent_task(data: TaskRequest) -> dict:
    """Execute a task with an agent"""
    try:
        result = await orchestrator.execute_task(data.agent_id, data.task, data.tools)
        return result
    except Exception as e:
        logger.error(f"Execution error: {e}")
        raise


@get("/api/agents/tasks/{task_id:str}")
async def get_task_status(task_id: str) -> dict:
    """Get task status"""
    task = orchestrator.get_task_status(task_id)
    if not task:
        raise NotFoundException(f"Task {task_id} not found")
    return {"status": "success", "task": task}


@post("/api/agents/{agent_id:str}/pause")
async def pause_agent(agent_id: str) -> dict:
    """Pause an agent"""
    result = orchestrator.pause_agent(agent_id)
    if result["status"] == "error":
        raise NotFoundException(result["message"])
    return result


@post("/api/agents/{agent_id:str}/resume")
async def resume_agent(agent_id: str) -> dict:
    """Resume an agent"""
    result = orchestrator.resume_agent(agent_id)
    if result["status"] == "error":
        raise NotFoundException(result["message"])
    return result


router = Router(
    path="",
    route_handlers=[
        list_agents,
        get_agent,
        chat_with_agent,
        execute_agent_task,
        get_task_status,
        pause_agent,
        resume_agent,
    ],
)

