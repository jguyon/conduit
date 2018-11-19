// @flow

import * as React from "react";
import cn from "classnames";
import Request from "../Request";
import type { RequestData } from "../Request";
import FullArticle from "./FullArticle";
import Comment from "./Comment";
import NotFound from "../NotFound";
import * as api from "../api";

type CommentListProps = {|
  request: RequestData<api.ListComments>
|};

const CommentList = ({ request }: CommentListProps) => {
  switch (request.status) {
    case "pending":
      return null;

    case "error":
      return (
        <div className={cn("tc", "red", "mv5")}>Error loading comments!</div>
      );

    case "success":
      const { comments } = request.data;

      return (
        <div className={cn("container", "mv5", "mh-auto")}>
          <div className={cn("w-60", "mh-auto")}>
            {comments.map(comment => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      );

    default:
      throw new Error("invalid status");
  }
};

type ArticleProps = {|
  slug: string,
  getArticle: typeof api.getArticle,
  listComments: typeof api.listComments
|};

const Article = (props: ArticleProps) => {
  const loadArticle = () => props.getArticle(props.slug);
  const loadComments = () => props.listComments(props.slug);

  return (
    <Request load={loadArticle}>
      {requestArticle => (
        <Request load={loadComments}>
          {requestComments => {
            switch (requestArticle.status) {
              case "pending":
                return <FullArticle placeholder />;

              case "error":
                return <NotFound />;

              case "success":
                const { article } = requestArticle.data;

                return (
                  <>
                    <FullArticle article={article} />
                    <CommentList request={requestComments} />
                  </>
                );

              default:
                throw new Error("invalid status");
            }
          }}
        </Request>
      )}
    </Request>
  );
};

export default Article;
