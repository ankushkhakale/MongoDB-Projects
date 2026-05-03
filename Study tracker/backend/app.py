from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from db import collection

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

    session = {
        "topic": data.get("topic"),
        "duration": int(data.get("duration")),
        "focus_level": int(data.get("focus")),
        "created_at": datetime.now()
    }

    collection.insert_one(session)
    return jsonify({"msg": "Session added successfully"})

# 📖 Get all sessions
@app.route("/sessions", methods=["GET"])
def get_sessions():
    sessions = []
    for s in collection.find().sort("created_at", -1):
        s["_id"] = str(s["_id"])
        sessions.append(s)
    return jsonify(sessions)

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