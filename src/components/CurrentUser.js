// @flow

import * as React from "react";
import { makeCancelable, CanceledError } from "../lib/makeCancelable";
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

  cancelGetCurrentUser: ?() => void = null;

  componentDidMount() {
    const token = localStorage.getItem(USER_TOKEN_KEY);

    if (token) {
      const [promise, cancel] = makeCancelable(api.getCurrentUser({ token }));

      this.cancelGetCurrentUser = cancel;

      promise.then(
        user => {
          this.cancelGetCurrentUser = null;

          this.setState({
            data: {
              status: "ready",
              currentUser: user,
              setCurrentUser: this.setCurrentUser
            }
          });
        },
        error => {
          if (!(error instanceof CanceledError)) {
            this.cancelGetCurrentUser = null;

            this.setState({
              data: {
                status: "ready",
                currentUser: null,
                setCurrentUser: this.setCurrentUser
              }
            });
          }
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

  componentWillUnmount() {
    if (this.cancelGetCurrentUser) {
      this.cancelGetCurrentUser();
    }
  }

  render() {
    return this.props.children(this.state.data);
  }
}

export default CurrentUser;
