import{type Repo} from "@api/models/repo"
export interface SidebarProps {
  activeRepo?: string;
  onRepoSelect: (repo: Repo) => void;
}