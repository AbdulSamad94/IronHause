# IronHaus: AI-Powered Facility Automation Demo

**IronHaus** is a premium, interactive portfolio piece and sales tool designed specifically for AI Automation Agencies to pitch Gym Owners, Personal Trainers, and Fitness Facilities. 

Instead of presenting a generic agency landing page, IronHaus acts as a **"Trojan Horse" demo**. It shows the prospect an incredibly high-end, modern fitness website that features a fully integrated AI Agent built right into the interface. This allows gym owners to see *exactly* how AI can automate their operations in a live, realistic environment.

---

## 🎯 The Pitch / Objective

This project is built to answer the gym owner's question: *"What does an AI agent actually do for me?"*

By sending them to this site, they experience a gym website that is fully automated:
1. **Lead Generation**: Capturing prospect information 24/7.
2. **Booking Automation**: Handling personal training and class schedules without human intervention.
3. **Customer Support**: Answering pricing, hours, and facility queries instantly.

---

## 🎨 UI/UX & Design System

The aesthetics of this project follow a highly polished **"Cyber-Industrial / Premium SaaS"** design language, formulated to look expensive, hardcore, and technologically advanced.

Key design features include:
- **Brutalist Glassmorphism**: Cards and buttons utilize `.brutal-border` utilities, blending frosted glass (`backdrop-filter`) with subtle glowing neon drop shadows.
- **Aggressive Typography**: Utilizing `Anton` for massive, grid-breaking headlines and `JetBrains Mono` for technical, terminal-style body copy.
- **Custom Motion Design**: Includes continuous diagonal marquees (`.skewed-section`), interactive hover text glitching (`.hover-glitch`), and floating element animations.
- **Atmospheric Textures**: A fixed SVG static `.noise-overlay` provides a raw, gritty texture across the entire application.

---

## 💻 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Custom CSS**: Vanilla CSS utilized for complex animations, custom scrollbars, and glassmorphism tokens.
- **Deployment**: Vercel ready.

---

## 🚀 Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🤖 Next Steps: Integrating the Backend AI Agent

Currently, the floating AI window (`components/AIAgentChat.tsx`) simulates a conversation to demonstrate the UX. 

**To make this fully functional, the next steps are:**
1. Connect the chat interface to a backend LLM (e.g., OpenAI `gpt-4o` or Anthropic `claude-3-opus`).
2. Implement **Function Calling / Tools**: Give the agent the ability to check real calendar availability, book sessions, and capture email addresses into a CRM.
3. Utilize a robust agent framework like `openai-agents` or LangChain to handle the memory and state of the conversation.

---

*Built for the future of automated fitness facilities.*
