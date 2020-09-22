import { githubClient } from "../http-common";

class GithubUserService {
  get(token: string) {
    return githubClient.get("/user", {
      headers: {
        "Content-type": "application/json",
        Authorization: `Token ${token}`
      }
    });
  }
}

export default new GithubUserService();
