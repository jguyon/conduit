// @flow

import * as React from "react";
import cn from "classnames";
import { navigate } from "@reach/router";
import Button from "../button";
import {
  makeCancelable,
  CanceledError,
  noopCancel
} from "../../lib/make-cancelable";
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

  cancelClick = noopCancel;

  handleClick = () => {
    const { currentUser, profile } = this.props;

    if (currentUser) {
      this.cancelClick();

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
            this.setState({
              loading: false,
              following: false
            });
          },
          error => {
            if (!(error instanceof CanceledError)) {
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
            this.setState({
              loading: false,
              following: true
            });
          },
          error => {
            if (!(error instanceof CanceledError)) {
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
    this.cancelClick();
  }

  render() {
    const {
      profile: { username }
    } = this.props;
    const { loading, following } = this.state;

    return (
      <Button
        type="button"
        color="light-silver"
        outline={!following}
        onClick={this.handleClick}
        disabled={loading}
        testId="follow-user"
      >
        {following ? "Unfollow" : "Follow"} {username}
      </Button>
    );
  }
}

export const FollowUserPlaceholder = () => (
  <div className={cn("f6", "ba", "b--transparent", "pv1", "ph2")}>&nbsp;</div>
);
