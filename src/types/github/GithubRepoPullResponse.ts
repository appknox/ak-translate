export default interface GithubRepoPullResponse {
  number: string;
  state: string;
  title: string;
  body: string;
  created_at: string;
  changed_files: number;
}
