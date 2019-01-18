// @flow

import * as React from "react";
import {
  StyledBanner,
  StyledBannerAvatar,
  StyledBannerUsername,
  StyledBannerBio
} from "./styles";
import FollowUser from "./follow-user";
import type { Profile, User } from "../../lib/api";

type BannerProps =
  | {|
      placeholder: true
    |}
  | {|
      placeholder?: false,
      profile: Profile,
      currentUser: ?User
    |};

const ProfileBanner = (props: BannerProps) => (
  <StyledBanner>
    {props.placeholder ? (
      <StyledBannerAvatar placeholder />
    ) : (
      <StyledBannerAvatar
        username={props.profile.username}
        image={props.profile.image}
      />
    )}

    {props.placeholder ? (
      <StyledBannerUsername placeholder />
    ) : (
      <StyledBannerUsername username={props.profile.username} />
    )}

    {props.placeholder ? (
      <StyledBannerBio placeholder />
    ) : (
      <StyledBannerBio bio={props.profile.bio} />
    )}

    {props.placeholder ||
    (props.currentUser &&
      props.currentUser.username === props.profile.username) ? (
      <FollowUser placeholder />
    ) : (
      <FollowUser currentUser={props.currentUser} profile={props.profile} />
    )}
  </StyledBanner>
);

export default ProfileBanner;
