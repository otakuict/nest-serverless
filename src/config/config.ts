export default () => ({
  github: {
    owner: process.env.OWNER,
    repo: process.env.REPO,
    branch: process.env.BRANCH,
    token: process.env.GITHUB_TOKEN,
  },
});
