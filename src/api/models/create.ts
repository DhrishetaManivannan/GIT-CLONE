
export interface CreateFilePayload {
  token: string;
  owner: string;
  repoName: string;
  filePath: string;
  content: string;
  commitMessage: string;
  branch?: string;
  sha?:string;
}

export interface UpdateFilePayload extends CreateFilePayload {
  branch: string;
  sha?:string;
}

export interface DeleteFilePayload {
  token: string;
  owner: string;
  repoName: string;
  sha:string;
  filePath: string;
  commitMessage: string;
  branch: string;
}
export interface CreateFileProps {
  owner: string;
  repo: string;
  branch?: string;
  currentPath: string; 
  sha?: string;
  fileContent?: string;
  onCancel: () => void;
  onFolderClick?: (path: string) => void; 
}