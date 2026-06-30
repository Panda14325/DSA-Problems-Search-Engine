import express from "express";
import fs from "fs/promises";
import pkg from "natural";
import cors from "cors";
import preprocess from "./utils/preprocess.js";

const { TfIdf } = pkg;

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let problems = [];
let tfidf = new TfIdf();

let docVectors = [];
let docMagnitudes = [];

async function loadProblemsAndBuildIndex() {
  const data = await fs.readFile("./Merged/all_problems.json", "utf-8");
  problems = JSON.parse(data);

  tfidf = new TfIdf();

  problems.forEach((problem, idx) => {
    const text = preprocess(
      `${problem.title} 
      ${problem.title}
      ${problem.platform}
      ${(problem.tags || []).join(" ")}
      ${(problem.tags || []).join(" ")} 
      ${problem.description || ""}`,
    );
    tfidf.addDocument(text, idx.toString());
  });

  docVectors = [];
  docMagnitudes = [];
  problems.forEach((_, idx) => {
    const vector = {};
    let sumSquares = 0;

    tfidf.listTerms(idx).forEach(({ term, tfidf: weight }) => {
      vector[term] = weight;
      sumSquares += weight * weight;
    });

    docVectors[idx] = vector;
    docMagnitudes[idx] = Math.sqrt(sumSquares);
  });
}

app.post("/search", async (req, res) => {
  const rawQuery = req.body.query;

  if (!rawQuery || typeof rawQuery !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'query'" });
  }

  let platformFilter = null;
  let queryText = rawQuery.toLowerCase();

  if (queryText.includes("leetcode")) {
    platformFilter = "LeetCode";
    queryText = queryText.replace("leetcode", "");
  }

  if (queryText.includes("codeforces")) {
    platformFilter = "Codeforces";
    queryText = queryText.replace("codeforces", "");
  }

  if (queryText.includes("cses")) {
    platformFilter = "CSES";
    queryText = queryText.replace("cses", "");
  }

  const query = preprocess(queryText);
  const tokens = query.split(" ").filter(Boolean);

  const termFreq = {};
  tokens.forEach((t) => {
    termFreq[t] = (termFreq[t] || 0) + 1;
  });

  const queryVector = {};
  let sumSqQ = 0;
  const N = tokens.length;
  Object.entries(termFreq).forEach(([term, count]) => {
    const tf = count / N;
    const idf = tfidf.idf(term);
    const w = tf * idf;
    queryVector[term] = w;
    sumSqQ += w * w;
  });
  const queryMag = Math.sqrt(sumSqQ) || 1;

  const scores = problems.map((problem, idx) => {
    if (platformFilter && problem.platform !== platformFilter) {
      return { idx, score: 0 };
    }
    const docVec = docVectors[idx];
    const docMag = docMagnitudes[idx] || 1;
    let dot = 0;

    for (const [term, wq] of Object.entries(queryVector)) {
      if (docVec[term]) {
        dot += wq * docVec[term];
      }
    }

    const cosine = dot / (queryMag * docMag);
    return { idx, score: cosine };
  });

  const top = scores
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(({ idx }) => {
      const p = problems[idx];
      const platform = p.platform;
      return { ...p, platform };
    });

  res.json({ results: top });
});

async function startServer() {
  try {
    await loadProblemsAndBuildIndex();

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
}

startServer();
