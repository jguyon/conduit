// @flow

import * as React from "react";
import cn from "classnames";
import Banner from "../Banner";
import { FollowUser, FollowUserPlaceholder } from "./FollowUser";
import type { Profile, User } from "../../lib/api";

type ProfileImageProps =
  | {|
      placeholder: true
    |}
  | {|
      placeholder?: false,
      alt: string,
      src: null | string
    |};

const ProfileImage = (props: ProfileImageProps) => (
  <img
    className={cn(
      "br-100",
      "h3",
      "w3",
      "dib",
      "overflow-hidden",
      "shadow-1",
      "mb3"
    )}
    alt={props.placeholder ? "profile" : props.alt}
    src={
      props.placeholder || !props.src
        ? "https://static.productionready.io/images/smiley-cyrus.jpg"
        : props.src
    }
  />
);

type BannerProps =
  | {|
      placeholder: true
    |}
  | {|
      placeholder?: false,
      profile: Profile,
      currentUser: ?User
    |};

const ProfileBanner = (props: BannerProps) => {
  if (props.placeholder) {
    return (
      <Banner bg="near-white" fg="dark-gray" className={cn("tc", "o-20")}>
        <ProfileImage placeholder />

        <div className={cn("f4", "shadow-1", "bg-dark-gray", "w4", "mh-auto")}>
          &nbsp;
        </div>

        <div className={cn("f5", "bg-light-silver", "mv2", "w-20", "mh-auto")}>
          &nbsp;
        </div>

        <FollowUserPlaceholder />
      </Banner>
    );
  } else {
    const { profile, currentUser } = props;

    return (
      <Banner bg="near-white" fg="dark-gray" className={cn("tc")}>
        <ProfileImage alt={profile.username} src={profile.image} />

        <h1 className={cn("f4", "ma0", "text-shadow-1")}>{profile.username}</h1>

        <h2 className={cn("f5", "normal", "light-silver", "mv2")}>
          {profile.bio === null || profile.bio.trim() === ""
            ? "I'm new here, be gentle!"
            : profile.bio}
        </h2>

        {currentUser && currentUser.username === profile.username ? (
          <FollowUserPlaceholder />
        ) : (
          <FollowUser currentUser={currentUser} profile={profile} />
        )}
      </Banner>
    );
  }
};

export default ProfileBanner;
