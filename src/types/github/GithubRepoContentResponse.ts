import Vue from 'vue'

export default interface GithubRepoContentResponse {
  type: string;
  name: string;
  path: string;
  content: string;
  download_url: string;
}