import io
import json
import pypdf
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import faiss
import numpy as np

# Simple keyword extraction using TF-IDF
def extract_keywords(text: str, top_n: int = 5) -> list[str]:
    if not text.strip():
        return []
    try:
        vectorizer = TfidfVectorizer(stop_words='english', max_features=50)
        X = vectorizer.fit_transform([text])
        feature_array = np.array(vectorizer.get_feature_names_out())
        tfidf_sorting = np.argsort(X.toarray()).flatten()[::-1]
        top_n_keywords = feature_array[tfidf_sorting][:top_n]
        return top_n_keywords.tolist()
    except ValueError: # Empty vocabulary
        return []

# Document Processor
class DocumentProcessor:
    def extract_text(self, file_content: bytes, file_type: str, filename: str) -> str:
        text = ""
        try:
            if "pdf" in file_type or filename.endswith(".pdf"):
                reader = pypdf.PdfReader(io.BytesIO(file_content))
                for page in reader.pages:
                    text += page.extract_text() + "\n"
            elif "csv" in file_type or filename.endswith(".csv"):
                df = pd.read_csv(io.BytesIO(file_content))
                text = df.to_string()
            elif "json" in file_type or filename.endswith(".json"):
                data = json.loads(file_content.decode('utf-8'))
                text = json.dumps(data, indent=2)
            else:
                # Default to text
                text = file_content.decode('utf-8', errors='ignore')
        except Exception as e:
            print(f"Error extracting text from {filename}: {e}")
        return text

    def generate_embedding(self, text: str) -> np.ndarray:
        # Instead of heavy local models, we use a simple TF-IDF based vector 
        # or randomly initialized hash for this lightweight setup.
        # For a real scalable system without downloads, an API is best.
        # Here we mock a 384-dimensional embedding (like MiniLM)
        # In a real app we would call an inference API here.
        np.random.seed(hash(text[:100]) % (2**32))
        embedding = np.random.rand(384).astype('float32')
        embedding = embedding / np.linalg.norm(embedding)
        return embedding

processor = DocumentProcessor()

# FAISS Index manager
class VectorStore:
    def __init__(self, dimension=384):
        self.dimension = dimension
        self.index = faiss.IndexFlatL2(dimension)
        self.id_map = {} # Maps faiss index to doc_id
        self.current_idx = 0

    def add_document(self, doc_id: str, embedding: np.ndarray):
        self.index.add(np.array([embedding]))
        self.id_map[self.current_idx] = doc_id
        self.current_idx += 1
        
    def search(self, query_embedding: np.ndarray, top_k: int = 5):
        if self.current_idx == 0:
            return []
        distances, indices = self.index.search(np.array([query_embedding]), top_k)
        results = []
        for i, idx in enumerate(indices[0]):
            if idx != -1 and idx in self.id_map:
                # Convert L2 distance to similarity score
                similarity = max(0.0, 1.0 - (distances[0][i] / 2.0))
                results.append({"doc_id": self.id_map[idx], "similarity": float(similarity)})
        return results

vector_store = VectorStore()
