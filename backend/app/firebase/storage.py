from app.firebase.config import bucket
from datetime import datetime
import uuid

class StorageClient:
    def upload_file(self, file_content: bytes, filename: str, content_type: str) -> str:
        """Uploads a file to Firebase Storage and returns the public URL."""
        # Generate a unique path to avoid collisions
        unique_filename = f"{uuid.uuid4()}_{filename}"
        blob = bucket.blob(f"uploads/{unique_filename}")
        
        blob.upload_from_string(
            file_content, 
            content_type=content_type
        )
        
        # Make the blob publicly viewable
        blob.make_public()
        
        return blob.public_url
        
    def delete_file(self, file_url: str):
        """Deletes a file from Firebase Storage given its public URL."""
        try:
            # Extract the path from the public URL
            # Format: https://storage.googleapis.com/bucket-name/uploads/filename
            path_parts = file_url.split('/')
            bucket_index = path_parts.index(bucket.name)
            blob_path = "/".join(path_parts[bucket_index + 1:])
            
            blob = bucket.blob(blob_path)
            blob.delete()
        except Exception as e:
            print(f"Error deleting file: {e}")

storage_client = StorageClient()
