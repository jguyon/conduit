// @flow

import * as React from "react";
import { navigate } from "@reach/router";
import Button from "../button";
import { makeCancelable, CanceledError } from "../../lib/make-cancelable";
import * as api from "../../lib/api";

type FollowUserProps = {|
  currentUser: ?api.User,
  user: api.Profile,
  onFollowUser: () => void,
  onUnfollowUser: () => void,
  className?: string
|};

type FollowUserState = {|
  loading: boolean
|};

class FollowUser extends React.Component<FollowUserProps, FollowUserState> {
  state = {
    loading: false
  };

  cancelClick: ?() => void = null;

  handleClick = () => {
    const { currentUser, user } = this.props;

    if (currentUser) {
      if (this.cancelClick) {
        this.cancelClick();
      }

      this.setState({ loading: true });

      if (user.following) {
        const [promise, cancel] = makeCancelable(
          api.unfollowUser({
            token: currentUser.token,
            username: user.username
          })
        );

        this.cancelClick = cancel;

        promise.then(
          () => {
            this.cancelClick = null;
            this.setState({ loading: false });
            this.props.onUnfollowUser();
          },
          error => {
            if (!(error instanceof CanceledError)) {
              this.cancelClick = null;
              this.setState({ loading: false });
            }
          }
        );
      } else {
        const [promise, cancel] = makeCancelable(
          api.followUser({
            token: currentUser.token,
            username: user.username
          })
        );

        this.cancelClick = cancel;

        promise.then(
          () => {
            this.cancelClick = null;
            this.setState({ loading: false });
            this.props.onFollowUser();
          },
          error => {
            if (!(error instanceof CanceledError)) {
              this.cancelClick = null;
              this.setState({ loading: false });
            }
          }
        );
      }
    } else {
      navigate("/login");
    }
  };

  componentWillUnmount() {
    if (this.cancelClick) {
      this.cancelClick();
    }
  }

  render() {
    const {
      className,
      user: { username, following }
    } = this.props;
    const { loading } = this.state;

    return (
      <Button
        type="button"
        color="light-silver"
        onClick={this.handleClick}
        disabled={loading}
        outline={!following}
        testId="follow-user"
        className={className}
      >
        {following ? "Unfollow" : "Follow"} {username}
      </Button>
    );
  }
}

export default FollowUser;
