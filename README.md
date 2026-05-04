# MongoDB-Projects

## Introduction to MongoDB

MongoDB is an open-source, document-oriented **NoSQL database** designed for high performance, high availability, and easy scalability. Unlike traditional relational databases that store data in rows and columns (tables), MongoDB stores data as **BSON** (Binary JSON) documents inside collections.

MongoDB was first released in 2009 by 10gen (now MongoDB, Inc.) and has since become one of the most popular databases in the world, widely used in modern web applications, real-time analytics, content management systems, and more.

---

## Key Concepts

| Concept | Description |
|---|---|
| **Database** | A container for collections, similar to a database in RDBMS |
| **Collection** | A group of MongoDB documents, analogous to a table in RDBMS |
| **Document** | A record in a collection, stored as a BSON object (key-value pairs) |
| **Field** | A key-value pair inside a document, analogous to a column in RDBMS |
| **_id** | A unique identifier automatically assigned to every document |

---

## Core Features

- **Document Model** – Data is stored as flexible JSON-like documents, allowing nested structures and arrays within a single record.
- **Schema Flexibility** – Collections do not enforce a fixed schema; different documents in the same collection can have different fields.
- **Scalability** – Supports horizontal scaling via **sharding**, distributing data across multiple servers.
- **High Availability** – Uses **replica sets** (a group of MongoDB instances) to provide automatic failover and data redundancy.
- **Indexing** – Supports various index types (single field, compound, text, geospatial, etc.) for fast query performance.
- **Aggregation Framework** – Powerful pipeline-based data processing and transformation using stages like `$match`, `$group`, `$sort`, and `$project`.
- **Transactions** – Supports multi-document ACID transactions (since MongoDB 4.0).
- **Rich Query Language** – Expressive query syntax with support for filtering, projection, sorting, and limiting results.

---

## MongoDB vs Relational Databases

| Feature | MongoDB (NoSQL) | Relational DB (SQL) |
|---|---|---|
| Data Storage | BSON Documents | Tables (rows & columns) |
| Schema | Dynamic / Flexible | Fixed / Rigid |
| Joins | Embedded docs / `$lookup` | SQL JOINs |
| Scalability | Horizontal (sharding) | Vertical (scale-up) |
| Query Language | MQL (MongoDB Query Language) | SQL |
| Transactions | Multi-document ACID (4.0+) | Full ACID |

---

## Basic MongoDB Commands

```javascript
// Show all databases
show dbs

// Switch to (or create) a database
use myDatabase

// Insert a document into a collection
db.users.insertOne({ name: "Alice", age: 25, city: "New York" })

// Find all documents in a collection
db.users.find()

// Find with a filter
db.users.find({ city: "New York" })

// Update a document
db.users.updateOne({ name: "Alice" }, { $set: { age: 26 } })

// Delete a document
db.users.deleteOne({ name: "Alice" })

// Drop a collection
db.users.drop()
```

---

## Common Use Cases

- **Content Management Systems (CMS)** – Flexible schema suits varied content types.
- **Real-Time Analytics** – Fast reads/writes support high-throughput workloads.
- **E-Commerce Applications** – Product catalogs with varying attributes per item.
- **IoT & Sensor Data** – Handles large volumes of time-series data efficiently.
- **User Profiles & Personalization** – Stores complex, nested user data naturally.
- **Mobile & Social Apps** – Scales horizontally to support millions of users.

---

## Getting Started

1. **Install MongoDB** – Download from [mongodb.com/try/download](https://www.mongodb.com/try/download/community).
2. **Start the server** – Run `mongod` to start the MongoDB daemon.
3. **Connect via shell** – Run `mongosh` to open the MongoDB shell.
4. **Use a GUI** – [MongoDB Compass](https://www.mongodb.com/products/compass) provides a visual interface to explore data.
5. **Use a driver** – Official drivers are available for Node.js, Python, Java, Go, and more.

---

## Resources

- 📘 [Official MongoDB Documentation](https://www.mongodb.com/docs/)
- 🎓 [MongoDB University (Free Courses)](https://learn.mongodb.com/)
- 🧰 [MongoDB Compass (GUI Tool)](https://www.mongodb.com/products/compass)
- 🌐 [MongoDB Community Forums](https://www.mongodb.com/community/forums/)

---

> **Note:** This repository is a collection of MongoDB projects and practice exercises. Build phase is in progress.
