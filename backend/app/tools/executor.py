"""
Tool executor - runs tools and handles results
"""
from typing import Any, Dict, Callable, Optional
import logging
from app.tools.rapidapi import free_api_client

logger = logging.getLogger(__name__)


class ToolExecutor:
    """Executes various tools for agents"""

    def __init__(self):
        self.tools = {
            "web_search": self.web_search,
            "analyze_image": self.analyze_image,
            "translate_text": self.translate_text,
            "get_weather": self.get_weather,
            "execute_code": self.execute_code,
            "extract_pdf": self.extract_pdf,
        }

    async def execute(self, tool_name: str, **kwargs) -> Dict[str, Any]:
        """Execute a tool with given parameters"""
        if tool_name not in self.tools:
            return {"status": "error", "message": f"Tool '{tool_name}' not found"}

        try:
            tool_func = self.tools[tool_name]
            result = await tool_func(**kwargs)
            return {"status": "success", "data": result}
        except Exception as e:
            logger.error(f"Tool execution error for {tool_name}: {e}")
            return {"status": "error", "message": str(e)}

    async def web_search(self, query: str, limit: int = 10) -> Dict[str, Any]:
        """Execute web search"""
        return await free_api_client.search_web(query, limit)

    async def analyze_image(self, image_url: str) -> Dict[str, Any]:
        """Analyze an image"""
        return await free_api_client.analyze_image(image_url)

    async def translate_text(self, text: str, target_language: str) -> Dict[str, Any]:
        """Translate text"""
        return await free_api_client.translate_text(text, target_language)

    async def get_weather(self, location: str) -> Dict[str, Any]:
        """Get weather data"""
        return await free_api_client.get_weather(location)

    async def execute_code(self, code: str, language: str) -> Dict[str, Any]:
        """Execute code"""
        return await free_api_client.execute_code(code, language)

    async def extract_pdf(self, pdf_url: str) -> Dict[str, Any]:
        """Extract PDF data"""
        return await free_api_client.extract_pdf(pdf_url)


# Singleton instance
tool_executor = ToolExecutor()
