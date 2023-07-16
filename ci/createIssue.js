// Octokit.js
// https://github.com/octokit/core.js#readme
const { Octokit } = require("@octokit/core");

const GH_TOKEN = process.env.GH_TOKEN;
const GH_REPO = process.env.GH_REPO;
const GH_ACTOR = process.env.GH_ACTOR;
const GH_REF_NAME = process.env.GH_REF_NAME;
const GH_SHA = process.env.GH_SHA;

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

  let tagData;
  try {
    tagData = await octokit.request("GET /repos/SashaZel/unit-demo-cra/tags", {
      owner: "SashaZel",
      repo: "unit-demo-cra",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
  } catch (error) {
    console.error("@createIssue.js Error: fail to get tags data ", error);
    process.exit(1);
  }

  console.log("tagsData ", String(tagData));

  let compareData;
  try {
    compareData = await octokit.request('GET /repos/SashaZel/unit-demo-cra/compare/v12...v13', {
      owner: "SashaZel",
      repo: "unit-demo-cra",
      basehead: 'BASEHEAD',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

  } catch (error) {
    console.error("@createIssue.js Error: fail to compare tags ", error);
    process.exit(1);
  }
  console.log("compareData ", String(compareData))

  // const issueBody = `Release ${tagData.properties.tag.examples[0]}
  // Created by: ${tagData.properties.tagger.properties.name.type}
  // ${tagData.properties.date.type}
  // ${GH_REPO}`

  try {
    await octokit.request("POST /repos/SashaZel/unit-demo-cra/issues", {
      owner: "SashaZel",
      repo: "unit-demo-cra",
      title: `Create release ${GH_REF_NAME}`,
      body: `Release ${GH_ACTOR}`,
      labels: ["documentation"],
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
  } catch (error) {
    console.error("@createIssue.js Error: fail to create issue ", error);
    process.exit(1);
  }
}

main();
