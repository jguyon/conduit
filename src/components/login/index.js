// @flow

import * as React from "react";
import { Link, navigate } from "@reach/router";
import cn from "classnames";
import { Form, GlobalError, TextInput, Submit } from "../form";
import {
  StyledContainer,
  StyledHeader,
  StyledTitle,
  StyledRegisterLink,
  StyledFormContainer
} from "./styles";
import {
  makeCancelable,
  CanceledError,
  noopCancel
} from "../../lib/make-cancelable";
import * as api from "../../lib/api";

type LoginProps = {|
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

  emailInputRef = React.createRef<HTMLInputElement>();

  focusEmailInput() {
    if (this.emailInputRef.current) {
      this.emailInputRef.current.select();
    }
  }

  handleEmailChange = (email: string) => {
    this.setState({ email });
  };

  handlePasswordChange = (password: string) => {
    this.setState({ password });
  };

  cancelSubmit = noopCancel;

  handleSubmit = () => {
    this.cancelSubmit();

    this.setState({
      submitting: true,
      error: null
    });

    const [promise, cancel] = makeCancelable(
      api.loginUser({
        email: this.state.email,
        password: this.state.password
      })
    );

    this.cancelSubmit = cancel;

    promise.then(
      result => {
        if (result.isOk) {
          this.props.setCurrentUser(result.user);
          navigate("/");
        } else {
          this.setState(
            {
              submitting: false,
              error: "credentials"
            },
            () => this.focusEmailInput()
          );
        }
      },
      error => {
        if (!(error instanceof CanceledError)) {
          this.setState(
            {
              submitting: false,
              error: "network"
            },
            () => this.focusEmailInput()
          );
        }
      }
    );
  };

  componentWillUnmount() {
    this.cancelSubmit();
  }

  render() {
    return (
      <StyledContainer>
        <StyledHeader>
          <StyledTitle />
          <StyledRegisterLink path="/register" />
        </StyledHeader>

        <StyledFormContainer>
          <Form testId="sign-in-form" onSubmit={this.handleSubmit}>
            <GlobalError>
              {this.state.error === "credentials"
                ? "Invalid email or password"
                : this.state.error === "network"
                ? "An error occurred"
                : null}
            </GlobalError>

            <TextInput
              id="email"
              testId="sign-in-email"
              inputRef={this.emailInputRef}
              type="text"
              label="Email"
              value={this.state.email}
              onChange={this.handleEmailChange}
              disabled={this.state.submitting}
            />

            <TextInput
              id="password"
              testId="sign-in-password"
              type="password"
              label="Password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
              disabled={this.state.submitting}
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
        </StyledFormContainer>
      </StyledContainer>
    );
  }
}

export default Login;
