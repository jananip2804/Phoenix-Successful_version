from fastapi import APIRouter
from app.database.firestore import firestore_db

router = APIRouter(prefix="/api/graph", tags=["graph"])

@router.get("/")
def get_knowledge_graph():
    return firestore_db.get_graph()
