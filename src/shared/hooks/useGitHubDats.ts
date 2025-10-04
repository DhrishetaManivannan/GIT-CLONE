import { useQuery } from "@tanstack/react-query";
import { githubLogin, getUserRepos } from "@api/services/git.services";
import { type User } from "@api/models/user";
import { type Repo } from "@api/models/repo";



export const useGitHubData = () => {
  const userQuery = useQuery<User, Error>({
    queryKey: ["githubUser"],
    queryFn: () => {
      const token = localStorage.getItem("github_token"); 
      if (!token) throw new Error("No GitHub token found");
      return githubLogin();
    },
    enabled: !!localStorage.getItem("github_token"),
  });

  const reposQuery = useQuery<Repo[], Error>({
    queryKey: ["githubRepos"],
    queryFn: () => {
      const token = localStorage.getItem("github_token"); 
      if (!token) throw new Error("No GitHub token found");
      return getUserRepos();
    },
    enabled: !!localStorage.getItem("github_token"),
  });

  return { userQuery, reposQuery };
};
