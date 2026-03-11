"""
Litestar application for AGI-OS-DAO backend
"""
from litestar import Litestar, get
from litestar.config.cors import CORSConfig
import logging
from app.config import settings
from app.api import agents, tools, health, terminal

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Create Litestar app
app = Litestar(
    title="AGI-OS-DAO Backend API",
    description="Backend API for the AGI-OS-DAO Futuristic Dashboard using Litestar",
    version="0.1.0",
    debug=settings.debug,
    route_handlers=[agents.router, tools.router, health.router, terminal.router],
    cors_config=CORSConfig(
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    ),
)


@get("/")
async def root() -> dict:
    """Root endpoint"""
    return {
        "service": "AGI-OS-DAO Backend API",
        "framework": "Litestar",
        "version": "0.1.0",
        "endpoints": {
            "agents": "/api/agents",
            "tools": "/api/tools",
            "health": "/health",
            "docs": "/schema",
        },
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug,
    )

