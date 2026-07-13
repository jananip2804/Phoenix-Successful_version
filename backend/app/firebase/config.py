import firebase_admin
from firebase_admin import credentials, firestore, storage
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    firebase_cert_path: str = "serviceAccountKey.json"
    firebase_storage_bucket: str = "phoenix-successful-version.firebasestorage.app"

settings = Settings()

# Initialize Firebase Admin SDK
cred = credentials.Certificate(settings.firebase_cert_path)
firebase_app = firebase_admin.initialize_app(cred, {
    'storageBucket': settings.firebase_storage_bucket
})

db = firestore.client()
bucket = storage.bucket()
