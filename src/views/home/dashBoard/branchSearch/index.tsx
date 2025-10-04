import React from "react";
import { Button, Dropdown, Spin, Alert, type MenuProps } from "antd";
import { DownOutlined, CodeOutlined, BranchesOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import styles from "./branchSearch.module.scss";
import SearchBar from "@shared/components/searchBar";
import { getRepo, getBranches, getTags } from "@api/services/git.services";
import{type OnSelectType} from "@api/models/search"
import { type Branch, type Tag} from "@shared/hooks/useFileEditor";

interface BranchAndSearchProps {
  owner: string;
  repo: string;
  path: string;
  onSelect?: OnSelectType;
}

interface RepoData {
  default_branch: string;
  name: string;
  full_name: string;
  private: boolean;

}

const BranchAndSearch: React.FC<BranchAndSearchProps> = ({ owner, repo, path, onSelect }) => {

  const { data: repoData, isLoading: repoLoading, isError: repoError, error: repoErrorObj } =
    useQuery<RepoData, Error>({
      queryKey: ["repo", owner, repo],
      queryFn: () => getRepo(owner, repo),
      retry: false,
    });

    const { data: branches, isLoading: branchesLoading } = useQuery<string[]>({
      queryKey: ["branches", owner, repo],
      queryFn: async () => (await getBranches(owner, repo) as Branch[]).map(b => b.name),
      enabled: !!repoData,
    });

    const { data: tags, isLoading: tagsLoading } = useQuery<string[]>({
      queryKey: ["tags", owner, repo],
      queryFn: async () => (await getTags(owner, repo) as Tag[]).map(t => t.name),
      enabled: !!repoData,
    });


  if (repoLoading || branchesLoading || tagsLoading) {
    return (
      <div className={styles.branchAndSearchContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (repoError) {
    return (
      <div className={styles.branchAndSearchContainer}>
        <Alert
          type="error"
          message="Repository not found or access denied"
          description={repoErrorObj?.message}
        />
      </div>
    );
  }

  const currentBranch = repoData?.default_branch;

  const handleCreateNewFileClick = (): void => {
    if (onSelect) onSelect({ path, content: "" });
  };

  const addFileMenuItems: MenuProps['items'] = [
    { key: "create", label: "+ Create new file", onClick: handleCreateNewFileClick },
    { key: "upload", label: "Upload file", onClick: () => console.log("Upload file clicked") },
  ];

  return (
    <div className={styles.branchAndSearchContainer}>
      <div className={styles.branchSelectorWrapper}>
        <Button className={styles.branchButton}>
          <BranchesOutlined />
          <span className={styles.branchName}>{currentBranch}</span>
          <DownOutlined />
        </Button>
        <span className={styles.branchInfo}>
          <span className={styles.branchCount}>{branches?.length || 0} Branches</span>{" "}
          <span className={styles.tagCount}>{tags?.length || 0} Tags</span>
        </span>
      </div>
      <div className={styles.searchAndAddFile}>
        <SearchBar
          placeholder="Go to file"
          searchType="code"
          repoOwner={owner}
          repoName={repo}
          onSelect={onSelect}
        />

        <Dropdown menu={{ items: addFileMenuItems }} trigger={["click"]} placement="bottomLeft">
          <Button className={styles.addButton}>Add file <DownOutlined /></Button>
        </Dropdown>

        <Button className={styles.codeButton}>
          <CodeOutlined /> Code <DownOutlined />
        </Button>
      </div>
    </div>
  );
};

export default BranchAndSearch;
