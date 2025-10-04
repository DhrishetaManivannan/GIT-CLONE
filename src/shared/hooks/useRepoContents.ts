import { useQuery } from "@tanstack/react-query";
import { getRepoContents } from "@api/services/git.services";
import { type RepoContent } from "@api/models/repo";
import { useGitHubData } from "@shared/hooks/useGitHubDats";

export interface FileData {
  path: string;
  content: string;
  sha: string;
}

export const useRepoContents = (owner: string, repo: string, path: string) => {
  const { userQuery } = useGitHubData();

  const token = typeof window !== "undefined" ? localStorage.getItem("github_token") : null;

  const repoQuery = useQuery<RepoContent[], Error>({
    queryKey: ["repoContents", owner, repo, path],
    queryFn: async () => {
      if (!token) throw new Error("Missing GitHub token");

      const contents = await getRepoContents(owner, repo, path);

      return contents.map((item) => ({
        name: item.name,
        path: item.path,
        url: item.url,
        download_url: item.download_url,
        type: item.type === "dir" ? "dir" : "file",
        content: item.content || "",
      }));
    },
    enabled: !!token,  
  });

  return { 
    repoContents: repoQuery.data ?? [], 
    loading: repoQuery.isLoading, 
    error: repoQuery.error, 
    user: userQuery.data 
  };
};
