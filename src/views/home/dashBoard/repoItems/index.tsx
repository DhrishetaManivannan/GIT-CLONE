import React, { useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import { FolderOutlined, FileOutlined } from "@ant-design/icons";
import { Button, Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import styles from "./repoItem.module.scss";
import { type LastCommit } from "@api/models/user";
import { type RepoItemProps } from "@shared/types/RepoExplorer";
import { getLastCommitForFile, getFileContent } from "@api/services/git.services";

const RepoItem: React.FC<RepoItemProps> = ({ item, owner, repo, onFolderClick, onFileClick }) => {
  
  const fetchLastCommit = useCallback(async (): Promise<LastCommit | null> => {
    if (!item.path) return null;
    return getLastCommitForFile(owner, repo, item.path);
  }, [owner, repo, item.path]);

  const { data: lastCommit, isLoading } = useQuery<LastCommit | null>({
    queryKey: ["lastCommit", owner, repo, item.path],
    queryFn: fetchLastCommit,
    enabled: !!item.path,
  });

  const handleClick = useCallback(async () => {
    if (item.type === "dir") {
      onFolderClick(item.name);
    } else {
      try {
        const { content, sha } = await getFileContent(owner, repo, item.path);
        onFileClick({ path: item.path, content, sha });
      } catch {
        onFileClick({ path: item.path, content: "", sha: undefined });
      }
    }
  }, [item, owner, repo, onFolderClick, onFileClick]);

  return (
    <div className={styles.repoItem} onClick={handleClick}>
      <div className={styles.nameSection}>
        <span className={styles.icon}>
          {item.type === "dir" ? <FolderOutlined /> : <FileOutlined />}
        </span>
        <Button
          type="link"
          className={styles.nameLink}
          onClick={(e) => { e.stopPropagation(); handleClick(); }}
        >
          {item.name}
        </Button>
      </div>

      <div className={styles.lastCommit}>
        {isLoading ? <Spin size="small" /> : <span>{lastCommit?.message ?? "No commits"}</span>}
      </div>

      <div className={styles.lastUpdated}>
        {isLoading ? (
          <Spin size="small" />
        ) : lastCommit?.date ? (
          <span>{formatDistanceToNow(new Date(lastCommit.date), { addSuffix: true })}</span>
        ) : (
          <span>-</span>
        )}
      </div>
    </div>
  );
};

export default RepoItem;
