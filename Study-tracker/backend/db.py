from pymongo import MongoClient

# 👉 Use MongoDB Atlas URI later if needed
client = MongoClient("mongodb://localhost:27017/")

db = client["study_tracker"]
collection = db["sessions"]
