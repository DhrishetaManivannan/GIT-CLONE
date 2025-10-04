import React, { useState, useRef, useEffect } from "react";
import { Input, Spin, List, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import styles from "./searcBar.module.scss";
import { type SearchBarProps } from "@api/models/search";
import { searchGitHub, getFileContent } from "@api/services/git.services";

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  searchType = "repositories",
  repoOwner,
  repoName,
  onSelect,
  
  debounceDelay = 300,
}) => {

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = setTimeout(() => performSearch(value), debounceDelay);
  };

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      const queryString = repoOwner && repoName
        ? `${searchQuery} repo:${repoOwner}/${repoName}`
        : searchQuery;

      const data = await searchGitHub({
        query: queryString,
        type: searchType,
        perPage: 10,
      });

      setResults(data || []);
      setShowDropdown(true);
    } catch (err) {
      console.error("GitHub search failed:", err);
      setResults([]);
      setShowDropdown(false);
      message.error("GitHub search failed. Check your token and network.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectItem = async (item: any) => {
    setQuery(item.path || item.full_name || item.login || item.name);
    setShowDropdown(false);

    if (repoOwner && repoName && searchType === "code") {
      await fetchFileContent(item.path);
    } else {
      onSelect?.(item);
    }
  };

  const fetchFileContent = async (filePath: string) => {
    try {
      
      const { content, sha } = await getFileContent(repoOwner!, repoName!, filePath, );
      onSelect?.({ path: filePath, content, sha });
    } catch (err) {
      console.error("Failed to get file content:", err);
      message.error("Failed to fetch file content. Check branch or file path.");
    }
  };

  const handleClickOutside = () => setShowDropdown(false);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className={styles.searchContainer} onClick={(e) => e.stopPropagation()}>
      <Input
        className={styles.searchInput}
        placeholder={placeholder || "Search..."}
        prefix={<SearchOutlined />}
        size="small"
        value={query}
        onChange={handleInputChange}
        allowClear
      />
      {loading && <Spin size="small" className={styles.loadingSpinner} />}
      {showDropdown && results.length > 0 && (
        <List
          className={styles.dropdown}
          bordered
          dataSource={results}
          renderItem={(item) => (
            <List.Item
              className={styles.dropdownItem}
              onClick={() => handleSelectItem(item)}
            >
              {item.path || item.full_name || item.login || item.name}
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default SearchBar;
