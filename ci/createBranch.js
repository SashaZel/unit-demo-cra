const { Octokit } = require("@octokit/core");

const GH_TOKEN = process.env.GH_TOKEN;
const GH_REPO = process.env.GH_REPO;
const GH_REF_NAME = process.env.GH_REF_NAME;
const GH_ACTOR = process.env.GH_ACTOR || "unknown author";

const octokit = new Octokit({
  auth: GH_TOKEN,
});

async function main() {
  // Find the revision of branch master
  let masterRef;
  try {
    masterRef = await octokit.request(`GET /repos/${GH_REPO}/git/refs/heads/master`, {
      owner: GH_ACTOR,
      repo: "unit-demo-cra",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
  } catch (error) {
    console.error("@createBranch.js Error: fail to get branch sha ", error);
    process.exit(1);
  }
  const masterSha = masterRef.data.object.sha;

  // Create new branch from master
  try {
    await octokit.request(`POST /repos/${GH_REPO}/git/refs`, {
      owner: GH_ACTOR,
      repo: "unit-demo-cra",
      ref: `refs/heads/${GH_REF_NAME}`,
      sha: masterSha,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
  } catch (error) {
    console.error("@createBranch.js Error: fail to create branch ", error);
    process.exit(1);
  }
}

main();
