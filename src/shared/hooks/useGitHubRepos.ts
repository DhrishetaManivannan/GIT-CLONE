import { useState, useEffect } from "react";
import { getUserRepos } from "@api/services/git.services";
import { type Repo } from "@api/models/repo";

export const useGitHubRepos = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("github_token");
    if (!token) return;

    const fetchRepos = async () => {
      setLoading(true);
      try {
        const repoList = await getUserRepos();
        setRepos(repoList || []);
      } catch (err) {
        console.error("Failed to fetch repositories:", err);
        setRepos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  return { repos, loading, setRepos };
};
