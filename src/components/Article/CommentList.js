// @flow

import * as React from "react";
import { Link } from "@reach/router";
import cn from "classnames";
import Request from "../Request";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import * as api from "../../lib/api";

type CommentListProps = {|
  hidden?: boolean,
  currentUser: ?api.User,
  slug: string
|};

type CommentListState = {|
  addedComments: api.Comment[],
  removedComments: number[]
|};

class CommentList extends React.Component<CommentListProps, CommentListState> {
  state = {
    addedComments: [],
    removedComments: []
  };

  loadComments = () => api.listComments({ slug: this.props.slug });

  handleAddComment = (comment: api.Comment) => {
    this.setState(({ addedComments }) => ({
      addedComments: [comment, ...addedComments]
    }));
  };

  handleRemoveComment = (commentId: number) => {
    this.setState(({ removedComments }) => ({
      removedComments: [...removedComments, commentId]
    }));
  };

  render() {
    return (
      <Request load={this.loadComments}>
        {request => {
          if (this.props.hidden) {
            return null;
          }

          switch (request.status) {
            case "pending":
              return null;

            case "error":
              return (
                <div className={cn("tc", "red", "mv5")}>
                  Error loading comments!
                </div>
              );

            case "success":
              const comments = request.data;
              const { addedComments, removedComments } = this.state;

              return (
                <div className={cn("container", "mv5", "mh-auto")}>
                  <div className={cn("w-60", "mh-auto")}>
                    {this.props.currentUser ? (
                      <CommentForm
                        currentUser={this.props.currentUser}
                        slug={this.props.slug}
                        onAddComment={this.handleAddComment}
                      />
                    ) : (
                      <div className={cn("tc", "light-silver")}>
                        <Link
                          to="/login"
                          className={cn("link", "green", "underline-hover")}
                        >
                          Sign in
                        </Link>{" "}
                        or{" "}
                        <Link
                          to="/register"
                          className={cn("link", "green", "underline-hover")}
                        >
                          sign up
                        </Link>{" "}
                        to add comments on this article
                      </div>
                    )}

                    {[...addedComments, ...comments]
                      .filter(({ id }) => !removedComments.includes(id))
                      .map(comment => (
                        <Comment
                          key={comment.id}
                          currentUser={this.props.currentUser}
                          slug={this.props.slug}
                          comment={comment}
                          onRemoveComment={this.handleRemoveComment}
                        />
                      ))}
                  </div>
                </div>
              );

            default:
              throw new Error("invalid status");
          }
        }}
      </Request>
    );
  }
}

export default CommentList;
