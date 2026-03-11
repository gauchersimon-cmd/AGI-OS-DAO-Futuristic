"""
Base Agent class for all agent types
"""
from typing import Any, Dict, List, Optional
from dataclasses import dataclass, field
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


@dataclass
class Agent:
    """Base Agent class"""

    id: str
    name: str
    agent_type: str  # reasoning, vision, language, code, research, analysis
    status: str = "idle"  # idle, active, paused
    workload: float = 0.0
    tasks_completed: int = 0
    success_rate: float = 100.0
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)

    # System prompt for agent
    system_prompt: str = ""

    # Available tools for this agent
    available_tools: List[str] = field(default_factory=list)

    # Agent configuration
    config: Dict[str, Any] = field(default_factory=dict)

    def get_system_prompt(self) -> str:
        """Get the system prompt for this agent type"""
        prompts = {
            "reasoning": "You are a reasoning agent specialized in logical analysis and problem-solving. Use tools to gather information and analyze deeply.",
            "vision": "You are a vision agent specialized in image analysis and visual understanding. Use the analyze_image tool when appropriate.",
            "language": "You are a language agent specialized in natural language processing and translation. Use translate_text tool for language tasks.",
            "code": "You are a code agent specialized in software development and debugging. Use execute_code and web_search tools effectively.",
            "research": "You are a research agent specialized in information gathering and synthesis. Use web_search and other tools to investigate topics.",
            "analysis": "You are an analysis agent specialized in data analysis and insights. Use all available tools to provide comprehensive analysis.",
        }
        return prompts.get(self.agent_type, prompts["reasoning"])

    def get_available_tools(self) -> List[str]:
        """Get tools available for this agent type"""
        tool_sets = {
            "reasoning": ["web_search", "extract_pdf"],
            "vision": ["analyze_image", "web_search"],
            "language": ["translate_text", "web_search"],
            "code": ["execute_code", "web_search"],
            "research": ["web_search", "extract_pdf", "analyze_image"],
            "analysis": ["web_search", "execute_code", "extract_pdf"],
        }
        return tool_sets.get(self.agent_type, tool_sets["reasoning"])

    def to_dict(self) -> Dict[str, Any]:
        """Convert agent to dictionary"""
        return {
            "id": self.id,
            "name": self.name,
            "type": self.agent_type,
            "status": self.status,
            "workload": self.workload,
            "tasks_completed": self.tasks_completed,
            "success_rate": self.success_rate,
            "available_tools": self.get_available_tools(),
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
