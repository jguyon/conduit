// @flow

import * as React from "react";
import { StyledCommentRemove } from "./comment-styles";
import {
  makeCancelable,
  CanceledError,
  noopCancel
} from "../../lib/make-cancelable";
import * as api from "../../lib/api";

type RemoveCommentProps = {|
  currentUser: api.User,
  slug: string,
  comment: api.Comment,
  onRemoveComment: number => void
|};

type RemoveCommentState = {|
  removing: boolean
|};

class RemoveComment extends React.Component<
  RemoveCommentProps,
  RemoveCommentState
> {
  state = {
    removing: false
  };

  cancelClick = noopCancel;

  handleClick = () => {
    this.cancelClick();

    this.setState({ removing: true });

    const [promise, cancel] = makeCancelable(
      api.deleteComment({
        token: this.props.currentUser.token,
        slug: this.props.slug,
        commentId: this.props.comment.id
      })
    );

    this.cancelClick = cancel;

    promise.then(
      () => {
        this.props.onRemoveComment(this.props.comment.id);
      },
      error => {
        if (!(error instanceof CanceledError)) {
          this.setState({ removing: false });
        }
      }
    );
  };

  componentWillUnmount() {
    this.cancelClick();
  }

  render() {
    const { comment } = this.props;
    const { removing } = this.state;

    return (
      <StyledCommentRemove
        loading={removing}
        testId={`remove-comment-${comment.id}`}
        onClick={this.handleClick}
      />
    );
  }
}

export default RemoveComment;
