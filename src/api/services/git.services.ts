import api from "../interceptors/axios.instance";
import { encodeToBase64, decodeFromBase64 } from "@shared/utils/base64";
import { type Repo, type RepoContent, type LastCommit } from "../models/repo";
import { type CreateFilePayload, type UpdateFilePayload, type DeleteFilePayload } from "../models/create";
import { type User } from "../models/user";
import { type FileContent, type SearchParams } from "../models/search";

// 1️ Auth done
export const githubLogin = (): Promise<User> =>
  api.get("/user").then(res => res.data);

// 2️ Reposdone
export const getUserRepos = (): Promise<Repo[]> =>
  api.get("/user/repos").then(res => res.data);

// 3️ Search
export const searchGitHub = ({query, type,perPage = 20,page = 1
}:Omit<SearchParams, "token">) =>
  api.get(`/search/${type}`, { params: { q: query, per_page: perPage, page } })
     .then(res => res.data.items);

// 4️ File Content done
export const getFileContent = (
  owner: string,
  repo: string,
  filePath: string,
  
): Promise<FileContent> =>
  api.get(`/repos/${owner}/${repo}/contents/${filePath}`, )
     .then(res => ({
       content: res.data.content ? decodeFromBase64(res.data.content) : "",
       sha: res.data.sha || ""
     }));

// 5️ Repo Info
export const getRepo = (owner: string, repo: string) =>
  api.get(`/repos/${owner}/${repo}`).then(res => res.data);

export const getBranches = (owner: string, repo: string) =>
  api.get(`/repos/${owner}/${repo}/branches`).then(res => res.data);

export const getTags = (owner: string, repo: string) =>
  api.get(`/repos/${owner}/${repo}/tags`).then(res => res.data);

// 6️ CRUD
export const createFile = ({
  owner,
  repoName,
  filePath,
  content,
  commitMessage,
  branch
}: CreateFilePayload) =>
  api.put(`/repos/${owner}/${repoName}/contents/${filePath}`, {
    message: commitMessage,
    content: encodeToBase64(content),
    branch
  }).then(res => res.data);

export const updateFile = async ({
  owner,
  repoName,
  filePath,
  content,
  commitMessage,
  branch
}: UpdateFilePayload) => {
  const { sha } = await getFileContent(owner, repoName, filePath, );
  if (!sha) throw new Error("SHA not found. Cannot update file.");
  return api.put(`/repos/${owner}/${repoName}/contents/${filePath}`, {
    message: commitMessage,
    content: encodeToBase64(content),
    sha,
    branch
  }).then(res => res.data);
};

export const deleteFile = ({
  owner,
  repoName,
  filePath,
  commitMessage,
  branch,
  sha
}: DeleteFilePayload) => {
  if (!sha) throw new Error("SHA is required to delete file");
  return api.delete(`/repos/${owner}/${repoName}/contents/${filePath}`, {
    data: { message: commitMessage, sha, branch }
  }).then(res => res.data);
};

// 7️ Repo Explorer done
export const getRepoContents = (
  owner: string,
  repoName: string,
  path = ""
): Promise<RepoContent[]> => {
  if (!repoName || !owner) return Promise.resolve([]);
  return api.get(`/repos/${owner}/${repoName}/contents/${path}`)
    .then(res => res.data.map((item: any) => ({ ...item, type: item.type === "dir" ? "dir" : "file" })))
    .catch(() => []);
};

// 8️ Last commit done
export const getLastCommitForFile = (
  owner: string,
  repoName: string,
  filePath: string,
  
): Promise<LastCommit | null> =>
  api.get(`/repos/${owner}/${repoName}/commits`, { params: { path: filePath,  per_page: 1 } })
     .then(res => {
       const commit = res.data[0]?.commit;
       return commit ? { message: commit.message, date: commit.author.date } : { message: "No commits", date: "" };
     })
     .catch(() => null);
