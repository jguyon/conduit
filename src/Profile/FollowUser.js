// @flow

import * as React from "react";
import cn from "classnames";
import { navigate } from "@reach/router";
import * as api from "../api";

type FollowUserProps = {|
  currentUser: ?api.User,
  profile: api.Profile
|};

type FollowUserState = {|
  loading: boolean,
  following: boolean
|};

class FollowUser extends React.Component<FollowUserProps, FollowUserState> {
  state = {
    loading: false,
    following: this.props.profile.following
  };

  handleClick = () => {
    const { currentUser, profile } = this.props;

    if (currentUser) {
      if (!this.state.loading) {
        this.setState({ loading: true });

        if (this.state.following) {
          api
            .unfollowUser({
              username: profile.username,
              token: currentUser.token
            })
            .then(
              () =>
                this.setState({
                  loading: false,
                  following: false
                }),
              () => this.setState({ loading: false })
            );
        } else {
          api
            .followUser({
              username: profile.username,
              token: currentUser.token
            })
            .then(
              () =>
                this.setState({
                  loading: false,
                  following: true
                }),
              () => this.setState({ loading: false })
            );
        }
      }
    } else {
      navigate("/login");
    }
  };

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

export default FollowUser;

export const FollowUserPlaceholder = () => (
  <div className={cn("f6", "ba", "b--transparent", "pv1", "ph2")}>&nbsp;</div>
);
