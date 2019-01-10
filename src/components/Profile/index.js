// @flow

import * as React from "react";
import Request from "../Request";
import Banner from "./Banner";
import ArticleList from "./ArticleList";
import NotFound from "../NotFound";
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
              <Banner placeholder />
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
              <Banner profile={profile} currentUser={props.currentUser} />
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
