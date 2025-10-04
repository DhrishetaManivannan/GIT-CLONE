import React from "react";
import { Avatar, Input, Button, Card, Divider } from "antd";
import { SearchOutlined,  GithubFilled } from "@ant-design/icons";
import styles from "./homeContent.module.scss";

const Home: React.FC = () => {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Home</h1>
        <div className={styles.searchSection}>
          <Input 
            placeholder="Ask Copilot" 
            prefix={<SearchOutlined />} 
            className={styles.copilotInput} 
          />
          <Button className={styles.copilotButton}>
            Summarize a pull request
          </Button>
          <Button className={styles.copilotButton}>
            My open pull requests
          </Button>
          <Button className={styles.copilotButton}>
            Interpret an architecture diagram
          </Button>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.feedSection}>
          <h2 className={styles.feedTitle}>Feed</h2>
          <div className={styles.filterButton}>
            <Button>Filter</Button>
          </div>
          <div className={styles.feedItem}>
            <div className={styles.repoHeader}>
              <Avatar src="https://avatars.githubusercontent.com/u/7990141?s=200&v=4" />
              <div className={styles.repoInfo}>
                <h3 className={styles.repoName}>cloudflare/capnweb</h3>
                <p className={styles.repoDescription}>
                  JavaScript/TypeScript-native, low-boilerplate, object-capability RPC system
                </p>
                <div className={styles.repoDetails}>
                  <span className={styles.languageBadge} style={{ backgroundColor: '#2b7489' }}></span>
                  <span className={styles.languageName}>TypeScript</span>
                  <span className={styles.stars}>1.5k ★</span>
                </div>
              </div>
              <Button className={styles.starButton}>Star</Button>
            </div>
          </div>
          <div className={styles.feedItem}>
            <div className={styles.repoHeader}>
              <Avatar src="https://avatars.githubusercontent.com/u/1018595?s=200&v=4" />
              <div className={styles.repoInfo}>
                <h3 className={styles.repoName}>elastic/elasticsearch</h3>
                <p className={styles.repoDescription}>
                  Free and Open Source, Distributed, RESTful Search Engine
                </p>
                <div className={styles.repoDetails}>
                  <span className={styles.languageBadge} style={{ backgroundColor: '#b07219' }}></span>
                  <span className={styles.languageName}>Java</span>
                  <span className={styles.stars}>74.2k ★</span>
                </div>
              </div>
              <Button className={styles.starButton}>Star</Button>
            </div>
          </div>
        </div>

        <div className={styles.changelogSection}>
          <h2 className={styles.changelogTitle}>Latest changes</h2>
          <Card className={styles.changelogCard}>
            <div className={styles.changelogItem}>
              <span className={styles.timeAgo}>1 hour ago</span>
              <p>Copilot Spaces is now generally available</p>
            </div>
            <div className={styles.changelogItem}>
              <span className={styles.timeAgo}>2 hours ago</span>
              <p>Recent changes to the home dashboard disabled</p>
            </div>
            <div className={styles.changelogItem}>
              <span className={styles.timeAgo}>3 hours ago</span>
              <p>Start and track Copilot coding agent tasks in GitHub Mobile</p>
            </div>
            <div className={styles.changelogItem}>
              <span className={styles.timeAgo}>3 hours ago</span>
              <p>Spark updates: automatic error fixes, faster publishing,...</p>
            </div>
          </Card>
          <a href="#" className={styles.changelogLink}>View changelog →</a>
        </div>
      </div>

      <Divider />

      <footer className={styles.footer}>
        <GithubFilled className={styles.footerIcon} />
        <span>© 2025 GitHub, Inc.</span>
        <a href="#">Privacy</a>
        <a href="#">Security</a>
        <a href="#">Status</a>
        <a href="#">Community</a>
        <a href="#">Docs</a>
        <a href="#">Contact</a>
        <a href="#">Manage cookies</a>
        <a href="#">Do not share my personal information</a>
      </footer>
    </div>
  );
};

export default Home;
