# AGI-OS-DAO Litestar Backend

A high-performance Python backend for the AGI-OS-DAO system, using **Litestar** with **Free APIs** integration for multi-agent orchestration.

## 🎯 Why Litestar Over FastAPI?

- ✅ **Modern & Async-first** - Better production performance
- ✅ **Type-safe** - Full Pydantic integration
- ✅ **Lightweight** - Minimal dependencies  
- ✅ **Fast** - Competitive or better performance
- ✅ **Better DX** - Cleaner API design

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- pip or poetry

### Installation

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. No API keys needed! (All free APIs)
```

### Run Development Server

```bash
# Start Litestar server (runs on http://localhost:8000)
python main.py

# Or with auto-reload:
uvicorn app.main:app --reload

# Access API documentation:
# - OpenAPI/Swagger: http://localhost:8000/schema
# - ReDoc: http://localhost:8000/redoc
```

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # Litestar application
│   ├── config.py               # Configuration management
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── base.py            # Base Agent class
│   │   └── orchestrator.py    # Agent orchestration logic
│   ├── tools/
│   │   ├── __init__.py
│   │   ├── rapidapi.py        # Free APIs client
│   │   └── executor.py        # Tool execution engine
│   └── api/
│       ├── __init__.py
│       ├── agents.py          # Agent endpoints
│       ├── tools.py           # Tool endpoints
│       └── health.py          # Health check endpoints
├── main.py                     # Entry point
├── requirements.txt            # Python dependencies
└── .env.example               # Environment template
```

---

## 🔌 API Endpoints

### Agents Management
```
GET    /api/agents              # List all agents
GET    /api/agents/{agent_id}   # Get agent details
POST   /api/agents/chat         # Chat with agent
POST   /api/agents/execute      # Execute task
GET    /api/agents/tasks/{id}   # Get task status
POST   /api/agents/{id}/pause   # Pause agent
POST   /api/agents/{id}/resume  # Resume agent
```

### Tools
```
POST   /api/tools/web-search    # Search the web
POST   /api/tools/analyze-image # Analyze images
POST   /api/tools/translate     # Translate text
POST   /api/tools/weather       # Get weather
POST   /api/tools/execute-code  # Run code
POST   /api/tools/extract-pdf   # Extract PDF data
```

### Health & Info
```
GET    /health                  # Health check
GET    /                        # Root/info endpoint
GET    /docs                    # Swagger UI documentation
GET    /redoc                   # ReDoc documentation
```

---

## 📊 Agent Types

| Type | Specialization | Tools |
|------|---|---|
| **reasoning** | Logical analysis | web_search, extract_pdf |
| **vision** | Image analysis | analyze_image, web_search |
| **language** | Text processing | translate_text, web_search |
| **code** | Software development | execute_code, web_search |
| **research** | Information gathering | web_search, extract_pdf, analyze_image |
| **analysis** | Data analysis | web_search, execute_code, extract_pdf |

---

## 🛠️ Integration with Frontend

### From Next.js, call the backend:

```typescript
// Make requests to Litestar backend
const response = await fetch('http://localhost:8000/api/agents/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [...],
    agent_id: 'reasoning-1',
    specialization: 'reasoning'
  })
});
```

### Production Deployment

For production, update your frontend's API calls:
```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
```

---

## 🔑 Environment Variables

```bash
# API Configuration
DEBUG=True
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=["http://localhost:3000", "http://localhost:3001"]

# RapidAPI Configuration
RAPIDAPI_KEY=your_rapidapi_key_here

# Additional APIs (Optional)
ANTHROPIC_API_KEY=your_anthropic_key_here
OPENAI_API_KEY=your_openai_key_here

# Database (Optional)
DATABASE_URL=sqlite:///./agi_os.db

# Supabase (Optional)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_API_KEY=your_api_key_here
```

---

## 📚 Example Usage

### Chat with Agent

```bash
curl -X POST http://localhost:8000/api/agents/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "What is the weather in New York?",
        "id": "msg-1"
      }
    ],
    "agent_id": "research-1",
    "specialization": "research"
  }'
```

### Execute Web Search

```bash
curl -X POST http://localhost:8000/api/tools/web-search \
  -H "Content-Type: application/json" \
  -d '{"query": "latest AI news", "limit": 10}'
```

### Get Agent Status

```bash
curl http://localhost:8000/api/agents/reasoning-1
```

---

## 🚀 Next Steps

1. **Install dependencies**: `pip install -r requirements.txt`
2. **Configure environment**: Copy `.env.example` to `.env.local`
3. **Add RapidAPI key**: Get from https://rapidapi.com/
4. **Start server**: `python main.py`
5. **Test API**: Visit http://localhost:8000/docs
6. **Connect frontend**: Update Next.js to call FastAPI endpoints

---

## 🔧 Development Tips

### Auto-reload during development
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Check linting
```bash
pip install pylint black
black app/
pylint app/
```

### Run in production
```bash
# Without reload, with workers
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
```

---

## 📝 License

Part of AGI-OS-DAO project - Futuristic Dashboard
