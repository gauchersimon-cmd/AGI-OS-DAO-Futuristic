"""Terminal command execution API endpoints."""

from litestar import Router, post
from pydantic import BaseModel
import json

from ..tools.executor import ToolExecutor


class TerminalCommand(BaseModel):
    """Terminal command request."""
    command: str


class TerminalResponse(BaseModel):
    """Terminal command response."""
    output: str
    success: bool = True
    error: str | None = None
    clear: bool = False


tool_executor = ToolExecutor()


@post("/execute")
async def execute_command(data: TerminalCommand) -> TerminalResponse:
    """
    Execute a terminal command.
    
    Commands supported:
    - search <query> - Search the web
    - weather <location> - Get weather
    - translate <lang> <text> - Translate text
    - analyze-image <url> - Analyze image
    - execute-code <code> <language> - Execute code
    - extract-pdf <url> - Extract PDF
    - clear - Clear terminal
    - help - Show help
    """
    command = data.command.strip()
    
    if not command:
        return TerminalResponse(output="Enter a command", success=True)
    
    # Handle clear command
    if command.lower() == "clear":
        return TerminalResponse(output="", success=True, clear=True)
    
    # Handle help command
    if command.lower() in ["help", "h", "?"]:
        return TerminalResponse(
            output="""AGI-OS-DAO Terminal Commands:
            
SEARCH & RESEARCH:
  search <query>              - Search the web

WEATHER & DATA:
  weather <location>          - Get weather info

TRANSLATION:
  translate <lang> <text>     - Translate to language (e.g., 'translate fr Hello')

IMAGE & PDF:
  analyze-image <url>         - Analyze an image
  extract-pdf <url>           - Extract text from PDF

CODE EXECUTION:
  execute-code <lang> <code>  - Execute code (python, javascript, etc)

UTILITY:
  clear                       - Clear terminal
  help                        - Show this help
""",
            success=True
        )
    
    # Parse command
    parts = command.split(" ", 1)
    cmd = parts[0].lower()
    args = parts[1] if len(parts) > 1 else ""
    
    try:
        match cmd:
            case "search":
                if not args:
                    return TerminalResponse(output="Usage: search <query>", success=False)
                result = await tool_executor.execute("web_search", {"query": args, "limit": 5})
                output = format_search_results(result)
                return TerminalResponse(output=output, success=True)
            
            case "weather":
                if not args:
                    return TerminalResponse(output="Usage: weather <location>", success=False)
                result = await tool_executor.execute("get_weather", {"location": args})
                output = format_weather(result)
                return TerminalResponse(output=output, success=True)
            
            case "translate":
                parts_split = args.split(" ", 1)
                if len(parts_split) < 2:
                    return TerminalResponse(
                        output="Usage: translate <language> <text>\nExample: translate fr Hello world",
                        success=False
                    )
                lang, text = parts_split
                result = await tool_executor.execute("translate_text", {
                    "text": text,
                    "target_language": lang
                })
                return TerminalResponse(
                    output=f"Translation ({lang}):\n{result.get('translated_text', json.dumps(result))}",
                    success=True
                )
            
            case "analyze-image" | "analyze_image":
                if not args:
                    return TerminalResponse(output="Usage: analyze-image <image_url>", success=False)
                result = await tool_executor.execute("analyze_image", {"image_url": args})
                return TerminalResponse(
                    output=f"Image Analysis:\n{json.dumps(result, indent=2)}",
                    success=True
                )
            
            case "extract-pdf" | "extract_pdf":
                if not args:
                    return TerminalResponse(output="Usage: extract-pdf <pdf_url>", success=False)
                result = await tool_executor.execute("extract_pdf", {"url": args})
                return TerminalResponse(
                    output=f"PDF Content:\n{result.get('text', json.dumps(result, indent=2))}",
                    success=True
                )
            
            case "execute-code" | "execute_code":
                parts_split = args.split(" ", 1)
                if len(parts_split) < 2:
                    return TerminalResponse(
                        output="Usage: execute-code <language> <code>\nExample: execute-code python print('Hello')",
                        success=False
                    )
                lang, code = parts_split
                result = await tool_executor.execute("execute_code", {
                    "code": code,
                    "language": lang
                })
                return TerminalResponse(
                    output=f"Code Execution Result ({lang}):\n{result.get('output', json.dumps(result))}",
                    success=True
                )
            
            case _:
                return TerminalResponse(
                    output=f"Command not found: {cmd}\nType 'help' for available commands",
                    success=False
                )
    
    except Exception as e:
        return TerminalResponse(
            output=f"Error executing command: {str(e)}",
            success=False,
            error=str(e)
        )


def format_search_results(results: dict) -> str:
    """Format search results for terminal display."""
    if isinstance(results, dict) and "results" in results:
        items = results["results"][:5]
    else:
        items = results.get("results", [])[:5] if isinstance(results, dict) else []
    
    if not items:
        return "No search results found"
    
    output = "Search Results:\n"
    for i, item in enumerate(items, 1):
        title = item.get("title", "No title")
        url = item.get("url", item.get("link", "No URL"))
        desc = item.get("snippet", item.get("description", ""))[:100]
        output += f"\n{i}. {title}\n   {url}\n   {desc}..."
    
    return output


def format_weather(result: dict) -> str:
    """Format weather data for terminal display."""
    # Handle different API response formats
    if "error" in result:
        return f"Weather Error: {result['error']}"
    
    # Try Open-Meteo format
    if "current" in result:
        current = result["current"]
        return f"""Weather: {result.get('location', 'Unknown')}
Temperature: {current.get('temperature', 'N/A')}°C
Condition: {current.get('weather_description', 'N/A')}
Humidity: {current.get('relative_humidity', 'N/A')}%
Wind: {current.get('wind_speed', 'N/A')} km/h"""
    
    return json.dumps(result, indent=2)


# Create router
router = Router(path="/api/terminal", route_handlers=[execute_command])
