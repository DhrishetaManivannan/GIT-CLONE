import React from "react";
import {CodeOutlined,  BugOutlined,  BranchesOutlined,ThunderboltOutlined,  ProjectOutlined,LockOutlined,  BarChartOutlined,SettingOutlined,
} from "@ant-design/icons";
import styles from "./repoTabs.module.scss";

interface RepoTabsProps {
  activeTab: "code" | "issues";
  setActiveTab: (tab: "code" | "issues") => void;
}

const tabItems = [
  { key: "code", label: "Code", icon: <CodeOutlined /> },
  { key: "issues", label: "Issues", icon: <BugOutlined /> },
  { key: "pulls", label: "Pull Requests", icon: <BranchesOutlined /> },
  { key: "actions", label: "Actions", icon: <ThunderboltOutlined /> },
  { key: "projects", label: "Projects", icon: <ProjectOutlined /> },
  { key: "security", label: "Security", icon: <LockOutlined /> },
  { key: "insights", label: "Insights", icon: <BarChartOutlined /> },
  { key: "settings", label: "Settings", icon: <SettingOutlined /> },
];

const RepoTabs: React.FC<RepoTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className={styles.repoTabs}>
      {tabItems.map((tab) => (
        <button
          key={tab.key}
          className={`${styles.tabButton} ${activeTab === tab.key ? styles.active : ""}`}
          onClick={() => setActiveTab(tab.key as "code" | "issues")}
        >
          <span className={styles.icon}>{tab.icon}</span>
          <span className={styles.label}>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default RepoTabs;
