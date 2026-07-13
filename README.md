# 🚀 Project Phoenix
**The Internet's Knowledge Rescue Engine**

Project Phoenix transforms forgotten knowledge into reusable intelligence. Instead of just storing documents, the system rescues hidden knowledge from PDFs, CSV files, Excel sheets, TXT, JSON, and ZIP archives.

## 🌟 Features
- **Semantic Search**: Ask natural language questions to find relevant knowledge.
- **Knowledge Graph**: Interactive view of document relationships and shared keywords.
- **Document Processing**: Automatically extracts text, keywords, and entities.
- **Analytics**: Overview of total uploads, connections, and keyword frequency.
- **Premium UI**: Dark mode first, glassmorphism, fluid animations (Framer Motion, GSAP).

## 🛠 Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, shadcn/ui, Framer Motion, GSAP, Lenis, React Router, Recharts, React Flow.
- **Backend**: FastAPI, Python, PyPDF, Firebase Admin SDK.
- **Database/Storage**: Firebase Firestore, Firebase Storage.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.11+)
- Firebase Project with Firestore and Storage enabled.

### Backend Setup
1. Navigate to the `backend` directory.
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment: `.\venv\Scripts\activate` (Windows)
4. Install dependencies: `pip install -r requirements.txt`
5. Place your `serviceAccountKey.json` in the `backend` root.
6. Run the server: `uvicorn app.main:app --reload`

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Add your Firebase config in `src/services/firebase.ts`.
4. Run the development server: `npm run dev`

## 📂 Folder Structure
- `/frontend` - React application (Vite)
  - `/components` - Reusable UI components
  - `/pages` - Core views (Dashboard, Search, Graph, etc.)
  - `/layouts` - App layout and sidebar
  - `/services` - API and Firebase connections
- `/backend` - FastAPI application
  - `/app/routers` - API endpoints
  - `/app/services` - Business logic and document processing
  - `/app/ai` - Embeddings and ML utilities
  - `/app/firebase` - Firebase initialization
  - `/app/models` - Pydantic schemas

## ☁️ Deployment
- **Frontend**: Deployed automatically to GitHub Pages via Actions.
- **Backend**: Configured for Render Free Tier (use `backend/requirements.txt` and `uvicorn app.main:app --host 0.0.0.0 --port 10000`).
