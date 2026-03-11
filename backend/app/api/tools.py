"""
Tool endpoints for Litestar
"""
from litestar import Router, post
from pydantic import BaseModel
from app.tools.executor import tool_executor
import logging

logger = logging.getLogger(__name__)


class WebSearchRequest(BaseModel):
    query: str
    limit: int = 10


class AnalyzeImageRequest(BaseModel):
    image_url: str


class TranslateTextRequest(BaseModel):
    text: str
    target_language: str


class GetWeatherRequest(BaseModel):
    location: str


class ExecuteCodeRequest(BaseModel):
    code: str
    language: str


class ExtractPdfRequest(BaseModel):
    pdf_url: str


@post("/api/tools/web-search")
async def web_search(data: WebSearchRequest) -> dict:
    """Search the web"""
    try:
        result = await tool_executor.execute(
            "web_search", query=data.query, limit=data.limit
        )
        return result
    except Exception as e:
        logger.error(f"Web search error: {e}")
        return {"status": "error", "message": str(e)}


@post("/api/tools/analyze-image")
async def analyze_image(data: AnalyzeImageRequest) -> dict:
    """Analyze an image"""
    try:
        result = await tool_executor.execute("analyze_image", image_url=data.image_url)
        return result
    except Exception as e:
        logger.error(f"Image analysis error: {e}")
        return {"status": "error", "message": str(e)}


@post("/api/tools/translate")
async def translate_text(data: TranslateTextRequest) -> dict:
    """Translate text to another language"""
    try:
        result = await tool_executor.execute(
            "translate_text", text=data.text, target_language=data.target_language
        )
        return result
    except Exception as e:
        logger.error(f"Translation error: {e}")
        return {"status": "error", "message": str(e)}


@post("/api/tools/weather")
async def get_weather(data: GetWeatherRequest) -> dict:
    """Get weather for a location"""
    try:
        result = await tool_executor.execute("get_weather", location=data.location)
        return result
    except Exception as e:
        logger.error(f"Weather error: {e}")
        return {"status": "error", "message": str(e)}


@post("/api/tools/execute-code")
async def execute_code(data: ExecuteCodeRequest) -> dict:
    """Execute code in a specific language"""
    try:
        result = await tool_executor.execute(
            "execute_code", code=data.code, language=data.language
        )
        return result
    except Exception as e:
        logger.error(f"Code execution error: {e}")
        return {"status": "error", "message": str(e)}


@post("/api/tools/extract-pdf")
async def extract_pdf(data: ExtractPdfRequest) -> dict:
    """Extract data from a PDF"""
    try:
        result = await tool_executor.execute("extract_pdf", pdf_url=data.pdf_url)
        return result
    except Exception as e:
        logger.error(f"PDF extraction error: {e}")
        return {"status": "error", "message": str(e)}


router = Router(
    path="",
    route_handlers=[
        web_search,
        analyze_image,
        translate_text,
        get_weather,
        execute_code,
        extract_pdf,
    ],
)

