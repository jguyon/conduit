// @flow

import * as React from "react";
import { Link } from "@reach/router";
import cn from "classnames";
import PrettyDate from "../PrettyDate";
import * as api from "../api";

const authorProfilePath = (comment: api.Comment) =>
  `/profile/${encodeURIComponent(comment.author.username)}`;

type CommentProps = {|
  currentUser: ?api.User,
  comment: api.Comment,
  onRemoveComment: number => void
|};

const Comment = ({ comment, onRemoveComment, currentUser }: CommentProps) => (
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
          <button
            type="button"
            onClick={() => onRemoveComment(comment.id)}
            className={cn(
              "button-reset",
              "bg-transparent",
              "bn",
              "f5",
              "pv0",
              "ph1",
              "pointer",
              "dark-gray",
              "o-70",
              "glow"
            )}
          >
            &times;
          </button>
        </div>
      )}
    </div>
  </article>
);

export default Comment;
