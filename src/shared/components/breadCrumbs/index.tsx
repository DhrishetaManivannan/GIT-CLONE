import React from "react";
import { Breadcrumb } from "antd";
import styles from "./breadCrumbs.module.scss";

interface FileBreadcrumbProps {
  items: string[];
  onCrumbClick?: (index: number) => void; 
}

const FileBreadcrumb: React.FC<FileBreadcrumbProps> = ({ items, onCrumbClick }) => {
  const breadcrumbItems = items.map((crumb, idx) => {
    const isLast = idx === items.length - 1;
    return {
      key: idx,
      title: (
        <span
          className={styles.breadcrumbItem}
          onClick={() => {
            if (!isLast && onCrumbClick) onCrumbClick(idx);
          }}
          style={{ cursor: isLast ? "default" : "pointer" }}
        >
          {crumb}
        </span>
      ),
    };
  });

  return <Breadcrumb separator="/" items={breadcrumbItems} />;
};

export default FileBreadcrumb;
