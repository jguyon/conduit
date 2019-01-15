// @flow

import * as React from "react";
import cn from "classnames";
import Banner from "../banner";
import Avatar from "../avatar";
import PlaceholderText from "../placeholder-text";
import { FollowUser, FollowUserPlaceholder } from "./follow-user";
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
  <Banner bg="near-white" fg="dark-gray" className={cn("tc")}>
    {props.placeholder ? (
      <Avatar placeholder size={3} className={cn("shadow-1", "mb3")} />
    ) : (
      <Avatar
        size={3}
        className={cn("shadow-1", "mb3")}
        username={props.profile.username}
        image={props.profile.image}
      />
    )}

    <h1 className={cn("f4", "ma0", "text-shadow-1")}>
      {props.placeholder ? (
        <PlaceholderText className={cn("w4")} />
      ) : (
        props.profile.username
      )}
    </h1>

    <h2 className={cn("f5", "normal", "light-silver", "mv2")}>
      {props.placeholder ? (
        <PlaceholderText className={cn("w5")} />
      ) : (
        props.profile.bio || "I'm new here, be gentle!"
      )}
    </h2>

    {props.placeholder ||
    (props.currentUser &&
      props.currentUser.username === props.profile.username) ? (
      <FollowUserPlaceholder />
    ) : (
      <FollowUser currentUser={props.currentUser} profile={props.profile} />
    )}
  </Banner>
);

export default ProfileBanner;
