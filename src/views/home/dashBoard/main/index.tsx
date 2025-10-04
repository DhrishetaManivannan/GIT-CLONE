import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Spin, Alert } from "antd"; 
import Navbar from "@shared/components/navBar";
import Sidebar from "../../sideBar";
import RepoTabs from "../repoTabs";
import ContentHeader from "../contentHeader";
import RepoExplorer from "../repoExplorer";
import Home from "../../homeContent";
import CreateFile from "../branchSearch/createFile";
import BranchAndSearch from "../branchSearch";
import styles from "./dashBoard.module.scss";
import { type Repo } from "@api/models/repo";
import { type GitHubUser } from "@api/models/user";
import { getRepoContents, githubLogin } from "@api/services/git.services";
import { useFileEditor, type FileData } from "@shared/hooks/useFileEditor";
import type { SearchItem } from "@api/models/search";

const Dashboard: React.FC = () => {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<GitHubUser | null>(null);
  const { selectedFile, showEditor, openFile, closeEditor } = useFileEditor();

  const isRepoSelected = Boolean(owner && repo);
  const isEditorOpen = showEditor && selectedFile;

  const path = useMemo(() => {
    if (!isRepoSelected) return "";
    const pathParts = location.pathname.split(`/${owner}/${repo}/`);
    if (pathParts.length > 1) {
      const [type, ...rest] = pathParts[1].split("/");
      if (type === "tree" || type === "blob") {
        return rest.join("/");
      }
    }
    return "";
  }, [location.pathname, owner, repo, isRepoSelected]);

  const {
    
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["repoContents", owner, repo, path],
    queryFn: () => getRepoContents(owner!, repo!, path),
    enabled: isRepoSelected,
  });
  useEffect(() => {
    const token = localStorage.getItem("github_token");
    if (!token) return;
    githubLogin().then(setUser).catch(console.error);
  }, []);

  const handleRepoSelect = useCallback(
    (selectedRepo: Repo) => {
      navigate(`/${selectedRepo.owner.login}/${selectedRepo.name}`);
      closeEditor();
    },
    [navigate, closeEditor]
  );

  const handleFolderClick = useCallback(
    (folderName: string) => {
      const newPath = path ? `${path}/${folderName}` : folderName;
      navigate(`/${owner}/${repo}/tree/${newPath}`);
    },
    [path, owner, repo, navigate]
  );

  const handleFileClick = useCallback(
    (file: FileData) => {
      openFile(file);
      navigate(`/${owner}/${repo}/blob/${file.path}`);
    },
    [openFile, owner, repo, navigate]
  );

  const handleSearchFileSelect = useCallback(
    async (item: FileData | SearchItem) => {
      if (!owner || !repo) return;
      const filePath = item.path || path;

      let content = "";
      if ("content" in item && item.content) {
        content = item.content;
      } else {
        try {
          const fileData = await getRepoContents(owner, repo, filePath);
          const fileObj = Array.isArray(fileData) ? fileData[0] : fileData;
          content = fileObj.content || "";
        } catch (err) {
          console.error("Failed to fetch file content:", err);
        }
      }

      openFile({ path: filePath, content, sha: (item as any).sha });
      navigate(`/${owner}/${repo}/blob/${filePath}`);
    },
    [openFile, owner, repo, path, navigate]
  );

  const navbar = <Navbar pageTitle={repo || "Dashboard"} onSearchSelect={handleRepoSelect} />;
  if (!isRepoSelected) {
    return (
      <div className={styles.dashboard}>
        {navbar}
        <div className={styles.mainContentWrapper}>
          <Sidebar onRepoSelect={handleRepoSelect} />
          <div className={styles.mainContentArea}>
            <div className={styles.home}>
              <Home />
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className={styles.dashboard}>
        {navbar}
        <div className={styles.loadingState}>
          <Spin size="large" spinning={isLoading} tip="Loading repository contents..."  className={styles.fullPageSpinner}/>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.dashboard}>
        {navbar}
        <div className={styles.errorState}>
          <Alert
            message="Error"
            description={`Failed to load repository data: ${error.message}`}
            type="error"
            showIcon
          />
        </div>
      </div>
    );
  }
  return (
    <div className={styles.dashboard}>
      {navbar}
      <div className={styles.mainContentWrapper}>
        <div className={styles.mainContentArea}>
          <RepoTabs activeTab="code" setActiveTab={() => {}} />
          {isEditorOpen && selectedFile ? (
            <CreateFile
              owner={owner!}
              repo={repo!}
              currentPath={selectedFile.path || path}
              fileContent={selectedFile.content}
              sha={selectedFile.sha}
              onCancel={closeEditor}
              onFolderClick={handleFolderClick} 
            />
          ) : (
            <>
              <ContentHeader
                owner={owner!}
                repoName={repo!}
                fetchFolder={handleFolderClick} 
                path={path}
              />
              <BranchAndSearch owner={owner!} repo={repo!} path={path} onSelect={handleSearchFileSelect} />
              <RepoExplorer
                owner={owner!}
                repo={repo!}
                path={path}

                onFolderClick={handleFolderClick}
                onFileClick={handleFileClick}
                user={user}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;