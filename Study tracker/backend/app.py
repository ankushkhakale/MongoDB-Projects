from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from bson import ObjectId
from db import collection
from models import validate_session

app = Flask(__name__)
CORS(app)

# 🔹 Home route
@app.route("/")
def home():
    return jsonify({"msg": "Study Tracker API Running"})

# ➕ Add session
@app.route("/add", methods=["POST"])
def add_session():
    data = request.json
    try:
        validated_data = validate_session(data)
        validated_data["created_at"] = datetime.now()
        collection.insert_one(validated_data)
        return jsonify({"msg": "Session added successfully"}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

# 📖 Get all sessions
@app.route("/sessions", methods=["GET"])
def get_sessions():
    sessions = []
    for s in collection.find().sort("created_at", -1):
        s["_id"] = str(s["_id"])
        sessions.append(s)
    return jsonify(sessions)

# ✏️ Edit session
@app.route("/sessions/<id>", methods=["PUT"])
def update_session(id):
    data = request.json
    try:
        validated_data = validate_session(data)
        result = collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": validated_data}
        )
        if result.matched_count == 0:
            return jsonify({"error": "Session not found"}), 404
        return jsonify({"msg": "Session updated successfully"})
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception:
        return jsonify({"error": "Invalid session ID"}), 400

# 🗑️ Delete session
@app.route("/sessions/<id>", methods=["DELETE"])
def delete_session(id):
    try:
        result = collection.delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 0:
            return jsonify({"error": "Session not found"}), 404
        return jsonify({"msg": "Session deleted successfully"})
    except Exception:
        return jsonify({"error": "Invalid session ID"}), 400

# 📊 Insights: total time per topic
@app.route("/insights", methods=["GET"])
def insights():
    pipeline = [
        {
            "$group": {
                "_id": "$topic",
                "total_time": {"$sum": "$duration"},
                "avg_focus": {"$avg": "$focus_level"}
            }
        },
        {"$sort": {"total_time": -1}}
    ]

    data = list(collection.aggregate(pipeline))
    return jsonify(data)

# 🧠 Best study hour
@app.route("/best-time", methods=["GET"])
def best_time():
    pipeline = [
        {
            "$project": {
                "hour": {"$hour": "$created_at"},
                "focus_level": 1
            }
        },
        {
            "$group": {
                "_id": "$hour",
                "avg_focus": {"$avg": "$focus_level"}
            }
        },
        {"$sort": {"avg_focus": -1}},
        {"$limit": 1}
    ]

    result = list(collection.aggregate(pipeline))
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)