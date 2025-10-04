
export  type Repo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description?: string | null;
  stargazers_count?: number;
  forks_count?: number;
  language?: string | null;
  updated_at?: string;
  owner: {
    login: string;
    avatar_url?: string;
    html_url: string;
  };
};
export type RepoContent = {
  name: string;
  path: string;
  type: "file" | "dir";
    url: string;
  download_url?: string;
  content:string;

};

export interface SearchResult<T> {
  total_count: number;
  incomplete_results: boolean;
  items: T[];
}
export interface RepoDetails {
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  subscribers_count: number;
  languages_url: string; 
  topics: string[];
  private: boolean;
  html_url: string;
}


export interface CreateFilePayload {
  token: string;
  owner: string;
  repoName: string;
  path: string;
  content: string;
  commitMessage: string;
  branch?: string;
}
export interface LastCommit {
  message: string;
  date: string;
  error?: string; 
}