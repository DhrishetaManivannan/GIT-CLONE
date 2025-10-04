import { type FileData } from "@api/models/search";
import{type GitHubUser,type RepoContent} from "@api/models/user"
export interface RepoExplorerProps {
  owner: string;
  repo: string;
  path: string;
  onFolderClick: (folderName: string) => void;
  onFileClick: (file: FileData) => void;
  user: GitHubUser | null;
}
//done
export interface RepoItemProps {
  item: RepoContent;
  owner: string;
  repo: string;
  onFolderClick: (folderName: string) => void;
  onFileClick: (file: FileData) => void;
}