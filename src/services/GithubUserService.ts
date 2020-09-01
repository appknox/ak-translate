import http from "../http-common";

class GithubUserService {
  get() {
    return http.get("/user");
  }
}

export default new GithubUserService();