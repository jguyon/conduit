// @flow

import * as React from "react";
import { navigate } from "@reach/router";
import cn from "classnames";
import { Form, GlobalError, TextInput, TextArea, Submit } from "../form";
import Separator from "../separator";
import Button from "../button";
import {
  makeCancelable,
  CanceledError,
  noopCancel
} from "../../lib/make-cancelable";
import * as api from "../../lib/api";

type SettingsProps = {|
  currentUser: api.User,
  setCurrentUser: api.User => void,
  unsetCurrentUser: () => void
|};

type SettingsState = {|
  submitting: boolean,
  error:
    | {| type: "none" |}
    | {| type: "network" |}
    | {|
        type: "fields",
        username?: string[],
        email?: string[],
        password?: string[],
        image?: string[],
        bio?: string[]
      |},
  username: string,
  email: string,
  password: string,
  image: string,
  bio: string
|};

class Settings extends React.Component<SettingsProps, SettingsState> {
  state = {
    submitting: false,
    error: { type: "none" },
    username: this.props.currentUser.username,
    email: this.props.currentUser.email,
    password: "",
    image: this.props.currentUser.image ? this.props.currentUser.image : "",
    bio: this.props.currentUser.bio ? this.props.currentUser.bio : ""
  };

  imageInputRef = React.createRef<HTMLInputElement>();
  usernameInputRef = React.createRef<HTMLInputElement>();
  bioInputRef = React.createRef<HTMLTextAreaElement>();
  emailInputRef = React.createRef<HTMLInputElement>();
  passwordInputRef = React.createRef<HTMLInputElement>();

  focusFirstInvalidInput() {
    if (this.state.error.type === "fields") {
      if (
        this.state.error.image &&
        this.state.error.image[0] &&
        this.imageInputRef.current
      ) {
        this.imageInputRef.current.select();
      } else if (
        this.state.error.username &&
        this.state.error.username[0] &&
        this.usernameInputRef.current
      ) {
        this.usernameInputRef.current.select();
      } else if (
        this.state.error.bio &&
        this.state.error.bio[0] &&
        this.bioInputRef.current
      ) {
        this.bioInputRef.current.select();
      } else if (
        this.state.error.email &&
        this.state.error.email[0] &&
        this.emailInputRef.current
      ) {
        this.emailInputRef.current.select();
      } else if (
        this.state.error.password &&
        this.state.error.password[0] &&
        this.passwordInputRef.current
      ) {
        this.passwordInputRef.current.select();
      } else if (this.imageInputRef.current) {
        this.imageInputRef.current.select();
      }
    } else if (this.imageInputRef.current) {
      this.imageInputRef.current.select();
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

  handleImageChange = (image: string) => {
    this.setState({ image });
  };

  handleBioChange = (bio: string) => {
    this.setState({ bio });
  };

  cancelSubmit = noopCancel;

  handleSubmit = () => {
    this.cancelSubmit();

    this.setState({
      submitting: true,
      error: { type: "none" }
    });

    const [promise, cancel] = makeCancelable(
      api.updateCurrentUser({
        token: this.props.currentUser.token,
        username: this.state.username,
        email: this.state.email,
        password: this.state.password ? this.state.password : undefined,
        image: this.state.image ? this.state.image : null,
        bio: this.state.bio ? this.state.bio : null
      })
    );

    this.cancelSubmit = cancel;

    promise.then(
      result => {
        if (result.isOk) {
          this.props.setCurrentUser(result.user);
          navigate(`/profile/${encodeURIComponent(result.user.username)}`);
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

  handleLogOutClick = () => {
    this.props.unsetCurrentUser();
    navigate("/");
  };

  componentWillUnmount() {
    this.cancelSubmit();
  }

  render() {
    return (
      <div className={cn("container", "mh-auto")}>
        <h1 className={cn("f2", "normal", "near-black", "tc", "mv4")}>
          Your Settings
        </h1>

        <div className={cn("w-50", "mh-auto")}>
          <Form testId="settings-form" onSubmit={this.handleSubmit}>
            <GlobalError>
              {this.state.error.type === "network" ? "An error occurred" : null}
            </GlobalError>

            <TextInput
              id="image"
              testId="settings-image"
              inputRef={this.imageInputRef}
              type="text"
              label="URL of profile picture"
              value={this.state.image}
              onChange={this.handleImageChange}
              disabled={this.state.submitting}
              error={
                this.state.error.type === "fields" && this.state.error.image
                  ? this.state.error.image[0]
                  : undefined
              }
            />

            <TextInput
              id="username"
              testId="settings-username"
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

            <TextArea
              id="bio"
              testId="settings-bio"
              textAreaRef={this.bioInputRef}
              label="Short bio about you"
              value={this.state.bio}
              onChange={this.handleBioChange}
              disabled={this.state.submitting}
              error={
                this.state.error.type === "fields" && this.state.error.bio
                  ? this.state.error.bio[0]
                  : undefined
              }
            />

            <TextInput
              id="email"
              testId="settings-email"
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
              testId="settings-password"
              inputRef={this.passwordInputRef}
              type="password"
              label="New password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
              disabled={this.state.submitting}
              error={
                this.state.error.type === "fields" && this.state.error.password
                  ? this.state.error.password[0]
                  : undefined
              }
            />

            <Submit text="Update Settings" disabled={this.state.submitting} />
          </Form>

          <Separator className={cn("mv4")} />

          <Button
            type="button"
            color="red"
            outline
            big
            onClick={this.handleLogOutClick}
            testId="settings-log-out"
          >
            Or click here to log out
          </Button>
        </div>
      </div>
    );
  }
}

export default Settings;
