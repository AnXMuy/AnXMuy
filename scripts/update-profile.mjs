import { readFile, writeFile, access } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const repositories = ["AnXMuy/AnXMuy", "AnXMuy/AnXMuy.github.io", "AnXMuy/RoboticNavigationXJTU26"];
const headers = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

function escapeMarkdown(value) {
  return value.replace(/[\r\n]+/g, " ").replace(/[&<>]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[character]).replace(/([\\`*_{}\[\]()|!])/g, "\\$1");
}

function replaceSection(markdown, name, content) {
  const start = `<!-- ${name}:START -->`;
  const end = `<!-- ${name}:END -->`;
  if (!markdown.includes(start) || !markdown.includes(end)) throw new Error(`Missing ${name} markers`);
  return markdown.replace(new RegExp(`${start}[\\s\\S]*?${end}`), () => `${start}\n${content}\n${end}`);
}

const commits = [];
for (const repository of repositories) {
  const response = await fetch(`https://api.github.com/repos/${repository}/commits?per_page=10`, { headers, signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`${repository}: GitHub API ${response.status}; retaining existing README`);
  const entries = await response.json();
  for (const entry of entries) {
    if (entry.commit.message.startsWith("chore(profile):")) continue;
    commits.push({ repository, sha: entry.sha, date: entry.commit.committer.date, message: entry.commit.message.split("\n")[0] });
  }
}
commits.sort((first, second) => second.date.localeCompare(first.date));
const rows = commits.slice(0, 6).map((entry) => `| ${entry.date.slice(0, 10)} | [${entry.repository.split("/")[1]}](https://github.com/${entry.repository}) | [\`${entry.sha.slice(0, 7)}\`](https://github.com/${entry.repository}/commit/${entry.sha}) ${escapeMarkdown(entry.message.slice(0, 100))} |`);
if (!rows.length) throw new Error("No commits returned; retaining existing README");
let markdown = await readFile(new URL("README.md", root), "utf8");
markdown = replaceSection(markdown, "ACTIVITY", ["| Date (UTC) | Repository | Commit |", "| :--- | :--- | :--- |", ...rows].join("\n"));
const hasSnake = await access(new URL("assets/contribution-snake.svg", root)).then(() => true, () => false);
if (hasSnake) markdown = replaceSection(markdown, "SNAKE", "![Blue contribution snake](./assets/contribution-snake.svg)\n\nGenerated from GitHub's contribution graph with [Platane/snk](https://github.com/Platane/snk). Animation follows the generated SVG; expand this section only when you want to watch it.");
await writeFile(new URL("README.md", root), markdown);
console.log(`Updated ${rows.length} real repository commits; snake ${hasSnake ? "available" : "awaiting workflow"}.`);
