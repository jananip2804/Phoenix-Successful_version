from fastapi import APIRouter, Query
from app.ai.processor import processor, vector_store
from app.database.firestore import firestore_db

router = APIRouter(prefix="/api/search", tags=["search"])

@router.get("/")
def semantic_search(q: str = Query(..., description="The search query string")):
    # Generate embedding for the query
    query_embedding = processor.generate_embedding(q)
    
    # Search the vector store
    results = vector_store.search(query_embedding, top_k=10)
    
    # Enrich with document details from Firestore
    enriched_results = []
    for res in results:
        doc = firestore_db.get_document(res["doc_id"])
        if doc:
            doc["similarity"] = res["similarity"]
            enriched_results.append(doc)
            
    return {"query": q, "results": enriched_results}
