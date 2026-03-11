# AGI-OS-DAO with FastAPI Backend

## Project Structure

```
AGI-OS-DAO-Futuristic/
├── frontend/                   # Next.js application
│   ├── app/
│   ├── components/
│   ├── package.json
│   └── ...
├── backend/                    # FastAPI application
│   ├── app/
│   │   ├── agents/
│   │   ├── tools/
│   │   ├── api/
│   │   └── main.py
│   ├── requirements.txt
│   ├── main.py
│   └── .env.example
└── README.md
```

## Quick Start

### 1. Start FastAPI Backend

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env.local
cp .env.example .env.local
# Edit .env.local and add your RapidAPI key

# Start FastAPI server
python main.py
# Server runs on: http://localhost:8000
```

### 2. Start Next.js Frontend

```bash
# In a new terminal, go to project root
cd ..  # (if you're in backend directory)

# Install dependencies
pnpm install

# Create .env.local
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
pnpm dev
# Runs on: http://localhost:3000
```

### 3. Test the Integration

```bash
# In your Next.js app, the agent components should now call:
# http://localhost:8000/api/agents/...

# Visit http://localhost:3000 in your browser
```

---

## 🎯 What You Have Now

### Frontend (Next.js)
- ✅ Dashboard with interactive UI
- ✅ Agent orchestrator component
- ✅ Memory knowledge base
- ✅ Tool marketplace
- ✅ DAO governance interface
- ✅ Advanced analytics

### Backend (FastAPI)
- ✅ 6 agent types with specializations
- ✅ Agent orchestration & management
- ✅ Tool execution engine
- ✅ RapidAPI integration (8+ tools)
- ✅ Health checks & monitoring
- ✅ Full REST API with documentation

### Integration
- ✅ Frontend ↔ Backend communication
- ✅ RapidAPI pooling for multi-tool support
- ✅ Async task execution
- ✅ CORS configured for local development

---

## 🔄 Connecting Frontend to Backend

### Update Next.js API routes to use FastAPI:

In your Next.js components, replace calls to `/api/agent/*` with calls to FastAPI:

```typescript
// OLD (Next.js API routes)
const response = await fetch('/api/agent/chat', { ... });

// NEW (FastAPI backend)
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
const response = await fetch(`${API_URL}/api/agents/chat`, { ... });
```

### Update `.env.local` in frontend:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

---

## 📊 API Documentation

Once FastAPI is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 🚀 Production Deployment

### Option 1: Separate Deployments
- **Frontend**: Deploy Next.js to Vercel
- **Backend**: Deploy FastAPI to Railway, Render, or AWS

### Option 2: Single Server
- Deploy both to the same server (e.g., with Docker)

### Docker Support (coming soon)
```bash
# Build backend
docker build -t agi-os-backend ./backend

# Run backend
docker run -p 8000:8000 agi-os-backend

# Frontend continues on Vercel or your hosting
```

---

## 📚 Architecture Overview

```
┌─────────────────────┐
│   Next.js Frontend  │
│  (React Component)  │
└──────────┬──────────┘
           │
           │ HTTP/REST
           ↓
┌─────────────────────────┐
│   FastAPI Backend       │
│ (Agent Orchestration)   │
└──────────┬──────────────┘
           │
           │ HTTP/RapidAPI
           ↓
┌─────────────────────────┐
│   RapidAPI Services     │
│ - Google Search         │
│ - Claude API            │
│ - Image Analysis        │
│ - Code Execution        │
│ - Translation           │
│ - Weather               │
│ - PDF Extraction        │
└─────────────────────────┘
```

---

## 🎓 Next Steps

1. **Test the APIs**: Visit http://localhost:8000/docs
2. **Connect frontend components** to FastAPI endpoints
3. **Add Supabase** for persistent data (optional)
4. **Implement authentication** (JWT tokens)
5. **Deploy** to production

---

## 💡 Tips

- FastAPI auto-generates documentation from code
- Use `RAPID API_KEY` for all external API calls
- Keep both servers running during development
- Check logs in both terminals for debugging
- Update CORS settings if deploying to different domains

---

**Enjoy your AGI-OS-DAO system! 🚀**
