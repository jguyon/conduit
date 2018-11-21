// @flow

import * as React from "react";
import * as api from "./api";

export type CurrentUserObject = {|
  currentUser: ?api.User,
  setCurrentUser: (?api.User) => void
|};

type CurrentUserProps = {|
  getCurrentUser: typeof api.getCurrentUser,
  getToken: () => ?string,
  setToken: string => void,
  removeToken: () => void,
  children: CurrentUserObject => React.Node
|};

type CurrentUserState = {|
  currentUser: ?api.User
|};

class CurrentUser extends React.Component<CurrentUserProps, CurrentUserState> {
  state = {
    currentUser: null
  };

  componentDidMount() {
    const token = this.props.getToken();

    if (token) {
      this.props.getCurrentUser(token).then(
        ({ user }) => {
          this.setState({ currentUser: user });
        },
        () => {}
      );
    }
  }

  setCurrentUser = (user: ?api.User) => {
    this.setState({ currentUser: user }, () => {
      if (user) {
        this.props.setToken(user.token);
      } else {
        this.props.removeToken();
      }
    });
  };

  render() {
    return this.props.children({
      currentUser: this.state.currentUser,
      setCurrentUser: this.setCurrentUser
    });
  }
}

export default CurrentUser;
