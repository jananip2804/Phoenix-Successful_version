from fastapi import APIRouter
from app.database.firestore import firestore_db

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("/")
def get_analytics():
    return firestore_db.get_analytics()
