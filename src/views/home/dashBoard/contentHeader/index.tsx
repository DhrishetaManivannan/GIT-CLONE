import React from "react";
import { Button, Dropdown, type MenuProps } from "antd";
import { DownOutlined, EyeOutlined, StarOutlined, ForkOutlined } from "@ant-design/icons";
import FileBreadcrumb from "@shared/components/breadCrumbs"; 
import styles from "./contentHeader.module.scss";

interface ContentHeaderProps {
  owner: string;
  repoName: string;
  fetchFolder: (path: string) => void; 
  path: string;
}

const watchMenuItems: MenuProps['items'] = [
  { key: '1', label: 'Not watching' },
  { key: '2', label: 'Releases only' },
  { key: '3', label: 'Watching' },
];

const starMenuItems: MenuProps['items'] = [
  { key: '1', label: 'Star' },
  { key: '2', label: 'Unstar' },
];

const forkMenuItems: MenuProps['items'] = [
  { key: '1', label: 'Fork' },
];

const ContentHeader: React.FC<ContentHeaderProps> = ({ repoName, path, fetchFolder }) => {
  const pathParts = path.split("/").filter(Boolean); 
  const breadcrumbItems = [repoName, ...pathParts];

  const handleBreadcrumbClick = (index: number) => {
    if (index === 0) {
      fetchFolder("");
      return;
    }
    const newPath = breadcrumbItems.slice(1, index + 1).join("/");
    fetchFolder(newPath);
  };

  return (
    <div className={styles.contentHeader}>
      <div className={styles.leftSection}>
        <div className={styles.repoInfo}>
          <FileBreadcrumb items={breadcrumbItems} onCrumbClick={handleBreadcrumbClick} /> 
          <span className={styles.privateBadge}>Private</span>
        </div>
      </div>

      <div className={styles.rightSection}>
        <Dropdown menu={{ items: watchMenuItems }} trigger={['click']}>
          <Button className={styles.headerButton}>
            <EyeOutlined /> Watch <DownOutlined />
          </Button>
        </Dropdown>
        <Dropdown menu={{ items: forkMenuItems }} trigger={['click']}>
          <Button className={styles.headerButton}>
            <ForkOutlined /> Fork <DownOutlined />
          </Button>
        </Dropdown>
        <Dropdown menu={{ items: starMenuItems }} trigger={['click']}>
          <Button className={styles.headerButton}>
            <StarOutlined /> Star <DownOutlined />
          </Button>
        </Dropdown>
      </div>
    </div>
  );
};

export default ContentHeader;
