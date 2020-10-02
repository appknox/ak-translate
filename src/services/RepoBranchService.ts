import { githubClient } from "../http-common";

class RepoBranchService {
  getAll(token: string, repo = "vulnerabilities") {
    return githubClient.get(`/repos/appknox/${repo}/branches`, {
      headers: {
        Authorization: `Token ${token}`
      }
    });
  }

  getReferenceBranchHash(token: string, repo = "vulnerabilities", branch = "master") {
    return githubClient.get(`/repos/appknox/${repo}/git/refs/heads/${branch}`, {
      headers: {
        Authorization: `Token ${token}`
      }
    });
  }

  create(token: string, repo = "vulnerabilities", branch: string, refHash: string) {
    return githubClient.post(`/repos/appknox/${repo}/git/refs`, {
      ref: `refs/heads/${branch}`,
      sha: `${refHash}`
    }, {
      headers: {
        Authorization: `Token ${token}`
      }
    });
  }
}

export default new RepoBranchService();
