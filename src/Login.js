// @flow

import * as React from "react";
import { Link, navigate } from "@reach/router";
import cn from "classnames";
import { Form, GlobalError, TextInput, Submit } from "./Form";
import * as api from "./api";

type LoginProps = {|
  loginUser: typeof api.loginUser,
  setCurrentUser: api.User => void
|};

type LoginState = {|
  submitting: boolean,
  error: null | "credentials" | "network",
  email: string,
  password: string
|};

class Login extends React.Component<LoginProps, LoginState> {
  state = {
    submitting: false,
    error: null,
    email: "",
    password: ""
  };

  handleEmailChange = (email: string) => {
    this.setState({ email });
  };

  handlePasswordChange = (password: string) => {
    this.setState({ password });
  };

  handleSubmit = () => {
    this.setState({
      submitting: true,
      error: null
    });

    this.props
      .loginUser({
        email: this.state.email,
        password: this.state.password
      })
      .then(
        result => {
          if (result.isOk) {
            this.props.setCurrentUser(result.user);
            navigate("/");
          } else {
            this.setState({
              submitting: false,
              error: "credentials"
            });
          }
        },
        () => {
          this.setState({
            submitting: false,
            error: "network"
          });
        }
      );
  };

  render() {
    return (
      <div className={cn("container", "mh-auto")}>
        <div className={cn("mv4", "tc")}>
          <h1 className={cn("f2", "normal", "mb2", "tc", "near-black")}>
            Sign in
          </h1>

          <Link
            className={cn("f6", "link", "green", "underline-hover")}
            to="/register"
          >
            Need an account?
          </Link>
        </div>

        <div className={cn("w-50", "mh-auto")}>
          <Form testId="sign-in-form" onSubmit={this.handleSubmit}>
            {this.state.error ? (
              <GlobalError>
                {this.state.error === "credentials"
                  ? "Invalid email or password"
                  : "An error occured"}
              </GlobalError>
            ) : null}

            <TextInput
              id="email"
              testId="sign-in-email"
              type="text"
              label="Email"
              value={this.state.email}
              onChange={this.handleEmailChange}
            />

            <TextInput
              id="password"
              testId="sign-in-password"
              type="password"
              label="Password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
            />

            <Submit
              text="Sign in"
              disabled={
                this.state.submitting ||
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

export default Login;
