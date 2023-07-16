const { Octokit } = require("@octokit/core");

const GH_TOKEN = process.env.GH_TOKEN;
const GITHUB_REF = process.env.GITHUB_REF;
const GH_REPO = process.env.GH_REPO;
const GH_REF_NAME = process.env.GH_REF_NAME;
const GH_ACTOR = process.env.GH_ACTOR || "unknown author";

// const GITHUB_CONTEXT = process.env.GITHUB_CONTEXT;
// console.log("@github context ", GITHUB_CONTEXT);

const octokit = new Octokit({
  auth: GH_TOKEN,
});

async function main() {

  // Get open issues list
  let issuesData;
  try {
    issuesData = await octokit.request(
      `GET /repos/${GH_REPO}/issues`,
      {
        owner: GH_ACTOR,
        repo: "unit-demo-cra",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
  } catch (error) {
    console.error("@closeIssue.js Error: fail to get issues list ", error);
    process.exit(1);
  }
  console.log(issuesData);
  const issuesList = issuesData.data;
  const branchName = GITHUB_REF.split("/").at(-1);
  console.log("@branchName", branchName);
  let issueNumber;
  for (let i=0; i < issuesList.length; i++) {
    const current = issuesList[i];
    if (current.title.split(" release ")[1] === branchName) {
      issueNumber = current.number;
    }
  }
  if (!issueNumber) throw new Error("@closeIssue.js Error: Can't find issue for current deploy tag");

  // Update (close) issue
  try {
    await octokit.request(`PATCH /repos/${GH_REPO}/issues/${issueNumber}`, {
      owner: GH_ACTOR,
      repo: "unit-demo-cra",
      issue_number: issueNumber,
      state: 'closed',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

  } catch(error) {
    console.error("@closeIssue.js Error: fail to close issue ", error);
    process.exit(1);
  }

}

main();
