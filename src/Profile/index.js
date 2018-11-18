// @flow

import * as React from "react";
import cn from "classnames";
import Request from "../Request";
import Banner from "./Banner";
import NotFound from "../NotFound";
import * as api from "../api";

type ProfileProps = {|
  username: string,
  getProfile: typeof api.getProfile
|};

const Profile = (props: ProfileProps) => (
  <Request load={() => props.getProfile(props.username)}>
    {request => {
      switch (request.status) {
        case "pending":
          return (
            <div className={cn("tc", "moon-gray", "mv5")}>
              Loading profile...
            </div>
          );

        case "error":
          return <NotFound />;

        case "success":
          const { profile } = request.data;
          return <Banner profile={profile} />;

        default:
          throw new Error("invalid status");
      }
    }}
  </Request>
);

export default Profile;
