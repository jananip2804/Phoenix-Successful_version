from app.database.firestore import firestore_db
from app.ai.processor import processor, vector_store, extract_keywords
from app.models.domain import DocumentInsights
import uuid

def process_document(doc_id: str, file_url: str, file_content: bytes, filename: str, file_type: str):
    try:
        # Update status to processing
        firestore_db.update_document(doc_id, {"processingStatus": "processing"})
        
        # 1. Extract text
        text = processor.extract_text(file_content, file_type, filename)
        
        # 2. Extract Insights
        keywords = extract_keywords(text, top_n=5)
        word_count = len(text.split())
        reading_time = max(1, word_count // 200)
        
        insights = DocumentInsights(
            top_keywords=keywords,
            word_count=word_count,
            reading_time_minutes=reading_time
        ).model_dump()
        
        # 3. Generate Embeddings & Add to Vector Store
        embedding = processor.generate_embedding(text)
        vector_store.add_document(doc_id, embedding)
        
        # 4. Update Document in Firestore
        updates = {
            "processingStatus": "completed",
            "keywords": keywords,
            "documentInsights": insights,
        }
        firestore_db.update_document(doc_id, updates)
        
        # 5. Update Analytics (simplified)
        analytics = firestore_db.get_analytics()
        analytics["totalUploads"] = analytics.get("totalUploads", 0) + 1
        
        doc_types = analytics.get("documentTypes", {})
        doc_types[file_type] = doc_types.get(file_type, 0) + 1
        analytics["documentTypes"] = doc_types
        
        firestore_db.update_analytics(analytics)
        
        # 6. Update Knowledge Graph (simplified logic)
        update_knowledge_graph(doc_id, filename, keywords)

    except Exception as e:
        print(f"Failed to process document {doc_id}: {e}")
        firestore_db.update_document(doc_id, {"processingStatus": "failed"})

def update_knowledge_graph(doc_id: str, title: str, keywords: list[str]):
    graph = firestore_db.get_graph()
    nodes = graph.get("nodes", [])
    edges = graph.get("edges", [])
    
    # Add Document Node
    doc_node_id = f"doc_{doc_id}"
    nodes.append({
        "id": doc_node_id,
        "label": title,
        "type": "document"
    })
    
    # Add Keyword Nodes and Edges
    for kw in keywords:
        kw_node_id = f"kw_{kw.lower()}"
        # Only add keyword node if it doesn't exist
        if not any(n.get("id") == kw_node_id for n in nodes):
            nodes.append({
                "id": kw_node_id,
                "label": kw,
                "type": "keyword"
            })
            
        # Add Edge between Doc and Keyword
        edges.append({
            "id": f"edge_{doc_node_id}_{kw_node_id}",
            "source": doc_node_id,
            "target": kw_node_id,
            "type": "has_keyword"
        })
        
    firestore_db.update_graph({"nodes": nodes, "edges": edges})
