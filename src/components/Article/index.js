// @flow

import * as React from "react";
import Request from "../Request";
import FullArticle from "./FullArticle";
import CommentList from "./CommentList";
import NotFound from "../NotFound";
import * as api from "../../lib/api";

type ArticleProps = {|
  slug: string,
  currentUser: ?api.User
|};

const Article = (props: ArticleProps) => {
  const loadArticle = () =>
    api.getArticle({
      token: props.currentUser ? props.currentUser.token : undefined,
      slug: props.slug
    });

  return (
    <Request load={loadArticle}>
      {request => {
        switch (request.status) {
          case "pending":
            return (
              <>
                <FullArticle placeholder />
                <CommentList
                  hidden
                  currentUser={props.currentUser}
                  slug={props.slug}
                />
              </>
            );

          case "error":
            return <NotFound />;

          case "success":
            const article = request.data;

            return (
              <>
                <FullArticle
                  article={article}
                  currentUser={props.currentUser}
                />
                <CommentList
                  currentUser={props.currentUser}
                  slug={props.slug}
                />
              </>
            );

          default:
            throw new Error("invalid status");
        }
      }}
    </Request>
  );
};

export default Article;
