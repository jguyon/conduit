// @flow

import * as React from "react";
import Request from "../request";
import { FullArticle, FullArticlePlaceholder } from "./full-article";
import CommentList from "./comment-list";
import NotFound from "../not-found";
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
                <FullArticlePlaceholder />
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
