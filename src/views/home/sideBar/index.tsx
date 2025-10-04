import React, { useState, useMemo } from "react";
import { Avatar, Input, Button, Spin } from "antd";
import { UserOutlined, DownOutlined, BookOutlined, TeamOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import styles from "./sidebar.module.scss";
import { type SidebarProps } from "@shared/types/SideBar";
import { sidebarConstants } from "@constants/sideBar.constants";
import { githubLogin, getUserRepos } from "@api/services/git.services";
import { type User } from "@api/models/user";
import { type Repo } from "@api/models/repo";

const Sidebar: React.FC<SidebarProps> = ({ activeRepo, onRepoSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const userQuery = useQuery<User, Error>({
    queryKey: ["githubUser"],
    queryFn: async () => {
      const token = localStorage.getItem("github_token");
      if (!token) throw new Error("No GitHub token found");
      return githubLogin();
    },
  });

  const reposQuery = useQuery<Repo[], Error>({
    queryKey: ["githubRepos"],
    queryFn: async () => {
      const token = localStorage.getItem("github_token");
      if (!token) throw new Error("No GitHub token found");
      return getUserRepos();
    },
  });

  const loading = userQuery.isLoading || reposQuery.isLoading;
  const error = userQuery.isError || reposQuery.isError;
  const user = userQuery.data;
  const repos = reposQuery.data || [];

  const filteredRepos = useMemo(() => {
    if (!searchQuery) return repos;
    return repos.filter((repo) => repo.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [repos, searchQuery]);

  return (
    <div className={styles.sidebar}>
      {loading ? (
        <Spin style={{ margin: "20px auto", display: "block" }} />
      ) : error ? (
        <div className={styles.error}>{sidebarConstants.ERRORS.LOAD_FAILED}</div>
      ) : (
        <>
          {user && (
            <div className={styles.userSection}>
              <Avatar src={user.avatar_url} icon={<UserOutlined />} size={36} />
              <span className={styles.username}>{user.login}</span>
              <DownOutlined className={styles.dropdownIcon} />
            </div>
          )}

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>{sidebarConstants.SECTIONS.TOP_REPOS}</span>
              <Button className={styles.newButton}>
                <BookOutlined /> {sidebarConstants.BUTTONS.NEW_REPO}
              </Button>
            </div>

            <Input
              placeholder={sidebarConstants.PLACEHOLDERS.REPO_SEARCH}
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className={styles.repoList}>
              {filteredRepos.length > 0 ? (
                filteredRepos.map((repo) => (
                  <div
                    key={repo.id}
                    className={`${styles.repoItem} ${activeRepo === repo.name ? styles.active : ""}`}
                    onClick={() => onRepoSelect(repo)}
                  >
                    <BookOutlined className={styles.repoIcon} />
                    {repo.name}
                  </div>
                ))
              ) : (
                <div className={styles.noResults}>{sidebarConstants.NO_RESULTS}</div>
              )}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>{sidebarConstants.SECTIONS.YOUR_TEAMS}</span>
            </div>

            <Input
              placeholder={sidebarConstants.PLACEHOLDERS.TEAM_SEARCH}
              className={styles.searchInput}
            />

            <div className={styles.repoList}>
              <div className={styles.repoItem}>
                <TeamOutlined className={styles.repoIcon} />
                {sidebarConstants.DEFAULT_TEAM}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
