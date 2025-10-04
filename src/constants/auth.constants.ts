import { type ButtonHTMLType } from "antd/lib/button/buttonHelpers";

export const loginConstants = {
  TITLE: "Sign in to GitHub",

  INPUTS: {
    USERNAME: {
      NAME: "username",
      LABEL: "Username or email address",
      RULES: [{ required: true, message: "Please enter your username or email!" }],
    },
    PASSWORD: {
      NAME: "token",
      LABEL: "GitHub Token",
      RULES: [{ required: true, message: "Please enter your GitHub token!" }],
    },
  },

  LINKS: {
    CREATE_ACCOUNT: "Create an account",
    SIGNIN_PASSKEY: "Sign in with a passkey",
  },

  BUTTONS: {
    SIGN_IN: {
      TYPE: "primary" as "primary",
      HTML_TYPE: "submit" as ButtonHTMLType,
      TEXT: "Sign in",
    },
    GOOGLE_SIGNIN: {
      TEXT: "Continue with Google",
    },
  },

  DIVIDER: "or",

  FOOTER_LINKS: [
    "Terms",
    "Privacy",
    "Docs",
    "Contact GitHub Support",
    "Manage cookies",
    "Do not share my personal information",
  ],

  ERRORS: {
    INVALID_CREDENTIALS: "Invalid username or token!",
    LOGIN_FAILED: "Login failed. Check your username/token.",
  },
};

export const inputConstants = {
  PLACEHOLDERS: {
    USERNAME: "Enter your username or email",
    PASSWORD: "Enter your personal access token",
  },
  ERRORS: {
    REQUIRED: "This field is required",
  },
};
