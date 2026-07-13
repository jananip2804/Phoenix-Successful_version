from app.firebase.config import db
from app.models.domain import Document, Analytics, Graph
from typing import List, Optional

class FirestoreClient:
    def __init__(self):
        self.docs_ref = db.collection('documents')
        self.analytics_ref = db.collection('analytics')
        self.graph_ref = db.collection('graph')

    def create_document(self, doc_data: dict) -> str:
        doc_ref = self.docs_ref.document()
        doc_data['id'] = doc_ref.id
        doc_ref.set(doc_data)
        return doc_ref.id

    def get_document(self, doc_id: str) -> Optional[dict]:
        doc = self.docs_ref.document(doc_id).get()
        if doc.exists:
            return doc.to_dict()
        return None

    def update_document(self, doc_id: str, updates: dict):
        self.docs_ref.document(doc_id).update(updates)
        
    def get_all_documents(self) -> List[dict]:
        docs = self.docs_ref.stream()
        return [doc.to_dict() for doc in docs]
        
    def get_analytics(self) -> dict:
        doc = self.analytics_ref.document('main').get()
        if doc.exists:
            return doc.to_dict()
        return Analytics().model_dump()

    def update_analytics(self, updates: dict):
        self.analytics_ref.document('main').set(updates, merge=True)
        
    def get_graph(self) -> dict:
        doc = self.graph_ref.document('main').get()
        if doc.exists:
            return doc.to_dict()
        return Graph().model_dump()
        
    def update_graph(self, updates: dict):
        self.graph_ref.document('main').set(updates, merge=True)

firestore_db = FirestoreClient()
