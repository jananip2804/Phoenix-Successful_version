from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from app.database.firestore import firestore_db
from app.firebase.storage import storage_client
from app.models.domain import Document
from app.services.document_service import process_document
import uuid

router = APIRouter(prefix="/api/documents", tags=["documents"])

@router.post("/")
async def upload_document(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    try:
        content = await file.read()
        
        # 1. Upload to Firebase Storage
        file_url = storage_client.upload_file(
            file_content=content,
            filename=file.filename,
            content_type=file.content_type
        )
        
        # 2. Create initial document record in Firestore
        doc_data = Document(
            title=file.filename,
            filename=file.filename,
            fileType=file.content_type,
            fileSize=len(content),
            processingStatus="pending"
        ).model_dump()
        
        doc_id = firestore_db.create_document(doc_data)
        
        # 3. Trigger background processing (Phase 3)
        background_tasks.add_task(process_document, doc_id, file_url, content, file.filename, file.content_type)
        
        return {"message": "Document uploaded successfully", "doc_id": doc_id, "url": file_url}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
def get_documents():
    return firestore_db.get_all_documents()

@router.get("/{doc_id}")
def get_document(doc_id: str):
    doc = firestore_db.get_document(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc
