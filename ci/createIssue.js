// Octokit.js
// https://github.com/octokit/core.js#readme
const { Octokit } = require("@octokit/core");

const GH_TOKEN = process.env.GH_TOKEN;

const octokit = new Octokit({
  auth: GH_TOKEN
})

async function createIssue() {

  await octokit.request('POST /repos/SashaZel/unit-demo-cra/issues', {
    owner: 'SashaZel',
    repo: 'unit-demo-cra',
    title: 'Found a bug',
    body: 'I\'m having a problem with this.',
    assignees: [
      'octocat'
    ],
    labels: [
      'bug'
    ],
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
}

createIssue();