import { githubClient } from "../http-common";

class RepoContentService {
  get(token: string, repo: string, branch: string, path: string) {
    return githubClient.get(
      `/repos/appknox/${repo}/contents/${path}?ref=${branch}`, {
        headers: {
          Authorization: `Token ${token}`
        }
      }
    );
  }
  put(
    token: string,
    repo: string,
    branch: string,
    path: string,
    content: string,
    sha: string,
    message: string
  ) {
    return githubClient.put(`/repos/appknox/${repo}/contents/${path}`, {
      branch,
      message,
      content,
      sha
    }, {
      headers: {
        Authorization: `Token ${token}`
      }
    });
  }
}

export default new RepoContentService();
