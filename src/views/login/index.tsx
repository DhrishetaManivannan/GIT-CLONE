import React from "react";
import { useNavigate } from "react-router-dom";
import { Divider, Typography, Button as AntdButton, message, Form, Input } from "antd";
import { GithubOutlined, GoogleOutlined } from "@ant-design/icons";
import { loginConstants, inputConstants } from "@constants/auth.constants";
import { githubLogin } from "@api/services/git.services";
import { type LoginFormValues } from "@shared/types/login";
import styles from "./login.module.scss";
import { useMutation } from "@tanstack/react-query";

const { Title, Text, Link } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async ({ token }: LoginFormValues) => {
      if (!token) throw new Error(inputConstants.ERRORS.REQUIRED);
      localStorage.setItem("github_token", token);
      const user = await githubLogin();
      return user;
    },
    onSuccess: (user, variables) => {
      message.success(`Welcome ${user.login}!`);
      navigate("/home", { state: { username: variables.username, token: variables.token } });
    },
    onError: () => {
      message.error(loginConstants.ERRORS.LOGIN_FAILED);
    },
  });

  const onFinish = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  return (
    <div className={styles.loginContainer}>
      <GithubOutlined className={styles.loginLogo} />
      <Title level={3} className={styles.loginTitle}>
        {loginConstants.TITLE}
      </Title>

      <div className={styles.loginCard}>
        <Form<LoginFormValues> layout="vertical" onFinish={onFinish}>
          <Form.Item
            label={loginConstants.INPUTS.USERNAME.LABEL}
            name={loginConstants.INPUTS.USERNAME.NAME}
            rules={loginConstants.INPUTS.USERNAME.RULES}
          >
            <Input
              placeholder={inputConstants.PLACEHOLDERS.USERNAME}
              className={styles.loginInput}
            />
          </Form.Item>

          <Form.Item
            label={loginConstants.INPUTS.PASSWORD.LABEL}
            name={loginConstants.INPUTS.PASSWORD.NAME}
            rules={loginConstants.INPUTS.PASSWORD.RULES}
          >
            <Input.Password
              placeholder={inputConstants.PLACEHOLDERS.PASSWORD}
              className={styles.loginInput}
            />
          </Form.Item>

          <AntdButton
            type={loginConstants.BUTTONS.SIGN_IN.TYPE}
            htmlType={loginConstants.BUTTONS.SIGN_IN.HTML_TYPE}
            block
            loading={loginMutation.isPending}
            className={styles.signinBtn}
          >
            {loginConstants.BUTTONS.SIGN_IN.TEXT}
          </AntdButton>
        </Form>

        <Divider className={styles.divider}>{loginConstants.DIVIDER}</Divider>

        <AntdButton block className={styles.googleBtn} disabled icon={<GoogleOutlined />}>
          {loginConstants.BUTTONS.GOOGLE_SIGNIN.TEXT}
        </AntdButton>
      </div>

      <div className={styles.bottomLinks}>
        <Text>
          <Link>{loginConstants.LINKS.CREATE_ACCOUNT}</Link>
        </Text>
        <br />
        <Link>{loginConstants.LINKS.SIGNIN_PASSKEY}</Link>
      </div>

      <div className={styles.footerLinks}>
        {loginConstants.FOOTER_LINKS.map((link, idx) => (
          <Link key={idx}>{link}</Link>
        ))}
      </div>
    </div>
  );
};

export default LoginPage;
