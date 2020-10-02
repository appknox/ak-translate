import { githubClient } from "../http-common";

class RepoPullService {
  post(token: string, repo = "vulnerabilities", branch: string, title: string, body: string) {
    return githubClient.post(`/repos/appknox/${repo}/pulls`, {
      head: branch,
      base: "master",
      title: title,
      body: body,
      maintainer_can_modify: true
    }, {
      headers: {
        Authorization: `Token ${token}`
      }
    });
  }
}

export default new RepoPullService();
