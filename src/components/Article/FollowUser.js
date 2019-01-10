// @flow

import * as React from "react";
import cn from "classnames";
import { navigate } from "@reach/router";
import { makeCancelable, CanceledError } from "../../lib/makeCancelable";
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
      <button
        type="button"
        onClick={this.handleClick}
        disabled={loading}
        data-testid="follow-user"
        className={cn(
          className,
          "f6",
          "button-reset",
          following
            ? ["bg-light-silver", "b--light-silver", "white"]
            : ["bg-transparent", "b--light-silver", "light-silver"],
          "ba",
          "br2",
          "pv1",
          "ph2",
          loading ? "o-20" : ["pointer", "dim"]
        )}
      >
        {following ? "Unfollow" : "Follow"} {username}
      </button>
    );
  }
}

export default FollowUser;
