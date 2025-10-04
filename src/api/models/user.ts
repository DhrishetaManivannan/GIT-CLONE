//done
export interface User {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name?: string;
  email?: string;
  bio?:string;
}
//done
export interface GitHubUser {
  login: string;
  avatar_url?: string;
}
//done
export interface LastCommit {
  message: string;
  date: string;
}

export interface RepoContent {
  name: string;
  path: string;
  type: "file" | "dir";
  url?: string;
  download_url?: string;
  content?: string;
  lastCommitMessage?: string;
  lastCommitDate?: string;
}


