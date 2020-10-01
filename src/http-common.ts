import axios from "axios";

const githubClient = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Token ${localStorage.getItem("token")}`
  }
});

const vulnerabilityClient = axios.create({
  baseURL: `${process.env.VUE_APP_VULNERABILITY_API_BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
});

export { githubClient, vulnerabilityClient };
