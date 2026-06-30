# 🔍 DSA Problems Search Engine

A full-stack search engine that enables users to search coding problems across multiple competitive programming platforms using **TF-IDF** and **Cosine Similarity** based relevance ranking.

The application indexes coding problems from **LeetCode**, **Codeforces**, and **CSES**, allowing users to quickly discover relevant problems by searching problem titles, descriptions, tags, or platform names.

---

## 🚀 Live Demo

**Application:** https://dsa-problems-search-engine.vercel.app/



---


## ✨ Features

- 🔍 Search across **3500+ DSA problems**
- 📚 Supports multiple platforms:
  - LeetCode
  - Codeforces
  - CSES
- ⚡ TF-IDF based document indexing
- 📈 Cosine Similarity based relevance ranking
- 🏷️ Search using:
  - Problem title
  - Tags
  - Problem description
  - Platform name
- 🎯 Platform-aware search
  - Example:
    - `leetcode graph`
    - `codeforces dp`
    - `cses tree`
- 🌐 Responsive React frontend
- 🚀 Express REST API backend
- ☁️ Fully deployed using Vercel and Render

---

## 🛠 Tech Stack

### Frontend

- React
- CSS

### Backend

- Node.js
- Express.js
- CORS

### Search Engine

- Natural
- TF-IDF
- Cosine Similarity
- Text Preprocessing

### Web Scraping

- Puppeteer

### Deployment

- Vercel
- Render

---

## 🏗 Architecture

```
                React Frontend
                       │
                       │ POST /search
                       ▼
              Express REST API
                       │
                       ▼
            TF-IDF Search Engine
                       │
                       ▼
      Cosine Similarity Ranking
                       │
                       ▼
      Merged Problems Dataset
      
```

---

## ⚙️ Search Pipeline

```
User Query
      │
      ▼
Text Preprocessing
      │
      ▼
Tokenization
      │
      ▼
TF-IDF Vectorization
      │
      ▼
Cosine Similarity Calculation
      │
      ▼
Rank Documents
      │
      ▼
Return Top 10 Results
```

---

## 📊 Dataset

The search engine indexes coding problems scraped from:

| Platform | Data Extracted |
|----------|----------------|
| LeetCode | Title, URL, Description, Tags |
| Codeforces | Title, URL, Description, Tags |
| CSES | Title, URL, Description, Category |

Each document is indexed using:

- Title
- URL
- Tags
- Description
- Platform

---

## 🔎 Search Examples

```
binary search

dynamic programming

graph

leetcode bfs

codeforces greedy

cses tree
```

---

## 🧠 Information Retrieval

The search engine ranks documents using:

- TF (Term Frequency)
- IDF (Inverse Document Frequency)
- TF-IDF Vectorization
- Cosine Similarity Ranking

To improve search quality:

- Problem titles are assigned higher importance.
- Tags are weighted higher than descriptions.
- Platform-specific queries are automatically detected and filtered before ranking.

---

## 📂 Project Structure

```
DSA-Problems-Search-Engine
│
├── public/
├── src/
│   ├── components/
│   ├── store/
│   ├── assets/
│   ├── utils/
│   └── server.js
│
├── Merged/
│   └── all_problems.json
│
├── package.json
└── README.md
```

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/Panda14325/DSA-Problems-Search-Engine.git
```

### Install Dependencies

```bash
npm install
```

### Start Backend

```bash
node src/server.js
```

### Start Frontend

```bash
npm start
```

---

## 💡 Learning Objectives

This project was built to practice:

- Full Stack Web Development
- React
- Express.js
- REST APIs
- Web Scraping using Puppeteer
- Information Retrieval
- TF-IDF
- Cosine Similarity
- Text Preprocessing
- Search Engine Design
- API Integration
- Deployment using Vercel and Render

---

## 🔮 Future Improvements

- Fuzzy Search
- Autocomplete Suggestions
- Search History
- Advanced Filters
- BM25 Ranking
- User Authentication
- Bookmark Favorite Problems

---

## 👨‍💻 Author

**Anshuman Singh**

---

## ⭐ Show Your Support

If you found this project helpful, please consider giving it a ⭐ on GitHub.

---

## 📄 License

This project is licensed under the MIT License.
