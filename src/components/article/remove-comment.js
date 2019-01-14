// @flow

import * as React from "react";
import cn from "classnames";
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

    return (
      <button
        type="button"
        data-testid={`remove-comment-${comment.id}`}
        onClick={this.handleClick}
        disabled={this.state.removing}
        className={cn(
          "button-reset",
          "bg-transparent",
          "dark-gray",
          "bn",
          "f5",
          "pv0",
          "ph1",
          this.state.removing ? "o-40" : ["o-70", "pointer", "glow"]
        )}
      >
        &times;
      </button>
    );
  }
}

export default RemoveComment;
