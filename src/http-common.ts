import axios from "axios";

const githubClient = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Token ${localStorage.getItem("token")}`,
  }
});

const vulnerabilityClient = axios.create({
  baseURL: "http://localhost:8000", // TODO: replace baseURL
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});

export {
  githubClient,
  vulnerabilityClient
}