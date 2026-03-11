"""
Health check endpoints for Litestar
"""
from litestar import get, Router
import logging

logger = logging.getLogger(__name__)


@get("/health")
async def health_check() -> dict:
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "AGI-OS-DAO Backend",
        "version": "0.1.0",
    }


router = Router(path="", route_handlers=[health_check])
