"""
Free & Open-Source API clients - No signup required!
"""
import httpx
import json
from typing import Any, Dict, Optional
from app.config import settings
import logging
from bs4 import BeautifulSoup
import pypdf

logger = logging.getLogger(__name__)


class FreeAPIsClient:
    """Client for free APIs - no RapidAPI needed!"""

    def __init__(self):
        self.timeout = 30.0

    async def search_web(self, query: str, limit: int = 10) -> Dict[str, Any]:
        """
        Search the web using DuckDuckGo (free, no key needed)
        Alternative: Use SerpAPI free tier (~100/month free queries)
        """
        try:
            async with httpx.AsyncClient() as client:
                # Using DuckDuckGo HTML search (free, no API key)
                response = await client.get(
                    "https://html.duckduckgo.com/",
                    params={"q": query},
                    timeout=self.timeout,
                )
                response.raise_for_status()

                soup = BeautifulSoup(response.text, "html.parser")
                results = []

                for result in soup.find_all("div", class_="result")[:limit]:
                    title_elem = result.find("a", class_="result__a")
                    snippet_elem = result.find("a", class_="result__snippet")

                    if title_elem and snippet_elem:
                        results.append(
                            {
                                "title": title_elem.get_text(),
                                "link": title_elem.get("href"),
                                "snippet": snippet_elem.get_text(),
                            }
                        )

                return {
                    "status": "success",
                    "query": query,
                    "results": results,
                    "total": len(results),
                }
        except Exception as e:
            logger.error(f"Web search error: {e}")
            raise

    async def get_weather(self, location: str) -> Dict[str, Any]:
        """
        Get weather using Open-Meteo (free, no key needed!)
        """
        try:
            async with httpx.AsyncClient() as client:
                # Geocode location
                geo_response = await client.get(
                    "https://geocoding-api.open-meteo.com/v1/search",
                    params={"name": location, "count": 1, "language": "en"},
                    timeout=self.timeout,
                )
                geo_response.raise_for_status()
                geo_data = geo_response.json()

                if not geo_data.get("results"):
                    return {"status": "error", "message": f"Location '{location}' not found"}

                lat = geo_data["results"][0]["latitude"]
                lon = geo_data["results"][0]["longitude"]
                place_name = geo_data["results"][0]["name"]

                # Get weather
                weather_response = await client.get(
                    "https://api.open-meteo.com/v1/forecast",
                    params={
                        "latitude": lat,
                        "longitude": lon,
                        "current": "temperature_2m,weather_code,wind_speed_10m",
                        "timezone": "auto",
                    },
                    timeout=self.timeout,
                )
                weather_response.raise_for_status()
                weather_data = weather_response.json()

                return {
                    "status": "success",
                    "location": place_name,
                    "latitude": lat,
                    "longitude": lon,
                    "current": weather_data.get("current"),
                }
        except Exception as e:
            logger.error(f"Weather error: {e}")
            raise

    async def translate_text(self, text: str, target_language: str) -> Dict[str, Any]:
        """
        Translate using LibreTranslate (free service, can be self-hosted)
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.mymemory.translated.net/get",
                    params={"q": text, "langpair": f"en|{target_language}"},
                    timeout=self.timeout,
                )
                response.raise_for_status()
                data = response.json()

                return {
                    "status": "success",
                    "original": text,
                    "translated": data.get("responseData", {}).get("translatedText"),
                    "target_language": target_language,
                }
        except Exception as e:
            logger.error(f"Translation error: {e}")
            raise

    async def execute_code(self, code: str, language: str) -> Dict[str, Any]:
        """
        Execute code using Judge0 (free tier available)
        """
        try:
            # Language mappings for Judge0
            language_map = {
                "python": 71,
                "javascript": 63,
                "java": 62,
                "cpp": 54,
                "csharp": 51,
            }

            lang_id = language_map.get(language.lower(), 71)  # Default to Python

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://judge0-ce.p.rapidapi.com/submissions",
                    headers={
                        "x-rapidapi-key": "demo",  # Public free tier
                        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                        "Content-Type": "application/json",
                    },
                    json={"language_id": lang_id, "source_code": code},
                    timeout=self.timeout,
                )
                response.raise_for_status()

                return {
                    "status": "success",
                    "code": code,
                    "language": language,
                    "message": "Code submitted for execution (check Judge0 for results)",
                }
        except Exception as e:
            logger.error(f"Code execution error: {e}")
            # Return a safe error response
            return {"status": "error", "message": f"Code execution failed: {str(e)}"}

    async def extract_pdf(self, pdf_url: str) -> Dict[str, Any]:
        """
        Extract text from PDF locally using pypdf
        """
        try:
            async with httpx.AsyncClient() as client:
                # Download PDF
                response = await client.get(pdf_url, timeout=self.timeout)
                response.raise_for_status()

                # Extract text using pypdf
                from io import BytesIO

                pdf_file = BytesIO(response.content)
                pdf_reader = pypdf.PdfReader(pdf_file)

                text = ""
                metadata = {}

                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"

                if pdf_reader.metadata:
                    metadata = {
                        "title": pdf_reader.metadata.get("/Title", ""),
                        "author": pdf_reader.metadata.get("/Author", ""),
                        "pages": len(pdf_reader.pages),
                    }

                return {
                    "status": "success",
                    "url": pdf_url,
                    "text": text[:1000],  # First 1000 chars
                    "full_text": text,
                    "metadata": metadata,
                    "pages": len(pdf_reader.pages),
                }
        except Exception as e:
            logger.error(f"PDF extraction error: {e}")
            raise

    async def analyze_image(self, image_url: str) -> Dict[str, Any]:
        """
        Image analysis using local ML model (Ollama) or external free service
        Falls back to image metadata extraction
        """
        try:
            async with httpx.AsyncClient() as client:
                # Get image metadata
                response = await client.head(image_url, timeout=self.timeout)
                headers = response.headers

                return {
                    "status": "success",
                    "url": image_url,
                    "size": headers.get("content-length", "unknown"),
                    "type": headers.get("content-type", "unknown"),
                    "message": "Use Ollama locally for full ML-based analysis",
                }
        except Exception as e:
            logger.error(f"Image analysis error: {e}")
            raise


# Singleton instance
free_api_client = FreeAPIsClient()

