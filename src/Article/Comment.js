// @flow

import * as React from "react";
import { Link } from "@reach/router";
import cn from "classnames";
import PrettyDate from "../PrettyDate";
import type { Comment as CommentObj } from "../api";

const authorProfilePath = (comment: CommentObj) =>
  `/profile/${encodeURIComponent(comment.author.username)}`;

type CommentProps = {|
  comment: CommentObj
|};

const Comment = ({ comment }: CommentProps) => (
  <article className={cn("light-gray", "mv2", "ba", "br1")}>
    <div className={cn("bb", "pa3")}>
      <span className={cn("dark-gray")}>{comment.body}</span>
    </div>

    <div className={cn("bg-near-white", "ph3", "pv2", "f6", "flex")}>
      <Link className={cn("mr2")} to={authorProfilePath(comment)}>
        <img
          className={cn("br-100", "h1", "w1", "dib", "overflow-hidden")}
          alt={comment.author.username}
          src={
            comment.author.image === ""
              ? "https://static.productionready.io/images/smiley-cyrus.jpg"
              : comment.author.image
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
    </div>
  </article>
);

export default Comment;
