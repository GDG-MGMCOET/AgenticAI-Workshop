# 🎬 Agentic AI Workshop – Netflix Multi-Agent System (JavaScript)

This project demonstrates a multi-agent architecture using the OpenAI Agents SDK in JavaScript.

It simulates a Netflix-style subscription system with intelligent routing, tool usage, streaming, and run context handling.

---

## 🚀 Concepts Covered

### 1️⃣ Agent Handoffs

- A **Reception Agent** understands user intent.
- It routes requests to:
  - **Subscription Agent** (plan queries)
  - **Refund Agent** (refund processing)

- Demonstrates real-world delegation between specialized agents.

---

### 2️⃣ Tool Calling

Agents use structured tools:

- `fetch_available_plans` → Returns available subscription plans
- `process_refund` → Logs refund requests to a file

Tools use **Zod schemas** for structured parameter validation.

---

### 3️⃣ Streaming

Shows how to stream intermediate agent responses while:

- Understanding the request
- Calling tools
- Producing the final response

Useful for:

- Real-time chat interfaces
- Live dashboards
- Interactive UIs

---

### 4️⃣ Run Context

Demonstrates how `run()` manages:

- Execution state
- Tool calls
- Conversation history
- Multi-step workflows

---

## 🧠 Architecture Overview

```
User
  ↓
Reception Agent (Router)
  ↓
 ┌───────────────┬───────────────┐
Subscription   Refund Agent
Agent          (Tool: process_refund)
(Tool: fetch_available_plans)
```

---

## 📦 Installation

Make sure you have **Node.js 18+** installed.

Install dependencies:

```bash
npm install
```

If setting up from scratch:

```bash
npm install @openai/agents zod dotenv
```

---

## ▶️ Running the Project

```bash
node filename.js
```

Make sure your `.env` file contains:

```
OPENAI_API_KEY=your_api_key_here
```

---

## 🛠 Tech Stack

- Node.js
- JavaScript (ESM)
- OpenAI Agents SDK
- Zod
- Node File System (for mock persistence)

---

## 📚 Learning Outcomes

This project demonstrates:

- Multi-agent orchestration
- Intelligent routing between agents
- Structured tool execution
- Streaming responses
- Execution tracing via run context

---
