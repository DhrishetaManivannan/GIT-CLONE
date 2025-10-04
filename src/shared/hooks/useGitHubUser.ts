import { useState, useEffect } from "react";
import { githubLogin } from "@api/services/git.services";
import { type User } from "@api/models/user";

export function useGitHubUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("github_token");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      try {
        const profile = await githubLogin();
        setUser(profile);
      } catch (err) {
        console.error("Failed to fetch GitHub user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, setUser };
}
