import fsPromises from "fs/promises";
import path from "path";

async function mergeProblemData() {
  const codeforcesPath = path.resolve("./problems/codeforces_problems.json");
  const leetcodePath = path.resolve("./problems/leetcode_problems.json");
  const CSESPath = path.resolve("./problems/CSES_problems.json");

  const codeforcesData = JSON.parse(
    await fsPromises.readFile(codeforcesPath, "utf-8"),
  );
  const leetcodeData = JSON.parse(
    await fsPromises.readFile(leetcodePath, "utf-8"),
  );

  const CSESData = JSON.parse(await fsPromises.readFile(CSESPath, "utf-8"));

  const combined = [...codeforcesData, ...leetcodeData, ...CSESData];

  await fsPromises.mkdir("./Merged", { recursive: true });

  await fsPromises.writeFile(
    "./Merged/all_problems.json",
    JSON.stringify(combined, null, 2),
  );
}

mergeProblemData();
