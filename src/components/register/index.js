// @flow

import * as React from "react";
import { Link, navigate } from "@reach/router";
import cn from "classnames";
import { Form, GlobalError, TextInput, Submit } from "../form";
import { makeCancelable, CanceledError } from "../../lib/make-cancelable";
import * as api from "../../lib/api";

type RegisterProps = {|
  setCurrentUser: api.User => void
|};

type RegisterState = {|
  submitting: boolean,
  error:
    | {| type: "none" |}
    | {| type: "network" |}
    | {|
        type: "fields",
        username?: string[],
        email?: string[],
        password?: string[]
      |},
  username: string,
  email: string,
  password: string
|};

class Register extends React.Component<RegisterProps, RegisterState> {
  state = {
    submitting: false,
    error: { type: "none" },
    username: "",
    email: "",
    password: ""
  };

  usernameInputRef = React.createRef<HTMLInputElement>();
  emailInputRef = React.createRef<HTMLInputElement>();
  passwordInputRef = React.createRef<HTMLInputElement>();

  focusFirstInvalidInput() {
    if (this.state.error.type === "fields") {
      if (
        this.state.error.username &&
        this.state.error.username[0] &&
        this.usernameInputRef.current
      ) {
        this.usernameInputRef.current.select();
      } else if (
        this.state.error.email &&
        this.state.error.email[0] &&
        this.emailInputRef.current
      ) {
        this.emailInputRef.current.select();
      } else if (
        this.state.error.password &&
        this.state.password[0] &&
        this.passwordInputRef.current
      ) {
        this.passwordInputRef.current.select();
      } else if (this.usernameInputRef.current) {
        this.usernameInputRef.current.select();
      }
    } else if (this.usernameInputRef.current) {
      this.usernameInputRef.current.select();
    }
  }

  handleUsernameChange = (username: string) => {
    this.setState({ username });
  };

  handleEmailChange = (email: string) => {
    this.setState({ email });
  };

  handlePasswordChange = (password: string) => {
    this.setState({ password });
  };

  cancelSubmit: ?() => void = null;

  handleSubmit = () => {
    if (this.cancelSubmit) {
      this.cancelSubmit();
    }

    this.setState({
      submitting: true,
      error: { type: "none" }
    });

    const [promise, cancel] = makeCancelable(
      api.registerUser({
        username: this.state.username,
        email: this.state.email,
        password: this.state.password
      })
    );

    this.cancelSubmit = cancel;

    promise.then(
      result => {
        this.cancelSubmit = null;

        if (result.isOk) {
          this.props.setCurrentUser(result.user);
          navigate("/");
        } else {
          this.setState(
            {
              submitting: false,
              error: {
                type: "fields",
                ...result.errors
              }
            },
            () => this.focusFirstInvalidInput()
          );
        }
      },
      error => {
        if (!(error instanceof CanceledError)) {
          this.cancelSubmit = null;

          this.setState(
            {
              submitting: false,
              error: { type: "network" }
            },
            () => this.focusFirstInvalidInput()
          );
        }
      }
    );
  };

  componentWillUnmount() {
    if (this.cancelSubmit) {
      this.cancelSubmit();
    }
  }

  render() {
    return (
      <div className={cn("container", "mh-auto")}>
        <div className={cn("mv4", "tc")}>
          <h1 className={cn("f2", "normal", "mb2", "tc", "near-black")}>
            Sign up
          </h1>

          <Link
            className={cn("f6", "link", "green", "underline-hover")}
            to="/login"
          >
            Have an account?
          </Link>
        </div>

        <div className={cn("w-50", "mh-auto")}>
          <Form testId="sign-up-form" onSubmit={this.handleSubmit}>
            <GlobalError>
              {this.state.error.type === "network" ? "An error occurred" : null}
            </GlobalError>

            <TextInput
              id="username"
              testId="sign-up-username"
              inputRef={this.usernameInputRef}
              type="text"
              label="Username"
              value={this.state.username}
              onChange={this.handleUsernameChange}
              disabled={this.state.submitting}
              error={
                this.state.error.type === "fields" && this.state.error.username
                  ? this.state.error.username[0]
                  : undefined
              }
            />

            <TextInput
              id="email"
              testId="sign-up-email"
              inputRef={this.emailInputRef}
              type="text"
              label="Email"
              value={this.state.email}
              onChange={this.handleEmailChange}
              disabled={this.state.submitting}
              error={
                this.state.error.type === "fields" && this.state.error.email
                  ? this.state.error.email[0]
                  : undefined
              }
            />

            <TextInput
              id="password"
              testId="sign-up-password"
              inputRef={this.passwordInputRef}
              type="password"
              label="Password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
              disabled={this.state.submitting}
              error={
                this.state.error.type === "fields" && this.state.error.password
                  ? this.state.error.password[0]
                  : undefined
              }
            />

            <Submit
              text="Sign up"
              disabled={
                this.state.submitting ||
                this.state.username === "" ||
                this.state.email === "" ||
                this.state.password === ""
              }
            />
          </Form>
        </div>
      </div>
    );
  }
}

export default Register;
