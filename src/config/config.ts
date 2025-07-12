export default () => ({
  github: {
    owner: process.env.OWNER,
    repo: process.env.REPO,
    branch: process.env.BRANCH,
    token: process.env.API_TOKEN,
  },
});
