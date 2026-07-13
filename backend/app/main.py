from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import documents

app = FastAPI(
    title="Project Phoenix API",
    description="The Internet's Knowledge Rescue Engine",
    version="1.0.0",
)

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Project Phoenix API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
