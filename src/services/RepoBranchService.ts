import http from "../http-common";

class RepoBranchService {
  getAll(repo: string = "vulnerabilities") {
    return http.get(`/repos/appknox/${repo}/branches`);
  }

  getReferenceBranchHash(repo: string = "vulnerabilities", branch="master") {
    return http.get(`/repos/appknox/${repo}/git/refs/heads/${branch}`);
  }

  create(repo: string = "vulnerabilities", branch: string, refHash: string) {
    return http.post(`/repos/appknox/${repo}/git/refs`, {
      "ref": `refs/heads/${branch}`,
      "sha": `${refHash}`
    });
  }
}

export default new RepoBranchService();