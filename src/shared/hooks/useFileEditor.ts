
import { useState } from "react";

export interface FileData {
  path: string;
  content: string;
  sha?: string;
}

export interface Branch {
  name: string;
  [key: string]: unknown; 
}

export interface Tag {
  name: string;
  [key: string]: unknown;
} 


export type RepoResult = {
  name: string;
  full_name: string;
  path?: string;
  [key: string]: unknown;
};

export type UserResult = {
  login: string;
  path?: string;
  [key: string]: unknown;
};

export type CodeResult = {
  path: string;
  name: string;
  [key: string]: unknown;
};

export type SearchResult = RepoResult | UserResult | CodeResult;


export const useFileEditor = () => {
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const openFile = (file: FileData) => {
    setSelectedFile(file);
    setShowEditor(true);
  };

  const closeEditor = () => {
    setSelectedFile(null);
    setShowEditor(false);
  };

  const createNewFile = (path = "") => {
    setSelectedFile({ path, content: "" });
    setShowEditor(true);
  };

  return { selectedFile, showEditor, openFile, closeEditor, createNewFile };
};
