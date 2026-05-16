# IronHaus — AI-Powered Gym Automation Platform

**IronHaus** is a production-grade, full-stack AI automation platform built for independent gym owners and fitness facilities. It functions as both a **high-ticket sales demo** and a **reusable template for AI Automation Agencies**.

The platform deploys a sophisticated stateful AI agent that autonomously qualifies leads, answers pricing questions, and books introductory sessions — 24/7, no human intervention required.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [AI Agent](#ai-agent)
- [Database](#database)
- [Security](#security)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Design System](#design-system)

---

## Overview

IronHaus solves a core problem for independent gym owners: missed leads and manual booking overhead. The platform's AI agent handles every website visitor interaction — from first message to booked session — while the owner focuses on running the facility.

**Key Results (Demonstrated)**
- 40+ hours/month saved on manual follow-up
- 40% increase in intro session bookings
- 24/7 lead capture with zero human overhead

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.2.4 | App Router, React Server Components, BFF Route Handlers |
| React | 19 | UI rendering |
| TypeScript | 5.7.3 | End-to-end type safety |
| Tailwind CSS | 4.2.0 | Utility-first styling, custom Aura Minimalist theme |
| Radix UI | latest | 30+ accessible headless UI components |
| Zod | latest | Runtime schema validation (requests + responses) |
| Drizzle ORM | latest | Type-safe PostgreSQL client for frontend migrations |
| Upstash Redis | latest | Edge rate limiting (15 req/hr per IP) |
| react-markdown | latest | Renders agent responses with full markdown support |
| Recharts | 2.15.0 | Dashboard charts in Hero section |
| Vercel Analytics | latest | Production usage analytics |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| FastAPI | 0.136.1+ | Async REST API, dependency injection, global error handling |
| Python | 3.13+ | Runtime |
| OpenAI Agents SDK | 0.15.1+ | Agent orchestration, tool use, session management |
| GPT-4o-mini | — | Language model powering the agent |
| Psycopg 3 | latest | Async PostgreSQL driver (parametrized queries) |
| Pydantic v2 | latest | Request/response validation |
| Pydantic Settings | latest | Type-safe config from environment variables |
| uv | latest | Fast Python package manager |

### Infrastructure
| Service | Purpose |
|---|---|
| Neon | Serverless PostgreSQL database |
| Upstash Redis | Edge rate limiting |
| Vercel | Frontend hosting |
| FastAPI Cloud | Backend hosting |
| SQLite (local) | Agent session storage (`backend/data/sessions.db`) |

---

## Architecture

IronHaus uses a **Backend-For-Frontend (BFF)** pattern. No secrets, API keys, or business logic are ever exposed to the browser.

```
Browser (React)
    │
    │  POST /api/chat  { message, sessionId }
    ▼
Next.js BFF Route Handler (/app/api/chat/route.ts)
    ├── Zod schema validation
    ├── Upstash rate limit check (15 req/hr per IP)
    ├── Attaches X-API-Key header
    └── Forwards to FastAPI
    │
    │  POST /api/v1/chat  { message, session_id }
    ▼
FastAPI Backend (/backend)
    ├── verify_api_key() — timing-safe secrets.compare_digest()
    ├── Pydantic input validation
    └── process_chat(message, session_id)
    │
    ▼
OpenAI Agents SDK (gpt-4o-mini)
    ├── Reads IRON_HAUSE_SYSTEM_PROMPT
    ├── Loads conversation history (SQLiteSession)
    ├── Reasons about tool use
    │
    ├── capture_lead(name, email, message)
    │       ├── @tool_input_guardrail validates email + name
    │       └── INSERT into Neon leads table
    │
    └── book_intro_session(preferred_date, notes?)
            └── INSERT into Neon bookings table
    │
    ▼
Response text → FastAPI → BFF → Browser
```

### Security Layers (Defense in Depth)

1. **Rate Limiting** — Edge-level IP check before any processing
2. **Schema Validation** — Zod (BFF) + Pydantic (backend) + tool guardrails
3. **Authentication** — `X-API-Key` header, timing-safe comparison
4. **SQL Safety** — Parametrized queries, no string interpolation
5. **Error Masking** — Global handler, never exposes stack traces
6. **Session Isolation** — UUID-keyed sessions in local SQLite

---

## Project Structure

```
IronHaus/
├── app/
│   ├── layout.tsx              # Root layout, fonts (Geist, Anton, JetBrains Mono), metadata
│   ├── page.tsx                # Landing page (all sections + chat widget)
│   ├── globals.css             # Tailwind theme variables, animations, utility classes
│   └── api/
│       └── chat/
│           └── route.ts        # BFF: rate limit → validate → forward to FastAPI
│
├── components/
│   ├── AIAgentChat.tsx         # Floating chat widget (UUID session, markdown, skeleton loader)
│   ├── layout/
│   │   ├── Navbar.tsx          # Sticky nav with scroll detection, mobile menu
│   │   └── Footer.tsx          # Footer with links
│   ├── sections/
│   │   ├── Hero.tsx            # Hero with live dashboard mock (charts, metrics, activity log)
│   │   ├── Programs.tsx        # Platform features overview
│   │   ├── Pricing.tsx         # Three-tier pricing (£99/mo, £1.5k flat, Enterprise)
│   │   ├── Testimonials.tsx    # Client case studies
│   │   └── CTA.tsx             # Call-to-action section
│   ├── theme-provider.tsx      # Dark mode wrapper
│   └── ui/                     # 30+ Radix UI shadcn components
│
├── lib/
│   ├── api-client.ts           # sendChatMessage() — client-side API with Zod validation
│   ├── fastapi.ts              # forwardToBackend() — BFF proxy with auth header injection
│   ├── ratelimit.ts            # Upstash sliding-window rate limiter (15 req/hr)
│   ├── schemas.ts              # ChatRequestSchema, ChatResponseSchema (single source of truth)
│   ├── utils.ts                # Utility functions (cn, etc.)
│   └── db/
│       ├── schema.ts           # Drizzle schema: leads + bookings tables
│       ├── index.ts            # Drizzle client (Neon serverless driver)
│       └── migrations/         # Auto-generated SQL migration files
│
├── hooks/                      # Custom React hooks
│
├── backend/
│   ├── main.py                 # FastAPI app, lifespan, health check, global error handler
│   ├── pyproject.toml          # Python dependencies (uv)
│   ├── .env                    # Backend secrets (gitignored)
│   ├── core/
│   │   ├── config.py           # Pydantic Settings (OPENAI_API_KEY, DATABASE_URL, API_AUTH_TOKEN)
│   │   ├── auth.py             # verify_api_key() dependency — timing-safe comparison
│   │   ├── database.py         # get_db_url() utility
│   │   └── ai.py               # AsyncOpenAI client, OpenAIResponsesModel, RunConfig
│   ├── routers/
│   │   └── agent.py            # POST /api/v1/chat — protected by verify_api_key
│   ├── services/
│   │   └── agent_service.py    # iron_hause_agent definition, process_chat(), SQLiteSession
│   ├── tools/
│   │   ├── lead_tools.py       # capture_lead() — validates + inserts into leads table
│   │   ├── booking_tools.py    # book_intro_session() — inserts into bookings table
│   │   ├── guardrails.py       # @tool_input_guardrail: email regex, name length check
│   │   └── __init__.py         # Tool exports
│   ├── prompts/
│   │   ├── instructions.py     # IRON_HAUSE_SYSTEM_PROMPT (full agent personality + rules)
│   │   └── __init__.py
│   ├── schemas/
│   │   └── chat.py             # ChatRequest / ChatResponse Pydantic models
│   └── data/
│       └── sessions.db         # SQLite session store (auto-created at runtime)
│
├── public/                     # Static assets
├── package.json                # Frontend deps + scripts
├── tsconfig.json               # TypeScript config (ES6, strict)
├── tailwind.config.ts          # Tailwind v4 with custom theme extensions
├── next.config.mjs             # Next.js config
├── drizzle.config.ts           # Drizzle Kit: schema path, migrations output, dialect
└── .env.local                  # Frontend secrets (gitignored)
```

---

## AI Agent

The agent is built with the **OpenAI Agents SDK** and runs on `gpt-4o-mini`.

### Agent Definition (`backend/services/agent_service.py`)

```python
iron_hause_agent = Agent(
    name="IronHause Assistant",
    instructions=IRON_HAUSE_SYSTEM_PROMPT,
    model="gpt-4o-mini",
    tools=[capture_lead, book_intro_session],
)
```

### System Prompt Behavior

The agent is instructed to follow a strict conversation funnel:

**Educate → Qualify → Capture → Book → Support**

1. Greet and understand the visitor's needs
2. Explain IronHause services and pricing
3. Collect name, email, and requirements (all three required before calling `capture_lead`)
4. Only call `book_intro_session` when user explicitly asks to book
5. Confirm all details with user before calling any tool
6. Refuse out-of-scope requests (fitness plans, medical advice) and redirect to gym staff

**Tone**: Warm, professional, concise (max ~150 words per response unless detail is needed). Never pushy.

### Tools

#### `capture_lead(name, email, message)`
- Protected by `@tool_input_guardrail` — validates email regex and name length ≥ 2 chars before execution
- Inserts into `leads` table with parametrized psycopg query
- Returns confirmation with prospect's name

#### `book_intro_session(preferred_date, notes?)`
- Inserts into `bookings` table with status `"pending"` (IronHause team manually confirms)
- Returns confirmation with booking ID

### Session Management
- Client generates a UUID on first visit, stored in `localStorage` as `ironhaus_session_id`
- UUID sent with every request as `sessionId`
- Backend creates `SQLiteSession(session_id)` to persist full conversation history
- Sessions stored in `backend/data/sessions.db`
- Max 10 turns per request (`max_turns=10`) prevents infinite agent loops

### Pricing (Agent Knows)
| Tier | Price | Target |
|---|---|---|
| Agent Plugin | £99/month | Existing gym websites |
| Full Platform | £1,500 flat | New websites needing full solution |
| Enterprise | Custom | Multi-location facilities |

---

## Database

**Provider**: Neon (serverless PostgreSQL)

### Schema (`lib/db/schema.ts`)

```typescript
// Leads table
leads {
  id          serial PRIMARY KEY
  name        varchar(255) NOT NULL
  email       varchar(255) NOT NULL
  message     text
  source      varchar(100) DEFAULT 'ai_agent'
  createdAt   timestamp DEFAULT now()
}

// Bookings table
bookings {
  id            serial PRIMARY KEY
  leadId        integer → leads.id
  preferredDate varchar(100)
  notes         text
  status        varchar(50) DEFAULT 'pending'
  createdAt     timestamp DEFAULT now()
}
```

### TypeScript Types (auto-inferred by Drizzle)
- `Lead`, `NewLead` from `leads` table
- `Booking`, `NewBooking` from `bookings` table

### Migrations
```bash
pnpm db:generate   # Generate SQL from schema changes
pnpm db:migrate    # Apply migrations to Neon
```

---

## Security

IronHaus received a **92/100 security grade** after audit. Key measures:

### No Client-Side Secrets
The browser never sees `OPENAI_API_KEY`, `DATABASE_URL`, or `BACKEND_API_TOKEN`. All sensitive operations happen server-side.

### API Authentication
```python
# backend/core/auth.py
async def verify_api_key(x_api_key: str = Header(...)):
    if not secrets.compare_digest(x_api_key, settings.API_AUTH_TOKEN):
        raise HTTPException(status_code=403)
```
`secrets.compare_digest()` prevents timing attacks that could reveal the token character-by-character.

### Rate Limiting
```typescript
// lib/ratelimit.ts
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(15, "1 h"),
})
```
15 requests per hour per IP. Gracefully degrades if Redis is unavailable.

### Input Validation (4 Layers)
1. **Client** — Zod `ChatRequestSchema` in `sendChatMessage()`
2. **BFF** — Zod validation in `/api/chat` route
3. **Backend** — Pydantic `ChatRequest` model
4. **Tool Guardrails** — `@tool_input_guardrail` validates before DB write

### SQL Injection Prevention
All database queries use parametrized psycopg queries — no string interpolation anywhere.

### Error Masking
```python
# backend/main.py
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})
```
Stack traces never reach the client.

---

## Environment Variables

### Frontend (`.env.local`)

```env
# Backend connection
FASTAPI_BACKEND_URL=http://127.0.0.1:8000/api/v1
BACKEND_API_TOKEN=<32-byte random token — must match backend API_AUTH_TOKEN>

# Database (for Drizzle migrations only)
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Upstash rate limiting
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=<token>
```

### Backend (`backend/.env`)

```env
# AI
OPENAI_API_KEY=sk-...

# Auth (must match frontend BACKEND_API_TOKEN exactly)
API_AUTH_TOKEN=<32-byte random token>

# Database
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Optional
DEBUG=False
```

> **Important**: `BACKEND_API_TOKEN` and `API_AUTH_TOKEN` must be identical. Generate with:
> ```bash
> python -c "import secrets; print(secrets.token_urlsafe(32))"
> ```

---

## Getting Started

### Prerequisites
- Node.js 20+ and pnpm
- Python 3.13+ and uv
- Neon account (free tier works)
- Upstash account (free tier works)
- OpenAI API key

### 1. Clone & Install

```bash
git clone <repo-url>
cd IronHaus

# Frontend
pnpm install

# Backend
cd backend
uv sync
```

### 2. Configure Environment

```bash
# Root
cp .env.local.example .env.local
# Fill in FASTAPI_BACKEND_URL, BACKEND_API_TOKEN, DATABASE_URL, Upstash vars

# Backend
cp backend/.env.example backend/.env
# Fill in OPENAI_API_KEY, API_AUTH_TOKEN, DATABASE_URL
```

### 3. Database Setup

```bash
# Generate and apply migrations
pnpm db:generate
pnpm db:migrate
```

### 4. Run Locally

```bash
# Terminal 1 — Frontend
pnpm dev
# Runs on http://localhost:3000

# Terminal 2 — Backend
cd backend
uvicorn main:app --reload
# Runs on http://localhost:8000
# Docs at http://localhost:8000/docs
```

---

## Deployment

### Frontend → Vercel
1. Push to GitHub
2. Import in Vercel
3. Add all `.env.local` variables to Vercel environment settings
4. Set `FASTAPI_BACKEND_URL` to your production backend URL

### Backend → FastAPI Cloud (or any VPS/container)
1. Set all `backend/.env` variables in the hosting environment
2. Production command: `uvicorn main:app --host 0.0.0.0 --port 8000`
3. Ensure `API_AUTH_TOKEN` matches the `BACKEND_API_TOKEN` on Vercel

### Database → Neon
- Already serverless, no additional deployment needed
- Use the same `DATABASE_URL` in both frontend and backend envs

---

## Design System

IronHaus uses an **"Aura Minimalist"** design language.

### Color Palette (`app/globals.css`)
| Token | Value | Usage |
|---|---|---|
| `--color-aura-primary` | `#00F0FF` | Cyan accents, glows, CTAs |
| `--color-aura-secondary` | `#7000FF` | Purple gradients |
| `--color-aura-bg` | `#030508` | Page background (near-black) |
| `--color-aura-surface` | `rgba(255,255,255,0.03)` | Card/glass surfaces |
| `--color-aura-border` | `rgba(255,255,255,0.08)` | Ultra-thin borders |

### Typography
- **Display**: Anton (headlines)
- **Body**: Geist (main UI text)
- **Code/Mono**: JetBrains Mono (chat messages, metrics)

### Key CSS Utilities
- `.glass-surface` — backdrop blur + ultra-thin border + hover lift effect
- `.text-gradient` — cyan-to-purple gradient text
- `.btn-glow` — cyan-to-blue button with outer glow
- `@keyframes float` — Y-axis bobbing for background orbs
- `@keyframes pulse-glow` — Scale + opacity pulse for indicators

---

## Scripts Reference

### Frontend
```bash
pnpm dev          # Next.js dev server
pnpm build        # Production build
pnpm start        # Production server
pnpm lint         # ESLint
pnpm db:generate  # Generate Drizzle migrations from schema
pnpm db:migrate   # Apply migrations to Neon
pnpm db:studio    # Open Drizzle Studio (visual DB browser)
```

### Backend
```bash
uvicorn main:app --reload          # Dev server with hot reload
uvicorn main:app --host 0.0.0.0    # Production
uv add <package>                    # Add dependency
uv sync                             # Install all deps from pyproject.toml
```

---

*IronHaus — Automating the fitness industry, one facility at a time.*
