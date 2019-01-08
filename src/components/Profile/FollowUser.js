// @flow

import * as React from "react";
import cn from "classnames";
import { navigate } from "@reach/router";
import { makeCancelable, CanceledError } from "../../lib/makeCancelable";
import * as api from "../../lib/api";

type FollowUserProps = {|
  currentUser: ?api.User,
  profile: api.Profile
|};

type FollowUserState = {|
  loading: boolean,
  following: boolean
|};

export class FollowUser extends React.Component<
  FollowUserProps,
  FollowUserState
> {
  state = {
    loading: false,
    following: this.props.profile.following
  };

  cancelClick: ?() => void = null;

  handleClick = () => {
    const { currentUser, profile } = this.props;

    if (currentUser) {
      if (this.cancelClick) {
        this.cancelClick();
      }

      this.setState({ loading: true });

      if (this.state.following) {
        const [promise, cancel] = makeCancelable(
          api.unfollowUser({
            username: profile.username,
            token: currentUser.token
          })
        );

        this.cancelClick = cancel;

        promise.then(
          () => {
            this.cancelClick = null;

            this.setState({
              loading: false,
              following: false
            });
          },
          error => {
            if (!(error instanceof CanceledError)) {
              this.cancelClick = null;

              this.setState({
                loading: false
              });
            }
          }
        );
      } else {
        const [promise, cancel] = makeCancelable(
          api.followUser({
            username: profile.username,
            token: currentUser.token
          })
        );

        this.cancelClick = cancel;

        promise.then(
          () => {
            this.cancelClick = null;

            this.setState({
              loading: false,
              following: true
            });
          },
          error => {
            if (!(error instanceof CanceledError)) {
              this.cancelClick = null;

              this.setState({
                loading: false
              });
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
      profile: { username }
    } = this.props;
    const { loading, following } = this.state;

    return (
      <button
        type="button"
        onClick={this.handleClick}
        disabled={loading}
        data-testid="follow-user"
        className={cn(
          "f6",
          "button-reset",
          "bg-white",
          "gray",
          "ba",
          "br2",
          "pv1",
          "ph2",
          loading ? "o-20" : ["pointer", "dim"]
        )}
      >
        {following ? `Unfollow ${username}` : `Follow ${username}`}
      </button>
    );
  }
}

export const FollowUserPlaceholder = () => (
  <div className={cn("f6", "ba", "b--transparent", "pv1", "ph2")}>&nbsp;</div>
);
