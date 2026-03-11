# 🎨 UI/UX Improvements — AGI-OS-DAO

**Date**: March 11, 2026  
**Status**: PLANNING PHASE  
**Focus**: Enhanced visuals, real-time data, interactivity

---

## ✅ VÉRIFICATION: Ce qu'on a déjà

### **Existant**
```
✅ Radix UI (30+ primitives)
✅ TailwindCSS + PostCSS
✅ Lucide Icons (454 icônes)
✅ Next.js 14 + React 19
✅ React Hook Form + Zod validation
✅ Supabase SDK intégré
✅ Vercel Analytics
✅ 10+ composants spécialisés (dashboard, agents, terminal, DAO)
✅ Dark mode via next-themes
```

### **Dépendances actuelles**
```json
{
  "date-fns": "4.1.0",           // Date parsing
  "embla-carousel-react": "8.5.1", // Carousels
  "cmdk": "1.0.4",               // Command palette
  "react-day-picker": "9.8.0",   // Calendar
  "react-resizable-panels": "2.1.7" // Draggable
}
```

---

## 🚨 MANQUE ACTUELLEMENT

| Catégorie | Outil | Utilité | Priorité |
|-----------|-------|---------|-----------|
| **Animations** | Framer Motion | Smooth transitions, gestures | 🔴 HIGH |
| **Graphiques** | Recharts / Plotly | Real-time charts, analytics | 🔴 HIGH |
| **Code Editor** | Monaco / CodeMirror | Syntax highlight pour code exécuté | 🟠 MEDIUM |
| **3D/WebGL** | Three.js / Babylon.js | Visualisation DAO, agent flows | 🟠 MEDIUM |
| **State Mgmt** | Zustand / Jotai | Global state pour agents/tasks | 🔴 HIGH |
| **Notifications** | Sonner (Better Toast) | Toasts stylisées | 🟡 LOW |
| **Tables** | Tanstack React Table | Data grids avancées | 🟡 LOW |
| **API Client** | TanStack Query | Caching, refetch auto | 🔴 HIGH |
| **Websockets** | Socket.io client | Real-time updates agents | 🟠 MEDIUM |
| **Voice** | Web Audio API | Audio input/output agents | 🟠 MEDIUM |

---

## 🎯 PLAN D'AMÉLIORATION (ORDRE LOGIQUE)

### **Phase 1: FONDATIONS** (Aujourd'hui)
```bash
npm install framer-motion zustand @tanstack/react-query recharts sonner
```

**Changements:**
1. `lib/store.ts` — Zustand store pour agents/tasks
2. `app/providers.tsx` — TanStack Query + Zustand setup
3. `components/ui/toast-new.tsx` — Sonner integration
4. Animer tous les composants avec Framer Motion

**Fichiers à créer:**
- `hooks/useAgents.ts` — Custom hook pour agents (TanStack Query)
- `hooks/useTerminalCommands.ts` — Terminal avec state global

---

### **Phase 2: VISUALISATIONS** (Demain)
```bash
npm install recharts plotly.js-react
```

**Nouveaux composants:**
- `components/realtime-metrics.tsx` — Live system stats
- `components/agent-activity-graph.tsx` — Agent workflows visuels
- `components/dao-voting-chart.tsx` — Voting analytics
- `components/code-output-display.tsx` — Formatted output

---

### **Phase 3: EDITEUR + REPL** (Jeudi)
```bash
npm install @monaco-editor/react
```

**Nouveaux composants:**
- `components/code-editor-inline.tsx` — Editor avec exécution live
- `components/code-runner.tsx` — Syntax highlight + output
- Update `interactive-terminal.tsx` pour utiliser Monaco

---

### **Phase 4: TEMPS RÉEL** (Vendredi)
```bash
npm install socket.io-client
```

**Setup Backend:**
- Websocket support dans Litestar
- Agent status updates en temps réel
- Terminal output streaming

**Frontend:**
- Polling → WebSocket migration

---

## 🔧 FICHIERS À CRÉER/MODIFIER

### NOUVELLE ARCHITECTURE
```
components/
├── dashboard.tsx                    [MODIFIÉ - Add Recharts + Animations]
├── agent-orchestrator.tsx           [MODIFIÉ - Add Zustand + TanStack Query]
├── interactive-terminal.tsx         [MODIFIÉ - Add Monaco Editor]
├── realtime-metrics.tsx             [NOUVEAU]
├── agent-activity-graph.tsx         [NOUVEAU]
├── code-editor-inline.tsx           [NOUVEAU]
├── code-runner.tsx                  [NOUVEAU]
├── dao-voting-chart.tsx             [NOUVEAU]
└── ui/
    ├── sonner-toast.tsx             [NOUVEAU]
    └── animated-card.tsx            [NOUVEAU]

lib/
├── store.ts                         [NOUVEAU - Zustand]
├── react-query.ts                   [NOUVEAU - TanStack Setup]
└── websocket.ts                     [NOUVEAU - Socket.io]

hooks/
├── useAgents.ts                     [NOUVEAU - TanStack Query]
├── useTasks.ts                      [NOUVEAU - TanStack Query]
├── useTerminal.ts                   [NOUVEAU - Zustand]
└── useNotification.ts               [NOUVEAU - Sonner]

app/
└── providers.tsx                    [NOUVEAU - Global wrappers]
```

---

## 📊 CHECKLISTE: QU'EST-CE QUI MANQUE?

```
🔲 State Management (Zustand)
🔲 Data Fetching (TanStack Query)
🔲 Animations (Framer Motion)
🔲 Charts (Recharts)
🔲 Notifications (Sonner)
🔲 Code Editor (Monaco)
🔲 Real-time (Socket.io)
🔲 Global Providers setup
🔲 Custom Hooks refactor
🔲 TypeScript types pour tout
```

---

## 📦 INSTALLATION COMPLÈTE (PRÊT À COPIER)

```bash
# Phase 1
npm install framer-motion zustand @tanstack/react-query recharts sonner

# Phase 2 (optionnel pour démo)
npm install @monaco-editor/react socket.io-client

# Types
npm install -D @types/node
```

---

## 🚀 DÉBUT IMMÉDIAT?

**Option A:** Juste Phase 1 aujourd'hui (30 min)
- Installer dépendances
- Créer `lib/store.ts` + `hooks/useAgents.ts`
- Ajouter Framer Motion aux 3 composants principaux
- Premier commit

**Option B:** Complète UI overhaul (3-4h)
- Toutes les phases
- Tous les nouveaux composants
- Tests intégration

**Je recommande:** **Option A** → commit → **Option B** demain

Quoi tu fais? 🎯
