export interface GitHubFileResponse {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  content: string; // base64
  encoding: 'base64';
  [key: string]: any; // optional extra fields
}
