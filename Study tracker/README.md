# 📚 Smart Study Tracker

> A full-stack web application to log study sessions, analyze productivity patterns, and find your personal best study hours — powered by **Flask** and **MongoDB**.

![Python](https://img.shields.io/badge/Python-3.8+-blue?style=flat-square&logo=python)
![Flask](https://img.shields.io/badge/Flask-2.x-black?style=flat-square&logo=flask)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green?style=flat-square&logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## 🚀 Features

| Feature | Description |
|---|---|
| ➕ **Add Sessions** | Log topic, duration (in minutes), and focus level (1–5) |
| 📖 **View Sessions** | Retrieve all study sessions sorted by most recent |
| 📊 **Topic Insights** | Aggregated total study time and average focus per topic |
| 🧠 **Best Study Hour** | Detects which hour of the day gives the highest focus |

---

## 🗂️ Project Structure

```
Study tracker/
│
├── backend/
│   ├── app.py          # Flask REST API with all routes
│   ├── db.py           # MongoDB connection config
│   └── models.py       # Data model definitions
│
├── frontend/
│   ├── index.html      # Main UI page
│   ├── script.js       # API calls & DOM manipulation
│   └── style.css       # Styling
│
├── requirements.txt    # Python dependencies
└── README.md
```

---

## 🛠️ Tech Stack

- **Backend**: Python 3, Flask, Flask-CORS
- **Database**: MongoDB (local / Atlas)
- **Frontend**: Vanilla HTML, CSS, JavaScript

---

## ⚙️ Setup & Installation

### Prerequisites

- Python 3.8+
- MongoDB running locally on port `27017` (or a MongoDB Atlas URI)
- `pip` package manager

### 1. Clone the Repository

```bash
git clone https://github.com/ankushkhakale/MongoDB-Study-Tracker.git
cd MongoDB-Study-Tracker/Study\ tracker
```

### 2. Set Up Python Environment

```bash
python3 -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure MongoDB

By default, the app connects to a **local MongoDB** instance:

```python
# backend/db.py
client = MongoClient("mongodb://localhost:27017/")
```

To use **MongoDB Atlas**, replace the URI with your Atlas connection string:

```python
client = MongoClient("mongodb+srv://<username>:<password>@cluster.mongodb.net/")
```

### 4. Run the Backend

```bash
cd backend
python app.py
```

The API will be available at: `http://127.0.0.1:5000`

### 5. Run the Frontend

Simply open `frontend/index.html` in your browser:

```bash
# Or use a live server extension in VS Code
open frontend/index.html
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check — API status |
| `POST` | `/add` | Add a new study session |
| `GET` | `/sessions` | Fetch all sessions (latest first) |
| `GET` | `/insights` | Topic-wise aggregated stats |
| `GET` | `/best-time` | Best study hour of the day |

### Example: Add a Session

```bash
curl -X POST http://127.0.0.1:5000/add \
  -H "Content-Type: application/json" \
  -d '{"topic": "MongoDB", "duration": 45, "focus": 4}'
```

**Response:**
```json
{ "msg": "Session added successfully" }
```

### Example: Get Insights

```bash
curl http://127.0.0.1:5000/insights
```

**Response:**
```json
[
  { "_id": "MongoDB", "total_time": 90, "avg_focus": 4.0 },
  { "_id": "Python",  "total_time": 60, "avg_focus": 3.5 }
]
```

---

## 🧪 MongoDB Aggregation Pipelines Used

This project demonstrates real-world MongoDB aggregation:

- **`$group`** — Group sessions by topic to sum durations and average focus
- **`$sort`** — Sort topics by total time studied (descending)
- **`$project`** — Extract hour from timestamps for time-of-day analysis
- **`$limit`** — Return only the single best study hour

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👤 Author

**Ankush Khakale**  
[![GitHub](https://img.shields.io/badge/GitHub-ankushkhakale-black?style=flat-square&logo=github)](https://github.com/ankushkhakale)

---

> ⭐ If you found this project helpful, please give it a star!