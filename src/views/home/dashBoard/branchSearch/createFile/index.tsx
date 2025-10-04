import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input, Button, Tabs, Dropdown, message, Modal, Radio } from "antd";
import { CheckOutlined, MoreOutlined, DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MenuProps } from "antd";
import type { MenuInfo } from "rc-menu/lib/interface";
import { createFile, updateFile, deleteFile } from "@api/services/git.services";
import type { CreateFilePayload, UpdateFilePayload, DeleteFilePayload,CreateFileProps } from "@api/models/create";
import FileBreadcrumb from "@shared/components/breadCrumbs";
import styles from "./createFile.module.scss";

const { TextArea } = Input;
const { confirm } = Modal;


const CreateFile: React.FC<CreateFileProps> = ({
  owner,repo, sha, branch = "main",currentPath, fileContent, onCancel,onFolderClick,
}) => {
  const token = localStorage.getItem("github_token") || "";
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [fileName, setFileName] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [commitModalVisible, setCommitModalVisible] = useState(false);
  const [commitBranchOption, setCommitBranchOption] = useState<"direct" | "new">("direct");

  useEffect(() => {
    const pathMatch = location.pathname.match(/blob\/(.+)$/);
    const filePathFromURL = pathMatch ? pathMatch[1] : "";
    const name = filePathFromURL.split("/").pop() || "";

    if (sha) setFileName(name); 
    else setFileName("");       

    setEditorContent(fileContent || "");
  }, [location.pathname, fileContent, sha]);


  const saveMutation = useMutation<void, Error, CreateFilePayload | UpdateFilePayload>({
    mutationFn: async (payload) => {
      if ("sha" in payload && payload.sha) await updateFile(payload as UpdateFilePayload);
      else await createFile(payload as CreateFilePayload);
    },
    onSuccess: () => {
      message.success(`File "${fileName}" saved successfully!`);
      setCommitMessage("");
      setCommitModalVisible(false);

      queryClient.invalidateQueries({ queryKey: ["repoContents", owner, repo], exact: false });
      queryClient.invalidateQueries({ queryKey: ["lastCommit", owner, repo], exact: true });
      if (!sha) setFileName("");

      if (onCancel) onCancel();
    },
    onError: (error: Error) => {
      console.error("Failed to save file:", error);
      message.error("Failed to save file.");
    },
  });

  const deleteMutation = useMutation<void, Error, DeleteFilePayload>({
    mutationFn: deleteFile,
    onSuccess: () => {
      message.success(`File "${fileName}" deleted successfully!`);
      queryClient.invalidateQueries({ queryKey: ["repoContents", owner, repo], exact: false });
      queryClient.invalidateQueries({ queryKey: ["lastCommit", owner, repo], exact: true });
      if (onCancel) onCancel();
    },
    onError: (error: Error) => {
      console.error("Failed to delete file:", error);
      message.error("Failed to delete file.");
    },
  });

  const handleFileNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setFileName(e.target.value), []);
  const handleEditorChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => setEditorContent(e.target.value), []);
  const handleCommitMessageChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => setCommitMessage(e.target.value), []);

  const handleSaveFile = useCallback(() => {
    if (!fileName.trim()) { message.error("File name cannot be empty"); return; }
    if (!editorContent.trim()) { message.error("File content cannot be empty"); return; }
    if (!commitMessage.trim()) { message.error("Commit message is required"); return; }

    const pathParts = currentPath.split("/").filter(Boolean);
    const folderPath = sha ? pathParts.slice(0, -1).join("/") : pathParts.join("/"); 
    const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;

    const payload = sha
      ? { token, owner, repoName: repo, filePath, content: editorContent, commitMessage, branch, sha }
      : { token, owner, repoName: repo, filePath, content: editorContent, commitMessage, branch };

    saveMutation.mutate(payload);

    if (sha) navigate(`/${owner}/${repo}/blob/${filePath}`, { replace: true });
    else navigate(`/${owner}/${repo}/tree/${folderPath}`, { replace: true });
  }, [fileName, editorContent, commitMessage, sha, token, owner, repo, branch, currentPath, saveMutation, navigate]);

  const handleDeleteFile = useCallback(() => {
    if (!sha) return;
    confirm({
      title: `Delete ${fileName}?`,
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        const pathParts = currentPath.split("/").filter(Boolean);
        const folderPath = pathParts.slice(0, -1).join("/");
        deleteMutation.mutate({ token, owner, repoName: repo, filePath: currentPath, commitMessage: `Delete ${fileName}`, branch, sha });
        navigate(`/${owner}/${repo}/tree/${folderPath}`, { replace: true });
      },
    });
  }, [sha, fileName, token, owner, repo, branch, currentPath, deleteMutation, navigate]);

  const menuItems: MenuProps["items"] = [
    { key: "raw", label: "Raw file content" },
    { key: "download", label: "Download" },
    { key: "jumpLine", label: "Jump a line / Copy path" },
    { key: "copyPermalink", label: "Copy permalink" },
    { type: "divider" },
    { key: "viewOptions", label: "View options (static)" },
    { key: "delete", label: "Delete file", icon: <DeleteOutlined /> },
  ];

  const handleMenuClick: MenuProps['onClick'] = useCallback((info: MenuInfo) => {
    if (info.key === "delete") handleDeleteFile();
    else message.info(`Clicked ${info.key}`);
  }, [handleDeleteFile]);

  const pathCrumbs = currentPath.split("/").filter(Boolean);
  const breadcrumbItems = sha
    ? [owner, repo, ...pathCrumbs.slice(0, -1)]
    : [owner, repo, ...pathCrumbs];

  const handleCrumbClick = useCallback((index: number) => {
    const newPath = breadcrumbItems.slice(2, index + 1).join("/");
    if (onFolderClick) onFolderClick(newPath);
    navigate(`/${owner}/${repo}/tree/${newPath}`);
  }, [breadcrumbItems, onFolderClick, navigate, owner, repo]);
  return (
    <div className={styles.createFileContainer}>
      <div className={styles.topBar}>
        <div className={styles.breadcrumb}>
          <FileBreadcrumb items={breadcrumbItems} onCrumbClick={handleCrumbClick} />
          <Input
            className={styles.fileNameInput}
            placeholder={sha ? "File name" : "Enter file name..."}
            value={fileName}
            onChange={handleFileNameChange}
            autoComplete="off"
          />
        </div>
        <div className={styles.actions}>
          <Button className={styles.cancelButton} onClick={onCancel}>Cancel changes</Button>
          <Button type="primary" className={styles.commitButton} onClick={() => setCommitModalVisible(true)}>
            <CheckOutlined /> Commit changes...
          </Button>
          <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} placement="bottomRight">
            <Button className={styles.moreButton}><MoreOutlined /></Button>
          </Dropdown>
        </div>
      </div>

      <div className={styles.editorWrapper}>
        <div className={styles.editorControls}>
          <Tabs defaultActiveKey="edit" items={[{ key: "edit", label: "Edit" }, { key: "blame", label: "Blame" }]} className={styles.editorTabs} />
          <div className={styles.settings}>
            <span className={styles.settingButton}>Spaces ▾</span>
            <span className={styles.settingButton}>2 ▾</span>
            <span className={styles.settingButton}>No wrap ▾</span>
          </div>
        </div>
        <TextArea
          className={styles.codeEditor}
          placeholder="Enter file contents here"
          value={editorContent}
          onChange={handleEditorChange}
          rows={20}
        />
      </div>

      <Modal
        open={commitModalVisible}
        title="Commit changes"
        onCancel={() => setCommitModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setCommitModalVisible(false)}>Cancel</Button>,
          <Button key="commit" type="primary" onClick={handleSaveFile}>Commit changes</Button>,
        ]}
      >
        <div className={styles.commitMessageHeader}>
          <h4>Commit message</h4>
          <TextArea
            rows={2}
            placeholder="Enter commit message"
            value={commitMessage}
            onChange={handleCommitMessageChange}
            style={{ marginBottom: 12 }}
          />
          <h4>Extended description</h4>
          <TextArea
            rows={4}
            placeholder="Add an optional extended description..."
            value={""}
            onChange={() => {}}
            style={{ marginBottom: 12 }}
          />
          <Radio.Group
            onChange={(e) => setCommitBranchOption(e.target.value)}
            value={commitBranchOption}
          >
            <Radio value="direct">Commit directly to the main branch</Radio>
            <Radio value="new">Create a new branch for this commit and start a pull request</Radio>
          </Radio.Group>
        </div>
      </Modal>
    </div>
  );
};

export default CreateFile;
