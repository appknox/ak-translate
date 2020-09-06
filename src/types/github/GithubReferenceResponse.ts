import Vue from 'vue'

export default interface GithubReferenceResponse {
  owner: string;
  repo: string;
  ref: string;
  sha: string;
}