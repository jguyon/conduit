// @flow

import * as React from "react";
import cn from "classnames";
import * as api from "../api";

type BannerProps = {|
  profile: api.Profile
|};

const Banner = ({ profile }: BannerProps) => (
  <header className={cn("bg-near-white", "dark-gray", "pa4", "shadow-inset-2")}>
    <div className={cn("container", "mh-auto", "tc")}>
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
        alt={profile.username}
        src={
          profile.image === ""
            ? "https://static.productionready.io/images/smiley-cyrus.jpg"
            : profile.image
        }
      />

      <h1 className={cn("f4", "ma0", "text-shadow-1")}>{profile.username}</h1>

      {profile.bio === null || profile.bio.trim() === "" ? null : (
        <h2 className={cn("f5", "normal", "light-silver", "mt2", "mb0")}>
          {profile.bio}
        </h2>
      )}
    </div>
  </header>
);

export default Banner;
