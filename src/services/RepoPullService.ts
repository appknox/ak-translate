import http from "../http-common";

class RepoPullService {
  post(repo: string = "vulnerabilities", branch: string, title: string, body: string) {
    return http.post(`/repos/appknox/${repo}/pulls`, {
      head: branch,
      base: "master",
      title: title,
      body: body,
      maintainer_can_modify: true
    });
  }
}

export default new RepoPullService();