// Octokit.js
// https://github.com/octokit/core.js#readme
const { Octokit } = require("@octokit/core");

const GH_TOKEN = process.env.GH_TOKEN;
const GH_REPO = process.env.GH_REPO;
const GH_ACTOR = process.env.GH_ACTOR;
const GH_REF_NAME = process.env.GH_REF_NAME;
const GH_SHA = process.env.GH_SHA;
const GITHUB_CONTEXT = process.env.GITHUB_CONTEXT;

//console.log("@github context ", GITHUB_CONTEXT);

const octokit = new Octokit({
  auth: GH_TOKEN,
});

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
  let tagSHAData;
  try {
    tagSHAData = await octokit.request(`GET /repos/SashaZel/unit-demo-cra/git/refs/tags/${GH_REF_NAME}`, {
      owner: "SashaZel",
      repo: "unit-demo-cra",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
  } catch (error) {
    console.error("@createIssue.js Error: fail to get tag sha ", error);
    process.exit(1);
  }
  //console.log("tagSHAdata ", tagSHAData)
  const currentTagSHA = tagSHAData.data.object.sha;

  // Get current tag info
  let tagInfo;
  try {
    tagInfo = await octokit.request(`GET /repos/SashaZel/unit-demo-cra/git/tags/${currentTagSHA}`, {
      owner: "SashaZel",
      repo: "unit-demo-cra",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
  } catch (error) {
    console.error("@createIssue.js Error: fail to get tag sha ", error);
    process.exit(1);
  }
  //console.log("tagInfo ", tagInfo);
  const tagInfoFormatted = `Tag author: ${tagInfo.data.tagger.name}\nTag date: ${tagInfo.data.tagger.date}\nTag message: ${tagInfo.data.message}\n \n`

  // Can get all tags
  // let tagData;
  // try {
  //   tagData = await octokit.request("GET /repos/SashaZel/unit-demo-cra/tags", {
  //     owner: "SashaZel",
  //     repo: "unit-demo-cra",
  //     headers: {
  //       "X-GitHub-Api-Version": "2022-11-28",
  //     },
  //   });
  // } catch (error) {
  //   console.error("@createIssue.js Error: fail to get tags data ", error);
  //   process.exit(1);
  // }

  //console.log("tagsData ", JSON.stringify(tagData));

  let compareData;
  let previousTagNumber = Number(GH_REF_NAME.slice(1) - 1);
  if (GH_REF_NAME === "v1") previousTagNumber = 1;
  try {
    compareData = await octokit.request(
      `GET /repos/SashaZel/unit-demo-cra/compare/v${previousTagNumber}...${GH_REF_NAME}`,
      {
        owner: "SashaZel",
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
  //console.log("compareData ", JSON.stringify(compareData));
  const commitsChangelog = compareData.data.commits;
  let changelogFormatted = "";
  for (let i = 0; i < commitsChangelog.length; i++) {
    const current = commitsChangelog[i];
    const commitMsg = `- ${current.commit.committer.name} ${current.commit.committer.date}\n    "${current.commit.message}"\n    SHA: ${current.sha}\n \n`;
    changelogFormatted += commitMsg;
  }
  // const issueBody = `Release ${tagData.properties.tag.examples[0]}
  // Created by: ${tagData.properties.tagger.properties.name.type}
  // ${tagData.properties.date.type}
  // ${GH_REPO}`

  const issueBody = `Release ${GH_REF_NAME}\n ${tagInfoFormatted}\nChangelog between v${previousTagNumber} and ${GH_REF_NAME}: \n \n ${changelogFormatted}`;

  let issueCreateResult
  try {
    issueCreateResult = await octokit.request("POST /repos/SashaZel/unit-demo-cra/issues", {
      owner: "SashaZel",
      repo: "unit-demo-cra",
      title: `Create release ${GH_REF_NAME}`,
      body: issueBody,
      labels: ["documentation"],
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    console.log(issueCreateResult.data.id);
    process.env.ISSUE_ID = issueCreateResult.data.id;
  } catch (error) {
    console.error("@createIssue.js Error: fail to create issue ", error);
    process.exit(1);
  }
}

main();
