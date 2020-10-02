import axios from "axios";

const githubClient = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/json"
  }
});

const vulnerabilityClient = axios.create({
  baseURL: `${process.env.VUE_APP_VULNERABILITY_API_BASE_URL}`,
  headers: {
    Accept: "application/json"
  }
});

export { githubClient, vulnerabilityClient };
