import React, { useEffect, useState, useCallback } from "react";
import RepoItem from "../repoItems";
import styles from "./repoExplorer.module.scss";
import { getRepoContents, getUserRepos } from "@api/services/git.services";
import type { RepoContent } from "@api/models/repo";
import type { GitHubUser } from "@api/models/user";
import type { RepoExplorerProps } from "@shared/types/RepoExplorer";

const RepoExplorer: React.FC<RepoExplorerProps> = ({
  owner,
  repo,
  path,
  onFolderClick,
  onFileClick,
}) => {
  const [repoContents, setRepoContents] = useState<RepoContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<GitHubUser | null>(null);

  const fetchRepoContents = useCallback(async () => {
    const token = localStorage.getItem("github_token");
    if (!token) return;

    setLoading(true);
    try {
      const contents = await getRepoContents(owner, repo, path);
      setRepoContents(
        contents.map(item => ({
          name: item.name,
          path: item.path,
          url: item.url,
          download_url: item.download_url,
          type: item.type === "dir" ? "dir" : "file",
          content: item.content || "",
        }))
      );

      const userRepos = await getUserRepos(); 
      const matchedRepo = userRepos.find(r => r.name === repo);
      if (matchedRepo) {
        setUser({ login: matchedRepo.owner.login, avatar_url: matchedRepo.owner.avatar_url });
      }
    } catch (err) {
      console.error("Failed to fetch repo contents or user:", err);
    } finally {
      setLoading(false);
    }
  }, [owner, repo, path]);

  useEffect(() => {
    fetchRepoContents();
  }, [fetchRepoContents]);

  return (
    <div className={styles.repoExplorer}>
      <div className={styles.commitInfoContainer}>
        {user && (
          <div className={styles.commitInfo}>
            <img src={user.avatar_url} alt="User Avatar" className={styles.avatar} />
            <span className={styles.commitMessage}>{user.login}</span>
            <span className={styles.commitTime}>Last updated</span>
          </div>
        )}
        <div className={styles.commitCount}>
          <span className={styles.commitCountText}>{repoContents.length} Items</span>
        </div>
      </div>

      <div className={styles.fileListHeader}>
        <span className={styles.fileNameHeader}>Name</span>
        <span className={styles.fileCommitHeader}>Last Commit</span>
        <span className={styles.fileTimeHeader}>Last Updated</span>
      </div>

      {loading ? (
        <p className={styles.loading}>Loading contents...</p>
      ) : (
        <div className={styles.fileList}>
          {repoContents.map(item => (
            <RepoItem
              key={item.path}
              item={item}
              owner={owner}
              repo={repo}
              onFolderClick={onFolderClick}
              onFileClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RepoExplorer;
