// @flow

import * as React from "react";
import { StyledContainer, StyledLinks } from "./comment-styles";
import Comment from "./comment";
import CommentForm from "./comment-form";
import * as api from "../../lib/api";

type CommentListProps = {|
  slug: string,
  currentUser: ?api.User,
  comments: api.Comment[]
|};

type CommentListState = {|
  comments: api.Comment[]
|};

class CommentList extends React.Component<CommentListProps, CommentListState> {
  state = {
    comments: this.props.comments
  };

  handleAddComment = (comment: api.Comment) => {
    this.setState(({ comments }) => ({
      comments: [comment, ...comments]
    }));
  };

  handleRemoveComment = (commentId: number) => {
    this.setState(({ comments }) => ({
      comments: comments.filter(({ id }) => id !== commentId)
    }));
  };

  render() {
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

        {this.state.comments.map(comment => (
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
  }
}

export default CommentList;
