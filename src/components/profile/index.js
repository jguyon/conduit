// @flow

import * as React from "react";
import Request from "../request";
import ProfileBanner from "./profile-banner";
import ArticleList from "./article-list";
import NotFound from "../not-found";
import * as api from "../../lib/api";

type ProfileProps = {|
  username: string,
  currentUser: ?api.User
|};

const Profile = (props: ProfileProps) => (
  <Request
    load={() =>
      api.getProfile({
        username: props.username,
        token: props.currentUser ? props.currentUser.token : undefined
      })
    }
  >
    {request => {
      switch (request.status) {
        case "pending":
          return (
            <>
              <ProfileBanner placeholder />
              <ArticleList
                currentUser={props.currentUser}
                username={props.username}
              />
            </>
          );

        case "error":
          return <NotFound />;

        case "success":
          const profile = request.data;

          return (
            <>
              <ProfileBanner
                profile={profile}
                currentUser={props.currentUser}
              />
              <ArticleList
                currentUser={props.currentUser}
                username={props.username}
              />
            </>
          );

        default:
          throw new Error("invalid status");
      }
    }}
  </Request>
);

export default Profile;
