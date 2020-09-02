import http from "../http-common";

class RepoContentService {
  get(path: string, repo: string = "vulnerabilities") {
    return http.get(`/repos/appknox/${repo}/contents/${path}`);
  }
}

export default new RepoContentService();