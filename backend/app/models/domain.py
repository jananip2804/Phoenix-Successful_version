from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class DocumentInsights(BaseModel):
    top_keywords: List[str] = []
    main_topics: List[str] = []
    word_count: int = 0
    reading_time_minutes: int = 0
    detected_language: str = "en"
    named_entities: List[str] = []

class Document(BaseModel):
    id: Optional[str] = None
    title: str
    filename: str
    fileType: str
    fileSize: int
    uploadDate: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    keywords: List[str] = []
    categories: List[str] = []
    processingStatus: str = "pending" # pending, processing, completed, failed
    documentInsights: Optional[DocumentInsights] = None
    embeddingId: Optional[str] = None
    graphNodeId: Optional[str] = None

class SystemMetrics(BaseModel):
    processing_success_rate: float = 100.0
    average_processing_time: float = 0.0

class Analytics(BaseModel):
    totalUploads: int = 0
    documentTypes: Dict[str, int] = {}
    knowledgeConnections: int = 0
    lastUpload: Optional[str] = None
    systemMetrics: SystemMetrics = SystemMetrics()
    topTopics: List[str] = []
    categoryDistribution: Dict[str, int] = {}

class GraphNode(BaseModel):
    id: str
    label: str
    type: str # document, keyword, topic, category
    metadata: Dict[str, Any] = {}

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    type: str # similarity, shared_keyword, shared_topic
    weight: float = 1.0

class Graph(BaseModel):
    nodes: List[GraphNode] = []
    edges: List[GraphEdge] = []
    metadata: Dict[str, Any] = {}
