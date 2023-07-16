// Octokit.js
// https://github.com/octokit/core.js#readme
const { Octokit } = require("@octokit/core");

const GH_TOKEN = process.env.GH_TOKEN;
const ISSUE_DATA = process.env.ISSUE_DATA;


//console.log("@github context ", GITHUB_CONTEXT);

const octokit = new Octokit({
  auth: GH_TOKEN,
});

const issueData = JSON.parse(ISSUE_DATA);

async function main() {
  // let tagData;
  // try {
  //   tagData = await octokit.request(`GET /repos/SashaZel/unit-demo-cra/git/tags/${GH_SHA}`, {
  //     owner: "SashaZel",
  //     repo: "unit-demo-cra",
  //     tag_sha: GH_SHA,
  //     headers: {
  //       "X-GitHub-Api-Version": "2022-11-28",
  //     },
  //   });
  // } catch (error) {
  //   console.error("@createIssue.js Error: fail to get tag data ", error);
  //   process.exit(1);
  // }

  // Get SHA for current tag
  // let tagSHAData;
  try {
    await octokit.request(`POST /repos/SashaZel/unit-demo-cra/issues/${issueData.data.id}/comments`, {
      owner: 'OWNER',
      repo: 'REPO',
      issue_number: 'ISSUE_NUMBER',
      body: 'Me too',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
  } catch (error) {
    console.error("@createIssueComment.js Error: fail to post comment ", error);
    process.exit(1);
  }
  // console.log("tagSHAdata ", tagSHAData)
  // const currentTagSHA = tagSHAData.data.object.sha;


}

main();