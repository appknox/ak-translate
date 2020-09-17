import http from "../http-common";

class GithubUserService {
  get(token: string) {
    return http.get("/user", {
      headers: {
        "Content-type": "application/json",
        "Authorization": `Token ${token}`,
      }
    });
  }
}

export default new GithubUserService();