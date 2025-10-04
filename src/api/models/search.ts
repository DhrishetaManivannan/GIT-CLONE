
export type GitHubSearchType = "code" | "repositories" | "users" | "issues";


export interface FileData {
  path: string;
  content: string;
  sha?: string;
}
export interface UserSearchResult {
  login: string;
  avatar_url: string;
}

export interface RepoSearchResult {
  full_name: string;
  description: string | null;
  stargazers_count: number;
}


export interface SearchParams {
  token?: string;
  query: string;
  type: GitHubSearchType;
  perPage?: number;
  page?: number;
}
//done
export interface SearchBarProps {
  placeholder?: string;
  searchType?: GitHubSearchType; 
  repoOwner?: string; 
  repoName?: string;  
  token?: string;  
  onSelect?:  OnSelectType;
  debounceDelay?: number;

}
export type OnSelectType = (item: SearchItem | FileData) => void;
//done
export type SearchItem = {
  path?: string;
  full_name?: string;
  login?: string;
  name?: string;
};
export interface FileContent {
  content: string;
  sha: string;
}