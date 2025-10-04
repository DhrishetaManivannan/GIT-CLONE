export interface ContentHeaderProps {
  owner: string;
  repoName: string;
  fetchFolder: (path: string) => void; 
  path: string;
}