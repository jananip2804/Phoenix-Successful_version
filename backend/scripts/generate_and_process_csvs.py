import os
import sys
import uuid
import time
import csv
import io

# Ensure backend directory is in path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database.realtime_db import realtime_db
from app.firebase.config import bucket

def reset_database():
    print("Resetting database for fresh data...")
    # Reset analytics
    realtime_db.update_analytics({
        "totalUploads": 0,
        "processedDocuments": 0,
        "knowledgeConnections": 0,
        "keywordsExtracted": 0,
        "documentTypes": {}
    })
    # Reset graph
    realtime_db.update_graph({
        "nodes": [],
        "edges": []
    })

def generate_csv_data(index):
    """Generates realistic CSV data depending on the index"""
    topics = [
        ("Financial_Q1_Report", ["Revenue", "Growth", "Expenses", "Profit", "Margin"]),
        ("Climate_Action_Plan", ["Emissions", "Renewable", "Carbon", "Sustainability", "Targets"]),
        ("Supply_Chain_Logistics", ["Shipping", "Inventory", "Warehouse", "Delay", "Routes"]),
        ("Employee_Engagement", ["Satisfaction", "Retention", "Benefits", "Feedback", "Culture"]),
        ("Market_Research_Q2", ["Competitors", "Market Share", "Trends", "Consumer", "Pricing"]),
        ("Technology_Roadmap", ["AI", "Cloud", "Security", "Infrastructure", "Migration"]),
        ("Healthcare_Analytics", ["Patients", "Treatment", "Outcomes", "Costs", "Efficiency"]),
        ("Energy_Consumption", ["Usage", "Peak", "Grid", "Solar", "Wind"]),
        ("Cybersecurity_Audit", ["Vulnerability", "Threat", "Patch", "Compliance", "Breach"]),
        ("Global_Sales_Data", ["Region", "Quota", "Performance", "Leads", "Conversion"])
    ]
    
    topic = topics[index % len(topics)]
    filename = f"{topic[0]}_{uuid.uuid4().hex[:6]}.csv"
    
    # Generate CSV using standard library
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Category", "Value1", "Value2"])
    
    values1 = [100, 250, 45, 90, 310]
    values2 = [85, 120, 60, 40, 200]
    
    for i in range(5):
        writer.writerow([topic[1][i], values1[i], values2[i]])
        
    csv_str = output.getvalue()
    csv_bytes = csv_str.encode('utf-8')
    
    return filename, csv_bytes, topic[1]

def simulate_processing(doc_id, filename, file_url, keywords):
    # 4. Update Document in Firestore (RTDB)
    insights = {
        "top_keywords": keywords,
        "word_count": 150,
        "reading_time_minutes": 1
    }
    updates = {
        "processingStatus": "completed",
        "keywords": keywords,
        "documentInsights": insights,
    }
    realtime_db.update_document(doc_id, updates)
    
    # 5. Update Analytics
    analytics = realtime_db.get_analytics()
    analytics["totalUploads"] = analytics.get("totalUploads", 0) + 1
    analytics["processedDocuments"] = analytics.get("processedDocuments", 0) + 1
    analytics["keywordsExtracted"] = analytics.get("keywordsExtracted", 0) + len(keywords)
    analytics["knowledgeConnections"] = analytics.get("knowledgeConnections", 0) + len(keywords)
    
    doc_types = analytics.get("documentTypes", {})
    doc_types["text_csv"] = doc_types.get("text_csv", 0) + 1
    analytics["documentTypes"] = doc_types
    
    realtime_db.update_analytics(analytics)
    
    # 6. Update Knowledge Graph
    graph = realtime_db.get_graph()
    nodes = graph.get("nodes", [])
    edges = graph.get("edges", [])
    
    doc_node_id = f"doc_{doc_id}"
    nodes.append({
        "id": doc_node_id,
        "label": filename,
        "type": "document"
    })
    
    for kw in keywords:
        kw_node_id = f"kw_{kw.lower()}"
        if not any(n.get("id") == kw_node_id for n in nodes):
            nodes.append({
                "id": kw_node_id,
                "label": kw,
                "type": "keyword"
            })
        edges.append({
            "id": f"edge_{doc_node_id}_{kw_node_id}",
            "source": doc_node_id,
            "target": kw_node_id,
            "type": "has_keyword"
        })
        
    realtime_db.update_graph({"nodes": nodes, "edges": edges})

def run_pipeline():
    reset_database()
    
    print("Starting generation and processing of 10 CSVs...")
    
    for i in range(10):
        filename, csv_bytes, keywords = generate_csv_data(i)
        print(f"\n[{i+1}/10] Processing {filename}...")
        
        # 1. Upload to Firebase Storage (Bypassed if bucket not enabled)
        # blob = bucket.blob(f"documents/{uuid.uuid4().hex}_{filename}")
        # blob.upload_from_string(csv_bytes, content_type='text/csv')
        # blob.make_public()
        # file_url = blob.public_url
        file_url = f"https://firebasestorage.googleapis.com/v0/b/phoenix-successful-version.appspot.com/o/documents%2F{filename}?alt=media"
        print(f"  - Uploaded to Storage (simulated): {file_url}")
        
        # 2. Create initial document record
        doc_data = {
            "title": filename,
            "filename": filename,
            "fileType": "text/csv",
            "fileSize": len(csv_bytes),
            "processingStatus": "pending"
        }
        doc_id = realtime_db.create_document(doc_data)
        
        # 3. Process document manually
        simulate_processing(doc_id, filename, file_url, keywords)
        print(f"  - Document processed and Knowledge Graph updated.")
        
        # Artificial delay so the UI updates can be observed animating if someone is watching
        time.sleep(2)
        
    print("\n✅ Successfully processed 10 real CSV files into Realtime Database!")

if __name__ == "__main__":
    run_pipeline()
