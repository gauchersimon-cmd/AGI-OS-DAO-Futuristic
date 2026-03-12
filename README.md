# AGI OS-DAO v3.0.0

**Decentralized AI Operating System with DAO Governance**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app)

## Quick Start

### Windows
```batch
.\start.bat
```

### Mac/Linux
```bash
chmod +x start.sh && ./start.sh
```

### Manual Installation
```bash
git clone https://github.com/gauchersimon-cmd/AGI-OS-DAO-Futuristic.git
cd AGI-OS-DAO-Futuristic
pnpm install    # or npm install / yarn
pnpm dev        # Opens http://localhost:3000
```

## Features

| Feature | Description |
|---------|-------------|
| **6 AI Agents** | Reasoning, Vision, Language, Code, Research, Analysis |
| **Terminal** | Built-in commands + AI queries |
| **DAO Governance** | Community voting & proposals |
| **Analytics** | Real-time metrics with Recharts |
| **Marketplace** | Extensible tools system |
| **Memory** | Knowledge base management |

## Environment Variables

Create `.env.local` at project root:

```env
# AI Features (optional - demo mode works without)
OPENAI_API_KEY=sk-your-key-here

# Database (optional - uses mock data without)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

**Get OpenAI Key:** https://platform.openai.com/api-keys

## Deployment

### Vercel (Recommended)
1. Fork/clone this repo
2. Import in [Vercel](https://vercel.com/new)
3. Add env variables in Settings > Environment Variables
4. Deploy!

### Self-hosted
```bash
pnpm build && pnpm start
```

### Docker
```bash
docker-compose up
```

## Tech Stack

- **Framework:** Next.js 14 + React 19
- **AI:** AI SDK 5 + OpenAI
- **Styling:** TailwindCSS + shadcn/ui
- **Animations:** Framer Motion
- **State:** Zustand + TanStack Query
- **Charts:** Recharts

## Compatibility

| Platform | Status |
|----------|--------|
| Windows 10/11 | Tested |
| macOS 12+ | Tested |
| Ubuntu 20.04+ | Tested |
| Node.js 18+ | Required |

## In-App Help

Visit `/setup` in the app for interactive installation guide.

---

MIT License | [GitHub](https://github.com/gauchersimon-cmd/AGI-OS-DAO-Futuristic)
