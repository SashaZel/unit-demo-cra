const { Octokit } = require("@octokit/core");
const { readFileSync } = require("fs");

const GH_TOKEN = process.env.GH_TOKEN;
const GH_REF_NAME = process.env.GH_REF_NAME;
const GH_REPO = process.env.GH_REPO;
const GH_ACTOR = process.env.GH_ACTOR || "unknown author";

// const GITHUB_CONTEXT = process.env.GITHUB_CONTEXT;
// console.log("@github context ", GITHUB_CONTEXT);

let report;
try {
  report = readFileSync("./ci/report.txt", "utf-8");
} catch (error) {
  console.error("@createIssue Error: no report file found");
}

const octokit = new Octokit({
  auth: GH_TOKEN,
});

async function main() {
  let tagSHAData;
  try {
    tagSHAData = await octokit.request(`GET /repos/${GH_REPO}/git/refs/tags/${GH_REF_NAME}`, {
      owner: GH_ACTOR,
      repo: "unit-demo-cra",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
  } catch (error) {
    console.error("@createIssue.js Error: fail to get tag sha ", error);
    process.exit(1);
  }
  const currentTagSHA = tagSHAData.data.object.sha;

  // Get current tag info
  let tagInfo;
  try {
    tagInfo = await octokit.request(`GET /repos/${GH_REPO}/git/tags/${currentTagSHA}`, {
      owner: GH_ACTOR,
      repo: "unit-demo-cra",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
  } catch (error) {
    console.error("@createIssue.js Error: fail to get tag sha ", error);
    process.exit(1);
  }
  const tagInfoFormatted = `**Tag author:** ${tagInfo.data.tagger.name}\n**Tag date:** ${tagInfo.data.tagger.date}\n**Tag message:** ${tagInfo.data.message}\n \n`;

  let compareData;
  let previousTagNumber = Number(GH_REF_NAME.slice(1) - 1);
  if (GH_REF_NAME === "v1") previousTagNumber = 1;
  try {
    compareData = await octokit.request(
      `GET /repos/${GH_REPO}/compare/v${previousTagNumber}...${GH_REF_NAME}`,
      {
        owner: GH_ACTOR,
        repo: "unit-demo-cra",
        basehead: "BASEHEAD",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
  } catch (error) {
    console.error("@createIssue.js Error: fail to compare tags ", error);
    process.exit(1);
  }

  const commitsChangelog = compareData.data.commits;
  let changelogFormatted = "";
  for (let i = 0; i < commitsChangelog.length; i++) {
    const current = commitsChangelog[i];
    const commitMsg = `- ${current.commit.committer.name} ${current.commit.committer.date}\n    "${current.commit.message}"\n    SHA: ${current.sha}\n \n`;
    changelogFormatted += commitMsg;
  }

  const issueBody = `# Release ${GH_REF_NAME}\n ${tagInfoFormatted}\n## Changelog between v${previousTagNumber} and ${GH_REF_NAME}: \n \n ${changelogFormatted} \n## Tests report\n \n${report}`;

  try {
    await octokit.request(`POST /repos/${GH_REPO}/issues`, {
      owner: GH_ACTOR,
      repo: "unit-demo-cra",
      title: `Create release ${GH_REF_NAME}`,
      body: issueBody,
      labels: ["documentation"],
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    // process.env.ISSUE_ID = String(issueCreateResult.data.id);
  } catch (error) {
    console.error("@createIssue.js Error: fail to create issue ", error);
    process.exit(1);
  }
}

main();
