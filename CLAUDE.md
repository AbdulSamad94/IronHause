# CLAUDE.md — IronHaus

AI-powered gym automation platform. Full-stack: Next.js 16 frontend + FastAPI backend + OpenAI Agents SDK. Serves as both a sales demo and a reusable template for AI Automation Agencies.

---

## Project Structure

```
IronHaus/
├── app/                         # Next.js App Router (frontend + BFF)
│   ├── api/chat/route.ts        # BFF: rate limit → Zod validate → forward to FastAPI
│   ├── layout.tsx               # Root layout, fonts, dark mode
│   ├── page.tsx                 # Landing page (all sections)
│   └── globals.css              # Tailwind theme vars, animations, glass utilities
├── components/
│   ├── AIAgentChat.tsx          # Chat widget (localStorage session UUID, markdown, skeleton)
│   ├── layout/                  # Navbar, Footer
│   └── sections/                # Hero, Programs, Pricing, Testimonials, CTA
├── lib/
│   ├── schemas.ts               # Zod schemas — SINGLE SOURCE OF TRUTH for API contract
│   ├── api-client.ts            # sendChatMessage() — client-side with Zod validation
│   ├── fastapi.ts               # forwardToBackend() — BFF proxy, injects X-API-Key
│   ├── ratelimit.ts             # Upstash sliding-window rate limiter (15 req/hr/IP)
│   └── db/
│       ├── schema.ts            # Drizzle ORM: leads + bookings tables
│       └── index.ts             # Drizzle client (Neon serverless)
├── backend/
│   ├── main.py                  # FastAPI app, lifespan, global error handler, health check
│   ├── core/
│   │   ├── config.py            # Pydantic Settings (reads .env)
│   │   ├── auth.py              # verify_api_key() — timing-safe secrets.compare_digest()
│   │   ├── database.py          # get_db_url()
│   │   └── ai.py                # AsyncOpenAI client, OpenAIResponsesModel, RunConfig
│   ├── routers/agent.py         # POST /api/v1/chat — protected by Depends(verify_api_key)
│   ├── services/agent_service.py# Agent definition, process_chat(), SQLiteSession
│   ├── tools/
│   │   ├── lead_tools.py        # capture_lead() tool with guardrail
│   │   ├── booking_tools.py     # book_intro_session() tool
│   │   └── guardrails.py        # @tool_input_guardrail: email regex + name length
│   ├── prompts/instructions.py  # IRON_HAUSE_SYSTEM_PROMPT
│   └── schemas/chat.py          # ChatRequest / ChatResponse Pydantic models
└── drizzle.config.ts            # Drizzle Kit config
```

---

## Commands

### Frontend
```bash
pnpm dev              # Dev server → http://localhost:3000
pnpm build            # Production build
pnpm lint             # ESLint
pnpm db:generate      # Generate Drizzle migrations from schema changes
pnpm db:migrate       # Apply migrations to Neon
pnpm db:studio        # Open Drizzle Studio (visual DB browser)
```

### Backend
```bash
cd backend
uvicorn main:app --reload          # Dev server → http://localhost:8000
                                   # API docs → http://localhost:8000/docs
uv sync                            # Install all dependencies
uv add <package>                   # Add a new dependency
```

---

## Architecture — BFF Pattern

All secrets live server-side. Browser never sees `OPENAI_API_KEY`, `DATABASE_URL`, or `BACKEND_API_TOKEN`.

```
Browser → /api/chat (BFF) → POST /api/v1/chat (FastAPI) → Agent → Neon
```

**BFF responsibilities** (`app/api/chat/route.ts`):
1. Zod schema validation on request body
2. Upstash rate limit check (429 if exceeded)
3. Inject `X-API-Key: BACKEND_API_TOKEN` header
4. Forward to `FASTAPI_BACKEND_URL/api/v1/chat`

---

## Environment Variables

### Frontend (`.env.local`)
```env
FASTAPI_BACKEND_URL=http://127.0.0.1:8000/api/v1
BACKEND_API_TOKEN=<must match backend API_AUTH_TOKEN>
DATABASE_URL=postgresql://...?sslmode=require
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=...
```

### Backend (`backend/.env`)
```env
OPENAI_API_KEY=sk-...
API_AUTH_TOKEN=<must match frontend BACKEND_API_TOKEN>
DATABASE_URL=postgresql://...?sslmode=require
DEBUG=False
```

Generate a token: `python -c "import secrets; print(secrets.token_urlsafe(32))"`

---

## Database Schema

**Provider**: Neon (serverless PostgreSQL). Drizzle ORM with TypeScript-inferred types.

```typescript
// lib/db/schema.ts
leads    { id, name, email, message, source="ai_agent", createdAt }
bookings { id, leadId → leads.id, preferredDate, notes, status="pending", createdAt }
```

Types: `Lead`, `NewLead`, `Booking`, `NewBooking` (auto-inferred by Drizzle).

After any schema change: `pnpm db:generate && pnpm db:migrate`.

---

## AI Agent

**Model**: `gpt-4o-mini` via OpenAI Agents SDK.

**Definition** (`backend/services/agent_service.py`):
- System prompt: `IRON_HAUSE_SYSTEM_PROMPT` from `backend/prompts/instructions.py`
- Tools: `[capture_lead, book_intro_session]`
- Max turns: 10 (safety circuit — prevents infinite loops)
- Session: `SQLiteSession(session_id)` → `backend/data/sessions.db`

**Agent funnel**: Educate → Qualify → Capture → Book → Support

**Tool rules (from system prompt)**:
- `capture_lead`: Only after collecting ALL of name + email + needs. Confirm first.
- `book_intro_session`: Only when user explicitly asks to book/schedule.
- Never call both tools in the same turn.

**Guardrail** (`backend/tools/guardrails.py`):
- `@tool_input_guardrail` on `capture_lead` — runs before tool execution
- Validates: email regex `^[\w.+\-]+@[\w.-]+\.\w+$`, name length ≥ 2
- On failure: rejects with reason → agent asks user to correct input

**Session flow**:
- Client generates `crypto.randomUUID()` on first load → stored as `ironhaus_session_id` in localStorage
- Sent with every request → backend creates/resumes `SQLiteSession`

---

## Security Rules

Never break these:

1. **No client-side secrets** — `BACKEND_API_TOKEN` is only in BFF (server-side route handler), never `NEXT_PUBLIC_*`
2. **Parametrized queries only** — all psycopg queries use named params, no f-strings with user input
3. **Timing-safe auth** — `secrets.compare_digest()` in `backend/core/auth.py`, never `==`
4. **Validate at every layer** — Zod (client) → Zod (BFF) → Pydantic (backend) → guardrail (tool)
5. **Mask errors** — global exception handler returns generic 500, never stack traces

---

## Key Conventions

### TypeScript / Frontend
- Path alias `@/*` maps to project root (`tsconfig.json`)
- `cn()` from `lib/utils.ts` for conditional Tailwind classes
- Radix UI components live in `components/ui/` (shadcn pattern)
- `"use client"` directive required for components using hooks or browser APIs
- `lib/schemas.ts` is the single source of truth — update API contract here first

### Python / Backend
- Package manager: **uv** (not pip, not poetry)
- All config from `backend/core/config.py` (Pydantic Settings) — never `os.environ` directly
- New tools go in `backend/tools/`, export from `backend/tools/__init__.py`
- All new routes must use `Depends(verify_api_key)` from `backend/core/auth.py`
- Async throughout — use `async def` and `await` consistently

### Styling
- Design system: "Aura Minimalist" — near-black bg (`#030508`), cyan (`#00F0FF`), purple (`#7000FF`)
- Glass surfaces: use `.glass-surface` utility class
- Gradient text: use `.text-gradient` or `.text-gradient-cyan`
- CTA buttons: use `.btn-glow`
- Custom CSS variables defined in `app/globals.css`

---

## Adding a New Agent Tool

1. Create `backend/tools/my_tool.py` with `@function_tool` decorator
2. Add `@tool_input_guardrail` if the tool writes to the database or calls external services
3. Export from `backend/tools/__init__.py`
4. Add to `tools=[...]` list in `backend/services/agent_service.py`
5. Update system prompt in `backend/prompts/instructions.py` to tell agent when to use it

## Adding a New API Route

1. Add Zod schema to `lib/schemas.ts`
2. Create/update BFF route in `app/api/`
3. Add FastAPI endpoint in `backend/routers/` with `Depends(verify_api_key)`
4. Add Pydantic schema to `backend/schemas/`

## Changing the Database Schema

1. Edit `lib/db/schema.ts`
2. Run `pnpm db:generate` to generate migration SQL
3. Run `pnpm db:migrate` to apply to Neon
4. Update corresponding psycopg queries in `backend/tools/` if needed

---

## Pricing (Agent Context)

| Tier | Price | Target |
|---|---|---|
| Agent Plugin | £99/month | Adds agent to existing gym website |
| Full Platform | £1,500 flat | New site + agent |
| Enterprise | Custom | Multi-location facilities |

Key results: 40 hrs/month saved, 40% increase in intro session bookings.
