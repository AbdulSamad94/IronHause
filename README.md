# IronHause: AI-Powered Facility Automation (Pro Max Edition)

**IronHause** is a premium, full-stack AI automation platform designed for independent gym owners and fitness facilities. It serves as both a high-ticket sales demo and a production-ready template for AI Automation Agencies.

Experience a gym website where every visitor interaction is handled by a sophisticated, stateful AI agent that qualifies leads, answers complex pricing questions, and books introductory sessions autonomously.

---

## 🤖 The "IronHause" AI Agent

The core of this platform is a state-of-the-art AI Agent built with the **OpenAI Agents SDK**. It is not just a chatbot; it is a functional worker integrated directly into the business infrastructure.

### ✨ Key Agent Capabilities
- **Stateful Memory**: Uses `SQLiteSession` to remember user names, preferences, and conversation context across page refreshes and multi-turn conversations.
- **Lead Capture Tool**: Automatically identifies intent and calls `capture_lead()` to save prospect details into the Neon database using parametrized SQL queries.
- **Booking Tool**: Orchestrates `book_intro_session()` to record scheduling requests for facility tours or consultations.
- **Input Guardrails**: Uses the latest `@tool_input_guardrail` API to ensure only high-quality data (valid emails, full names) enters the database before the main tool logic executes.
- **Strict Boundary Control**: The agent is explicitly instructed to refuse out-of-scope requests (e.g., fitness plans, medical advice) and redirect users to the gym staff, keeping it 100% focused on IronHause services.

---

## 💻 Tech Stack & Architecture (Pro Max Refactor)

This project utilizes a secure **Backend-For-Frontend (BFF)** pattern to ensure API keys, database connections, and business logic are never exposed to the client. The system has been hardened following Next.js 15+ and Clean Code best practices.

### 1. Frontend (Next.js 15+ App Router)
- **Framework**: [Next.js](https://nextjs.org/) using Server Components and Route Handlers.
- **End-to-End Type Safety**: Utilizes `zod` for strict runtime validation of both outbound requests and inbound responses (`lib/schemas.ts`).
- **Premium UX**: "Aura Minimalist" design featuring smooth `framer-motion` animations, glassmorphism, and premium skeleton loaders (shimmer effects) during agent processing.
- **Markdown Rendering**: Agent responses are formatted beautifully using `react-markdown` and `remark-gfm`.
- **Security**: Upstash Edge Rate Limiting (15 req/hr per IP) prevents API abuse before requests ever reach the backend.

### 2. Backend (FastAPI + Python 3.13)
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) providing high-performance async execution.
- **AI Engine**: [OpenAI Agents SDK](https://github.com/openai/openai-agents-python) powered by `gpt-4o-mini`, configured with `max_turns` safety circuits to prevent infinite loops.
- **Security "Gatekeeper"**: A custom `Depends(verify_api_key)` router dependency ensures the backend only accepts requests from the Next.js BFF, verified via a timing-safe `secrets.compare_digest()` check.
- **Global Error Handling**: A global exception handler ensures internal stack traces are never leaked; clients always receive a clean JSON 500 response on failure.
- **Database Driver**: [Psycopg 3](https://www.psycopg.org/psycopg3/) (Async) for high-performance direct queries from the AI Agent, utilizing named parameters to prevent SQL injection.

---

## 📂 Project Structure

```markdown
├── app/                    # Next.js Server Components & BFF Route Handlers
├── backend/                # FastAPI Application (Agent Engine)
│   ├── core/               # Security, Auth, DB Connection & Pydantic Settings
│   ├── prompts/            # Centralized Agent Instructions & Guardrails
│   ├── tools/              # AI Function Tools (@function_tool) with Guardrails
│   ├── services/           # Agent orchestration & SQLite Session management
│   └── routers/            # HTTP Handlers protected by API Key
├── components/             # Premium Aura Minimalist UI Components (Chat Interface)
├── lib/                    # Shared Utilities (Zod Schemas, BFF Proxy, Rate limiting)
└── drizzle.config.ts       # Database migration configuration
```

---

## Getting Started

### 1. Database Setup (Neon)
Create a free project at [neon.tech](https://neon.tech) and get your connection string.

### 2. Environment Configuration
Create a `.env.local` (root) and `.env` (backend/):

```env
# ==========================================
# FRONTEND (.env.local)
# ==========================================
# Neon DB (For Drizzle Migrations)
DATABASE_URL=postgresql://...

# Upstash Rate Limiting
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...

# Backend Connection
FASTAPI_BACKEND_URL=http://127.0.0.1:8000/api/v1
BACKEND_API_TOKEN=generate_a_secure_32_byte_token_here

# ==========================================
# BACKEND (backend/.env)
# ==========================================
# Application Settings
APP_NAME="IronHaus Backend API"
DEBUG=True

# Security
OPENAI_API_KEY=sk-...
API_AUTH_TOKEN=generate_a_secure_32_byte_token_here (Must match BACKEND_API_TOKEN)

# Database Connection (Psycopg3)
DATABASE_URL=postgresql://...
```

### 3. Installation & Migrations
```bash
# Root (Frontend dependencies and DB Migrations)
pnpm install
pnpm db:generate
pnpm db:migrate

# Backend (Python environment setup)
cd backend
uv sync
```

### 4. Running Locally
```bash
# Terminal 1 (Frontend)
pnpm dev

# Terminal 2 (Backend)
cd backend
uvicorn main:app --reload
```

---

## Security Posture
The platform has undergone rigorous security auditing (graded A - 92/100) and features:
1. **No Client-Side Secrets**: Browser clients never touch OpenAI or DB keys.
2. **Backend Authentication**: The FastAPI server silently rejects unauthorized access attempts.
3. **Parametrized Queries**: Tool functions use safe SQL bindings to prevent injection attacks.
4. **Agent Guardrails**: Inputs are validated and rejected *before* reaching expensive tool logic.
5. **Cost Control**: Strict limits on agent turn counts and external request rates.

---

## Design Philosophy
IronHause follows an **"Aura Minimalist"** design language:
- **Glassmorphism**: Heavy use of `backdrop-blur` and ultra-thin borders.
- **Aura Lighting**: Dynamic glowing orbs and gradients to create depth.
- **Editorial Typography**: Clean, high-ticket font stacks for a premium SaaS feel.
- **Premium Micro-interactions**: Shimmer skeleton loaders and smooth markdown rendering for agent responses.

*Automating the fitness industry, one facility at a time.*
