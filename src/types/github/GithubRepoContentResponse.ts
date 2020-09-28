export default interface GithubRepoContentResponse {
  type: string;
  name: string;
  path: string;
  sha: string;
  content: string;
  download_url: string;
}