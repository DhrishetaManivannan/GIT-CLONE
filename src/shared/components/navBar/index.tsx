import React from "react";
import { Avatar, Typography, Dropdown, Tooltip, Badge } from "antd";
import {UserOutlined,BellOutlined,PlusOutlined,  GithubOutlined,  AimOutlined,PullRequestOutlined,  MenuOutlined,} from "@ant-design/icons";
import styles from "./navBar.module.scss";
import SearchBar from "@shared/components/searchBar";
import { useGitHubData } from "@shared/hooks/useGitHubDats";

const { Text } = Typography;

interface NavbarProps {
  pageTitle: string;
  onSearchSelect?: (item: any) => void;
}

const Navbar: React.FC<NavbarProps> = ({ pageTitle, onSearchSelect }) => {
  const { userQuery } = useGitHubData();
  const { data: user, isLoading } = userQuery;

  const profileMenu = [
    { key: "profile", label: <a href={user?.html_url} target="_blank">Profile</a> },
    { key: "signout", label: <span>Sign out</span> },
  ];

  return (
    <div className={styles.navbar}>
      <div className={styles.left}>
        <MenuOutlined className={styles.menu} />
        <GithubOutlined className={styles.logo} />
        <Text className={styles.pageTitle}>{pageTitle}</Text>
      </div>

      <div className={styles.right}>
        <SearchBar
          placeholder="Search repositories..."
          searchType="repositories"
          onSelect={onSearchSelect}
        />

        <Tooltip title="Pull Requests">
          <PullRequestOutlined className={styles.icon} />
        </Tooltip>

        <Tooltip title="Issues">
          <AimOutlined className={styles.icon} />
        </Tooltip>

        <Tooltip title="Create new">
          <PlusOutlined className={styles.icon} />
        </Tooltip>

        <Tooltip title="Notifications">
          <Badge dot>
            <BellOutlined className={styles.icon} />
          </Badge>
        </Tooltip>

        {isLoading ? (
          <p style={{ marginLeft: 10 }}>Loading...</p>
        ) : user ? (
          <Dropdown menu={{ items: profileMenu }} placement="bottomRight">
            <div className={styles.profileContainer}>
              <Avatar src={user.avatar_url} size={36} icon={<UserOutlined />} />
            </div>
          </Dropdown>
        ) : null}
      </div>
    </div>
  );
};

export default Navbar;
