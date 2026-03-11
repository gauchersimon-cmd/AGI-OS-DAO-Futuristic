export const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || process.env.NEXT_PUBLIC_RAPIDAPI_KEY || ""
export const RAPIDAPI_HOST = "claude-haiku-4-5-p.rapidapi.com"

export async function callClaudeAPI(message: string) {
  if (!RAPIDAPI_KEY) {
    throw new Error("RAPIDAPI_KEY is not configured. Please set NEXT_PUBLIC_RAPIDAPI_KEY environment variable.")
  }

  const response = await fetch(`https://${RAPIDAPI_HOST}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-rapidapi-host": RAPIDAPI_HOST,
      "x-rapidapi-key": RAPIDAPI_KEY,
    },
    body: JSON.stringify({
      model: "Claude-4.5-Haiku",
      message: [{ role: "user", content: message }],
    }),
  })

  if (!response.ok) {
    throw new Error(`RapidAPI error: ${response.statusText}`)
  }

  return response.json()
}

export async function searchWeb(query: string) {
  if (!RAPIDAPI_KEY) {
    throw new Error("RAPIDAPI_KEY is not configured")
  }

  const response = await fetch("https://google-search74.p.rapidapi.com/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-rapidapi-host": "google-search74.p.rapidapi.com",
      "x-rapidapi-key": RAPIDAPI_KEY,
    },
    body: JSON.stringify({ query, limit: 10 }),
  })

  if (!response.ok) {
    throw new Error(`Search API error: ${response.statusText}`)
  }

  return response.json()
}

export async function analyzeImage(imageUrl: string) {
  if (!RAPIDAPI_KEY) {
    throw new Error("RAPIDAPI_KEY is not configured")
  }

  const response = await fetch("https://ai-image-analyzer.p.rapidapi.com/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-rapidapi-host": "ai-image-analyzer.p.rapidapi.com",
      "x-rapidapi-key": RAPIDAPI_KEY,
    },
    body: JSON.stringify({ image_url: imageUrl }),
  })

  if (!response.ok) {
    throw new Error(`Image analysis error: ${response.statusText}`)
  }

  return response.json()
}

export async function translateText(text: string, targetLang: string) {
  if (!RAPIDAPI_KEY) {
    throw new Error("RAPIDAPI_KEY is not configured")
  }

  const response = await fetch("https://deep-translate1.p.rapidapi.com/language/translate/v2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-rapidapi-host": "deep-translate1.p.rapidapi.com",
      "x-rapidapi-key": RAPIDAPI_KEY,
    },
    body: JSON.stringify({
      q: text,
      target: targetLang,
    }),
  })

  if (!response.ok) {
    throw new Error(`Translation error: ${response.statusText}`)
  }

  return response.json()
}

export async function getWeather(location: string) {
  if (!RAPIDAPI_KEY) {
    throw new Error("RAPIDAPI_KEY is not configured")
  }

  const response = await fetch("https://api.weatherapi.com/v1/current.json", {
    method: "GET",
    headers: {
      "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
      "x-rapidapi-key": RAPIDAPI_KEY,
    },
  })

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.statusText}`)
  }

  return response.json()
}

export async function executeCode(code: string, language: string) {
  if (!RAPIDAPI_KEY) {
    throw new Error("RAPIDAPI_KEY is not configured")
  }

  const response = await fetch("https://online-code-compiler.p.rapidapi.com/compile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-rapidapi-host": "online-code-compiler.p.rapidapi.com",
      "x-rapidapi-key": RAPIDAPI_KEY,
    },
    body: JSON.stringify({
      language,
      code,
    }),
  })

  if (!response.ok) {
    throw new Error(`Code execution error: ${response.statusText}`)
  }

  return response.json()
}

export async function extractDataFromPDF(pdfUrl: string) {
  if (!RAPIDAPI_KEY) {
    throw new Error("RAPIDAPI_KEY is not configured")
  }

  const response = await fetch("https://pdf-extraction.p.rapidapi.com/extract", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-rapidapi-host": "pdf-extraction.p.rapidapi.com",
      "x-rapidapi-key": RAPIDAPI_KEY,
    },
    body: JSON.stringify({ pdf_url: pdfUrl }),
  })

  if (!response.ok) {
    throw new Error(`PDF extraction error: ${response.statusText}`)
  }

  return response.json()
}

export async function getWeather(city: string) {
  const response = await fetch(`https://weatherapi-com.p.rapidapi.com/current.json?q=${encodeURIComponent(city)}`, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
      "x-rapidapi-key": RAPIDAPI_KEY,
    },
  })

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.statusText}`)
  }

  return response.json()
}

export async function getCryptoPrice(symbol: string) {
  const response = await fetch(`https://coinranking1.p.rapidapi.com/coin/${symbol}/price`, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "coinranking1.p.rapidapi.com",
      "x-rapidapi-key": RAPIDAPI_KEY,
    },
  })

  if (!response.ok) {
    throw new Error(`Crypto API error: ${response.statusText}`)
  }

  return response.json()
}
