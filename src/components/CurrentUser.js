// @flow

import * as React from "react";
import * as api from "../lib/api";

export type CurrentUserData =
  | {|
      status: "pending"
    |}
  | {|
      status: "ready",
      currentUser: ?api.User,
      setCurrentUser: (?api.User) => void
    |};

type CurrentUserProps = {|
  children: CurrentUserData => React.Node
|};

type CurrentUserState = {|
  data: CurrentUserData
|};

const USER_TOKEN_KEY = "userToken";

class CurrentUser extends React.Component<CurrentUserProps, CurrentUserState> {
  state = {
    data: { status: "pending" }
  };

  setCurrentUser = (user: ?api.User) => {
    this.setState(
      ({ data }) =>
        data.status === "ready"
          ? { data: { ...data, currentUser: user } }
          : undefined,
      () => {
        const { data } = this.state;

        if (data.status === "ready") {
          if (data.currentUser) {
            localStorage.setItem(USER_TOKEN_KEY, data.currentUser.token);
          } else {
            localStorage.removeItem(USER_TOKEN_KEY);
          }
        }
      }
    );
  };

  componentDidMount() {
    const token = localStorage.getItem(USER_TOKEN_KEY);

    if (token) {
      api.getCurrentUser({ token }).then(
        user => {
          this.setState({
            data: {
              status: "ready",
              currentUser: user,
              setCurrentUser: this.setCurrentUser
            }
          });
        },
        () => {
          this.setState({
            data: {
              status: "ready",
              currentUser: null,
              setCurrentUser: this.setCurrentUser
            }
          });
        }
      );
    } else {
      this.setState({
        data: {
          status: "ready",
          currentUser: null,
          setCurrentUser: this.setCurrentUser
        }
      });
    }
  }

  render() {
    return this.props.children(this.state.data);
  }
}

export default CurrentUser;
