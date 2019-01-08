// @flow

import * as React from "react";
import { Link } from "@reach/router";
import cn from "classnames";
import PrettyDate from "../PrettyDate";
import RemoveComment from "./RemoveComment";
import * as api from "../api";

const authorProfilePath = (comment: api.Comment) =>
  `/profile/${encodeURIComponent(comment.author.username)}`;

type CommentProps = {|
  currentUser: ?api.User,
  slug: string,
  comment: api.Comment,
  onRemoveComment: number => void
|};

class Comment extends React.PureComponent<CommentProps> {
  render() {
    const { comment, slug, onRemoveComment, currentUser } = this.props;

    return (
      <article className={cn("light-gray", "mv2", "ba", "br1")}>
        <div className={cn("bb", "pa3")}>
          <span className={cn("dark-gray")}>{comment.body}</span>
        </div>

        <div
          className={cn(
            "bg-near-white",
            "ph3",
            "pv2",
            "f6",
            "flex",
            "items-center"
          )}
        >
          <Link
            className={cn("mr2", "flex", "items-center")}
            to={authorProfilePath(comment)}
          >
            <img
              className={cn("br-100", "h1", "w1", "dib", "overflow-hidden")}
              alt={comment.author.username}
              src={
                comment.author.image
                  ? comment.author.image
                  : "https://static.productionready.io/images/smiley-cyrus.jpg"
              }
            />
          </Link>

          <Link
            className={cn("mr2", "link", "green", "underline-hover")}
            to={authorProfilePath(comment)}
          >
            {comment.author.username}
          </Link>

          <PrettyDate
            className={cn("moon-gray")}
            pubdate="pubdate"
            date={new Date(comment.createdAt)}
          />

          {currentUser && currentUser.username === comment.author.username && (
            <div className={cn("flex-auto", "tr")}>
              <RemoveComment
                currentUser={currentUser}
                slug={slug}
                comment={comment}
                onRemoveComment={onRemoveComment}
              />
            </div>
          )}
        </div>
      </article>
    );
  }
}

export default Comment;
