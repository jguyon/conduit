// @flow

import * as React from "react";
import * as api from "./api";

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
  getCurrentUser: typeof api.getCurrentUser,
  getToken: () => ?string,
  setToken: string => void,
  removeToken: () => void,
  children: CurrentUserData => React.Node
|};

type CurrentUserState = {|
  data: CurrentUserData
|};

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
            this.props.setToken(data.currentUser.token);
          } else {
            this.props.removeToken();
          }
        }
      }
    );
  };

  componentDidMount() {
    const token = this.props.getToken();

    if (token) {
      this.props.getCurrentUser(token).then(
        ({ user }) => {
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
