import { githubClient } from "../http-common";

class RepoBranchService {
  getAll(repo = "vulnerabilities") {
    return githubClient.get(`/repos/appknox/${repo}/branches`);
  }

  getReferenceBranchHash(repo = "vulnerabilities", branch = "master") {
    return githubClient.get(`/repos/appknox/${repo}/git/refs/heads/${branch}`);
  }

  create(repo = "vulnerabilities", branch: string, refHash: string) {
    return githubClient.post(`/repos/appknox/${repo}/git/refs`, {
      ref: `refs/heads/${branch}`,
      sha: `${refHash}`
    });
  }
}

export default new RepoBranchService();
