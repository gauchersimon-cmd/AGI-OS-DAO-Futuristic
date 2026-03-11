"""
Agent Orchestrator - manages multiple agents and their tasks
"""
from typing import Any, Dict, List, Optional
from uuid import uuid4
from datetime import datetime
import asyncio
import logging
from app.agents.base import Agent
from app.tools.executor import tool_executor

logger = logging.getLogger(__name__)


class AgentOrchestrator:
    """Orchestrates multiple agents and manages task distribution"""

    def __init__(self):
        self.agents: Dict[str, Agent] = {}
        self.tasks: Dict[str, Dict[str, Any]] = {}
        self._initialize_default_agents()

    def _initialize_default_agents(self):
        """Initialize default agents"""
        default_agents = [
            ("reasoning-1", "Reasoning Engine", "reasoning"),
            ("vision-1", "Vision Processor", "vision"),
            ("language-1", "Language Expert", "language"),
            ("code-1", "Code Generator", "code"),
            ("research-1", "Research Agent", "research"),
            ("analysis-1", "Data Analyst", "analysis"),
        ]

        for agent_id, name, agent_type in default_agents:
            agent = Agent(
                id=agent_id,
                name=name,
                agent_type=agent_type,
            )
            self.agents[agent_id] = agent

    async def execute_task(
        self, agent_id: str, task: str, tools: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Execute a task with a specific agent"""
        if agent_id not in self.agents:
            return {"status": "error", "message": f"Agent {agent_id} not found"}

        agent = self.agents[agent_id]
        task_id = str(uuid4())

        # Create task record
        self.tasks[task_id] = {
            "id": task_id,
            "agent_id": agent_id,
            "task": task,
            "status": "running",
            "created_at": datetime.now().isoformat(),
            "result": None,
        }

        try:
            # Update agent status
            agent.status = "active"
            agent.workload = 85.0  # Simulated workload

            # Execute task (simplified - would be more complex with actual LLM integration)
            result = await self._process_task(agent, task, tools)

            # Update task record
            self.tasks[task_id]["status"] = "completed"
            self.tasks[task_id]["result"] = result

            # Update agent metrics
            agent.status = "idle"
            agent.tasks_completed += 1
            agent.workload = 0.0
            agent.updated_at = datetime.now()

            return {"status": "success", "task_id": task_id, "result": result}

        except Exception as e:
            logger.error(f"Task execution error: {e}")
            self.tasks[task_id]["status"] = "failed"
            self.tasks[task_id]["result"] = str(e)
            agent.status = "idle"
            return {"status": "error", "task_id": task_id, "message": str(e)}

    async def _process_task(
        self, agent: Agent, task: str, tools: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Process a task for an agent"""
        available_tools = tools or agent.get_available_tools()

        result = {
            "agent": agent.to_dict(),
            "task": task,
            "tools_used": [],
            "response": f"Task processed by {agent.name}",
        }

        # Simulate tool usage based on task content
        if "search" in task.lower() or "find" in task.lower():
            try:
                search_result = await tool_executor.execute(
                    "web_search", query=task[:100]
                )
                result["tools_used"].append("web_search")
                result["search_results"] = search_result
            except Exception as e:
                logger.warning(f"Web search failed: {e}")

        return result

    def get_agent(self, agent_id: str) -> Optional[Dict[str, Any]]:
        """Get agent information"""
        if agent_id in self.agents:
            return self.agents[agent_id].to_dict()
        return None

    def get_all_agents(self) -> List[Dict[str, Any]]:
        """Get all agents"""
        return [agent.to_dict() for agent in self.agents.values()]

    def get_task_status(self, task_id: str) -> Optional[Dict[str, Any]]:
        """Get task status"""
        return self.tasks.get(task_id)

    def pause_agent(self, agent_id: str) -> Dict[str, Any]:
        """Pause an agent"""
        if agent_id in self.agents:
            self.agents[agent_id].status = "paused"
            return {"status": "success", "message": f"Agent {agent_id} paused"}
        return {"status": "error", "message": f"Agent {agent_id} not found"}

    def resume_agent(self, agent_id: str) -> Dict[str, Any]:
        """Resume an agent"""
        if agent_id in self.agents:
            self.agents[agent_id].status = "idle"
            return {"status": "success", "message": f"Agent {agent_id} resumed"}
        return {"status": "error", "message": f"Agent {agent_id} not found"}


# Singleton instance
orchestrator = AgentOrchestrator()
