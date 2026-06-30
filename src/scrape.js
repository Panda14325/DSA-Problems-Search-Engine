import puppeteer from "puppeteer";
import fsPromises from "fs/promises";

async function scrapeLeetcodeProblems() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--disable-blink-features=AutomationControlled"],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" +
      "AppleWebKit/537.36 (KHTM, like Gecko)" +
      "Chrome/114.0.5735.199 Safari/537.36",
  );

  await page.goto("https://leetcode.com/problemset/", {
    waitUntil: "domcontentloaded",
  });

  const problemSelector =
    "a.group.flex.flex-col.rounded-\\[8px\\].duration-300";

  let allProblems = [];
  let prevCount = 0;
  const TARGET = 1300;

  while (allProblems.length < TARGET) {
    await page.evaluate((sel) => {
      const currProblemsOnPage = document.querySelectorAll(sel);

      if (currProblemsOnPage.length) {
        currProblemsOnPage[currProblemsOnPage.length - 1].scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }, problemSelector);

    await page.waitForFunction(
      (sel, prev) => document.querySelectorAll(sel).length > prev,
      {},
      problemSelector,
      prevCount,
    );

    allProblems = await page.evaluate((sel) => {
      const nodes = Array.from(document.querySelectorAll(sel));
      return nodes.map((el) => ({
        title: el
          .querySelector(".ellipsis.line-clamp-1")
          ?.textContent.trim()
          .split(". ")[1],
        url: el.href.split("?")[0],
      }));
    }, problemSelector);

    prevCount = allProblems.length;
  }

  const problemsWithDescription = [];

  for (let i = 0; i < TARGET; i++) {
    const { title, url } = allProblems[i];

    const problemPage = await browser.newPage();

    try {
      await problemPage.goto(url);

      const { description, tags } = await problemPage.evaluate(() => {
        const descriptionDiv = document.querySelector(
          '[data-track-load="description_content"]',
        );

        if (!descriptionDiv) {
          return {
            description: "",
            tags: [],
          };
        }

        const paragraphs = descriptionDiv.querySelectorAll("p");

        let collectedDescription = [];
        for (const p of paragraphs) {
          if (p.innerHTML.trim() === "&nbsp;") {
            break;
          }
          collectedDescription.push(p.innerText.trim());
        }

        const tags = Array.from(
          document.querySelectorAll('a[href^="/tag/"]'),
        ).map((tag) => tag.innerText.trim().toLowerCase());

        const description = collectedDescription
          .filter((text) => text !== "")
          .join(" ");

        return { description, tags };
      });

      problemsWithDescription.push({
        title,
        url,
        platform: "LeetCode",
        tags,
        description,
      });
    } catch (err) {
      console.error(`Error fetching desciption for ${title} (${url}):`, err);
    } finally {
      await problemPage.close();
    }
  }

  await fsPromises.mkdir("./problems", { recursive: true });

  await fsPromises.writeFile(
    "./problems/leetcode_problems.json",
    JSON.stringify(problemsWithDescription, null, 2),
  );
  await browser.close();
}

async function scrapeCodeforcesProblems() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--disable-blink-features=AutomationControlled"],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) " +
      "Chrome/114.0.5735.199 Safari/537.36",
  );

  const problems = [];
  const TARGET = 18;

  for (let i = 1; i <= TARGET; i++) {
    const url = `https://codeforces.com/problemset/page/${i}`;

    await page.goto(url, { waitUntil: "domcontentloaded" });

    const problemSelector =
      "table.problems tr td:nth-of-type(2) > div:first-of-type > a";

    const links = await page.evaluate((sel) => {
      const anchors = document.querySelectorAll(sel);

      return Array.from(anchors).map((a) => a.href);
    }, problemSelector);

    for (const link of links) {
      try {
        await page.goto(link, { waitUntil: "domcontentloaded" });

        const { title, description, tags } = await page.evaluate(() => {
          const title = document
            .querySelector(".problem-statement .title")
            .textContent.split(". ")[1];

          const description = document.querySelector(
            ".problem-statement > div:nth-of-type(2)",
          ).textContent;

          const tags = Array.from(document.querySelectorAll("span.tag-box"))
            .map((tag) => tag.innerText.trim().toLowerCase())
            .filter((tag) => !/^\*\d+$/.test(tag));

          return { title, description, tags };
        });

        problems.push({
          title,
          url: link,
          platform: "Codeforces",
          tags,
          description,
        });
      } catch (err) {
        console.warn(`❌ Failed to scrape ${link}: ${err.message}`);
      }
    }
  }

  await fsPromises.mkdir("./problems", { recursive: true });

  await fsPromises.writeFile(
    "./problems/codeforces_problems.json",
    JSON.stringify(problems, null, 2),
  );

  await browser.close();
}

async function scrapeCSESProblems() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--disable-blink-features=AutomationControlled"],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) " +
      "Chrome/114.0.5735.199 Safari/537.36",
  );

  await page.goto("https://cses.fi/problemset/", {
    waitUntil: "networkidle2",
  });

  const problemSelector = "li.task > a";

  const links = await page.evaluate((sel) => {
    const anchors = document.querySelectorAll(sel);

    return Array.from(anchors).map((a) => a.href);
  }, problemSelector);

  const problems = [];

  for (const link of links) {
    try {
      await page.goto(link, { waitUntil: "domcontentloaded" });

      const { title, description, tags } = await page.evaluate(() => {
        const title = document
          .querySelector(".title-block h1")
          .innerText.trim();

        const tag = document.querySelector(".nav.sidebar h4").innerText.trim();
        const tags = [tag];

        const descriptionDiv = document.querySelector(".md");

        if (!descriptionDiv) {
          return {
            title,
            description: "",
            tags,
          };
        }

        const collectedDescription = [];

        for (const element of descriptionDiv.children) {
          if (
            element.tagName === "H1" &&
            element.innerText.trim() === "Input"
          ) {
            break;
          }

          collectedDescription.push(element.innerText.trim());
        }

        const description = collectedDescription
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();

        return { title, description, tags };
      });

      problems.push({
        title,
        url: link,
        platform: "CSES",
        tags,
        description,
      });
    } catch (err) {
      console.warn(`❌ Failed to scrape ${link}: ${err.message}`);
    }
  }

  await fsPromises.mkdir("./problems", { recursive: true });

  await fsPromises.writeFile(
    "./problems/CSES_problems.json",
    JSON.stringify(problems, null, 2),
  );

  await browser.close();
}

//scrapeCSESProblems();
//scrapeCodeforcesProblems();
//scrapeLeetcodeProblems();
