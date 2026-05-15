# IronHaus Backend

FastAPI backend powering the IronHaus AI agent. Handles chat, lead capture, and intro session booking via a stateful OpenAI agent with tool use and input guardrails.

## Stack

- **FastAPI** — async REST API
- **OpenAI Agents SDK** (`openai-agents`) — agent loop, tool use, guardrails
- **GPT-4o-mini** — underlying model via `OpenAIResponsesModel`
- **psycopg v3** — async Postgres driver for Neon
- **Pydantic Settings** — typed config from `.env`
- **uv** — package manager

## Project Structure

```
backend/
├── main.py                  # FastAPI app, lifespan, router registration
├── core/
│   ├── config.py            # Pydantic Settings (reads .env)
│   └── ai.py                # OpenAI client, model, RunConfig
├── routers/
│   └── agent.py             # POST /api/v1/chat endpoint
├── services/
│   └── agent_service.py     # Agent definition + process_chat()
├── tools/
│   ├── lead_tools.py        # capture_lead() function tool
│   ├── booking_tools.py     # book_intro_session() function tool
│   └── guardrails.py        # validate_lead_data input guardrail
├── prompts/
│   └── instructions.py      # IRON_HAUSE_SYSTEM_PROMPT
├── schemas/
│   └── chat.py              # ChatRequest / ChatResponse Pydantic models
└── data/
    └── sessions.db          # SQLite session store (auto-created)
```

## API

### `POST /api/v1/chat`

Runs a message through the IronHaus agent and returns a response.

**Request**
```json
{
  "message": "I want to book an intro session",
  "session_id": "uuid-string"   
}
```

**Response**
```json
{
  "response": "Sure! What date works best for you?"
}
```

`session_id` is optional. When provided, the agent maintains conversation history across requests via SQLite.

### `GET /health`

Returns `{ "status": "healthy" }`.

## Agent Tools

| Tool | Trigger | Guardrail |
|---|---|---|
| `capture_lead` | User provides name, email, and needs | `validate_lead_data` — checks email format and name length |
| `book_intro_session` | User explicitly asks to book/schedule | None |

Both tools write to Neon Postgres. `capture_lead` inserts into `leads`, `book_intro_session` inserts into `bookings`.

## Setup

**Prerequisites:** Python 3.13+, [uv](https://docs.astral.sh/uv/)

```bash
# Install dependencies
uv sync

# Create .env
cp .env.example .env
# Fill in OPENAI_API_KEY and DATABASE_URL
```

**.env**
```env
OPENAI_API_KEY=sk-...
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
API_AUTH_TOKEN=your-secret-token
```

## Running

```bash
# Development (auto-reload)
uvicorn main:app --reload

# Production
uvicorn main:app --host 0.0.0.0 --port 8000
```

API docs available at `http://localhost:8000/docs`.

## Deployment

The backend is deployed on **[FastAPI Cloud](https://fastapicloud.com)** — the official hosting platform built by Sebastián Ramírez (tiangolo), the creator of FastAPI. It's currently in private beta with single-command deployments, automatic HTTPS, autoscaling, and a built-in metrics dashboard. Deploying is as simple as:

```bash
fastapi deploy
```

The frontend (Next.js) is deployed separately on **Vercel**.

| Service | Platform | URL |
|---|---|---|
| Backend (FastAPI) | FastAPI Cloud | — |
| Frontend (Next.js) | Vercel | — |

## Database

Schema is managed by Drizzle ORM from the Next.js frontend (`lib/db/schema.ts`). Run migrations from the project root:

```bash
npx drizzle-kit generate   # generate migration from schema changes
npx drizzle-kit migrate    # apply to Neon
```

Tables: `leads`, `bookings`.
