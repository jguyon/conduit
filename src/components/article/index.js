// @flow

import * as React from "react";
import Request from "../request";
import FullArticle from "./full-article";
import CommentList from "./comment-list";
import { StyledLoadingError } from "./comment-styles.js";
import NotFound from "../not-found";
import * as api from "../../lib/api";

type ArticleProps = {|
  slug: string,
  currentUser: ?api.User
|};

const Article = (props: ArticleProps) => (
  <Request
    load={() =>
      api.getArticle({
        token: props.currentUser ? props.currentUser.token : undefined,
        slug: props.slug
      })
    }
  >
    {articleRequest => (
      <Request
        load={() =>
          api.listComments({
            token: props.currentUser ? props.currentUser.token : undefined,
            slug: props.slug
          })
        }
      >
        {commentsRequest => {
          switch (articleRequest.status) {
            case "pending":
              return (
                <>
                  <FullArticle placeholder />
                </>
              );

            case "error":
              return <NotFound />;

            case "success":
              const fullArticle = (
                <FullArticle
                  article={articleRequest.data}
                  currentUser={props.currentUser}
                />
              );

              switch (commentsRequest.status) {
                case "pending":
                  return <>{fullArticle}</>;

                case "error":
                  return (
                    <>
                      {fullArticle}
                      <StyledLoadingError />
                    </>
                  );

                case "success":
                  return (
                    <>
                      {fullArticle}
                      <CommentList
                        slug={props.slug}
                        currentUser={props.currentUser}
                        comments={commentsRequest.data}
                      />
                    </>
                  );

                default:
                  throw new Error("invalid status");
              }

            default:
              throw new Error("invalid status");
          }
        }}
      </Request>
    )}
  </Request>
);

export default Article;
