// @flow

import * as React from "react";
import Request from "../request";
import {
  StyledContainer,
  StyledLoadingError,
  StyledLinks
} from "./comment-styles";
import Comment from "./comment";
import CommentForm from "./comment-form";
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
              return <StyledLoadingError />;

            case "success":
              const comments = request.data;
              const { addedComments, removedComments } = this.state;

              return (
                <StyledContainer>
                  {this.props.currentUser ? (
                    <CommentForm
                      currentUser={this.props.currentUser}
                      slug={this.props.slug}
                      onAddComment={this.handleAddComment}
                    />
                  ) : (
                    <StyledLinks loginPath="/login" registerPath="/register" />
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
                </StyledContainer>
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
