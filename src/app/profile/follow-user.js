// @flow

import * as React from "react";
import { navigate } from "@reach/router";
import { StyledBannerFollow } from "./styles";
import {
  makeCancelable,
  CanceledError,
  noopCancel
} from "../../lib/make-cancelable";
import * as api from "../../lib/api";

type FollowUserActiveProps = {|
  currentUser: ?api.User,
  profile: api.Profile
|};

type FollowUserActiveState = {|
  loading: boolean,
  following: boolean
|};

class FollowUserActive extends React.Component<
  FollowUserActiveProps,
  FollowUserActiveState
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
      <StyledBannerFollow
        following={following}
        loading={loading}
        username={username}
        testId="follow-user"
        onClick={this.handleClick}
      />
    );
  }
}

type FollowUserProps =
  | {|
      placeholder: true
    |}
  | {|
      placeholder?: false,
      currentUser: ?api.User,
      profile: api.Profile
    |};

const FollowUser = (props: FollowUserProps) => {
  if (props.placeholder) {
    return <StyledBannerFollow placeholder />;
  } else {
    return (
      <FollowUserActive
        currentUser={props.currentUser}
        profile={props.profile}
      />
    );
  }
};

export default FollowUser;
