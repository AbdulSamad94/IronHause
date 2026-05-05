# IronHause: AI-Powered Facility Automation Demo

**IronHause** is a premium, interactive portfolio piece and sales tool designed specifically for AI Automation Agencies to pitch Gym Owners, Personal Trainers, and Fitness Facilities. 

Instead of presenting a generic agency landing page, IronHause acts as a **"Trojan Horse" demo**. It shows the prospect an incredibly high-end, modern fitness website that features a fully integrated AI Agent built right into the interface. This allows gym owners to see *exactly* how AI can automate their operations in a live, realistic environment.

---

## 🎯 The Pitch / Objective

This project is built to answer the gym owner's question: *"What does an AI agent actually do for me?"*

By sending them to this site, they experience a gym website that is fully automated:
1. **Lead Generation**: Capturing prospect information 24/7.
2. **Booking Automation**: Handling personal training and class schedules without human intervention.
3. **Customer Support**: Answering pricing, hours, and facility queries instantly.

---

## 🎨 UI/UX & Design System

The aesthetics of this project follow a highly polished **"Aura Minimalist / Premium SaaS"** design language, formulated to look expensive, professional, and technologically advanced.

Key design features include:
- **Aura Glassmorphism**: Cards and interfaces utilize `backdrop-blur-3xl` with sleek, transparent gradients and ultra-fine `white/5` borders to create deep, floating elements.
- **Modern Typography**: Utilizing Vercel's elegant `Geist` and `Geist Mono` font stacks for a clean, editorial SaaS aesthetic.
- **Ambient Lighting**: Floating cyan and deep blue orbs glow dynamically in the background.
- **Premium Interactivity**: Micro-animations, responsive hover states, and smooth transitions give the site a high-ticket "Pro Max" feel.

---

## 💻 Architecture & Tech Stack

This project utilizes a highly secure **Backend-For-Frontend (BFF) Architecture**:

1. **Frontend (Vercel)**: 
   - Framework: [Next.js](https://nextjs.org/) (React)
   - Styling: [Tailwind CSS](https://tailwindcss.com/) with custom CSS variables.
   - The browser never talks directly to the backend. It routes requests through Next.js API Routes (`/api/chat`).
2. **Backend (FastAPI Cloud)**:
   - Framework: [FastAPI](https://fastapi.tiangolo.com/) (Python)
   - AI Engine: [OpenAI Agents SDK](https://github.com/openai/openai-agents-python)
   - Database: Provisioned for NeonDB Serverless Postgres.
   - The backend is securely isolated. It only receives server-to-server requests from Vercel, bypassing CORS issues and hiding API keys from the public.

---

## 🚀 Getting Started

### 1. Frontend Setup (Next.js)

```bash
npm install
npm run dev
```

Create a `.env.local` file in the root:
```env
# Point this to your FastAPI Cloud URL in production
FASTAPI_BACKEND_URL=http://127.0.0.1:8000/api/v1
```

### 2. Backend Setup (FastAPI)

Navigate to the `backend/` directory:

```bash
cd backend
uv sync
```

Create a `.env` file inside the `backend/` folder:
```env
OPENAI_API_KEY=sk-...
```

Run the FastAPI server:
```bash
uvicorn main:app --reload
```

---

## ☁️ Deployment

- **Frontend**: Deployed on [Vercel](https://vercel.com/). Ensure `FASTAPI_BACKEND_URL` is set in Vercel's environment variables.
- **Backend**: Deployed on **FastAPI Cloud** (Early Access). Ensure `OPENAI_API_KEY` is set securely in your FastAPI Cloud project dashboard.

---

## 🤖 Next Steps: Expanding Agent Capabilities

The AI Agent is now fully connected via the OpenAI Agents SDK. 

**To make the agent more powerful, the next steps are:**
1. **Implement Function Tools**: Use the `@function_tool` decorator to give the agent the ability to check real calendar availability, book sessions, and capture email addresses into a CRM.
2. **Connect NeonDB**: Implement SQLAlchemy models to save captured leads and chat histories to Neon Serverless Postgres.
3. **Guardrails & Tracing**: Add input/output guardrails to ensure the agent stays strictly on-topic (fitness automation).

---

*Built for the future of automated fitness facilities.*
