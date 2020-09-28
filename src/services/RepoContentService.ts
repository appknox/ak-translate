import { githubClient } from "../http-common";

class RepoContentService {
  get(repo: string, branch: string, path: string) {
    return githubClient.get(
      `/repos/appknox/${repo}/contents/${path}?ref=${branch}`
    );
  }
  put(
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
    });
  }
}

export default new RepoContentService();
