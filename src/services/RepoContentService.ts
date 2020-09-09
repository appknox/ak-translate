import http from "../http-common";

class RepoContentService {
  get(repo: string, branch: string, path: string, ) {
    return http.get(`/repos/appknox/${repo}/contents/${path}?ref=${branch}`);
  }
  put(repo: string, branch: string, path: string, content: string, message: string) {
    return http.put(`/repos/appknox/${repo}/contents/${path}`, {
      repo,
      branch,
      path,
      message,
      content,
    })
  }
}

export default new RepoContentService();