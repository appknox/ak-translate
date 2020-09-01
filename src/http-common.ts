import axios from "axios";

export default axios.create({
  baseURL: "https://api.github.com",
  headers: {
    "Content-type": "application/json",
    "Authorization": `Token ${process.env.VUE_APP_GITHUB_TOKEN}`,
  }
});