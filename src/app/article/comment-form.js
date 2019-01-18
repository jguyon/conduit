// @flow

import * as React from "react";
import {
  StyledComment,
  StyledCommentTextArea,
  StyledCommentBottom,
  StyledCommentAvatar,
  StyledCommentPost,
  StyledCommentError
} from "./comment-styles";
import {
  makeCancelable,
  CanceledError,
  noopCancel
} from "../../lib/make-cancelable";
import * as api from "../../lib/api";

type CommentFormProps = {|
  currentUser: api.User,
  slug: string,
  onAddComment: api.Comment => void
|};

type CommentFormState = {|
  submitting: boolean,
  error:
    | {| type: "none" |}
    | {| type: "network" |}
    | {|
        type: "fields",
        body?: string[]
      |},
  body: string
|};

class CommentForm extends React.PureComponent<
  CommentFormProps,
  CommentFormState
> {
  state = {
    submitting: false,
    error: { type: "none" },
    body: ""
  };

  bodyInputRef = React.createRef<HTMLTextAreaElement>();

  focusFirstInvalidInput() {
    if (this.state.error.type === "fields") {
      if (
        this.state.error.body &&
        this.state.error.body[0] &&
        this.bodyInputRef.current
      ) {
        this.bodyInputRef.current.select();
      }
    }
  }

  handleBodyChange = (event: SyntheticEvent<HTMLTextAreaElement>) => {
    this.setState({
      body: event.currentTarget.value
    });
  };

  cancelSubmit = noopCancel;

  handleSubmit = (event: SyntheticEvent<*>) => {
    const { currentUser, slug } = this.props;
    const { body } = this.state;

    event.preventDefault();

    this.cancelSubmit();

    this.setState({
      submitting: true,
      error: { type: "none" }
    });

    const [promise, cancel] = makeCancelable(
      api.addComment({
        token: currentUser.token,
        slug,
        body
      })
    );

    this.cancelSubmit = cancel;

    promise.then(
      result => {
        if (result.isOk) {
          this.setState({
            submitting: false,
            error: { type: "none" },
            body: ""
          });

          this.props.onAddComment(result.comment);
        } else {
          this.setState(
            {
              submitting: false,
              error: {
                type: "fields",
                ...result.errors
              }
            },
            () => this.focusFirstInvalidInput()
          );
        }
      },
      error => {
        if (!(error instanceof CanceledError)) {
          this.setState({
            submitting: false,
            error: { type: "network" }
          });
        }
      }
    );
  };

  componentWillUnmount() {
    this.cancelSubmit();
  }

  render() {
    const submitDisabled =
      this.state.body.trim() === "" || this.state.submitting;

    return (
      <form data-testid="add-comment" onSubmit={this.handleSubmit}>
        {this.renderError()}

        <StyledComment tag="div">
          <StyledCommentTextArea
            ref={this.bodyInputRef}
            testId="add-comment-body"
            disabled={this.state.submitting}
            value={this.state.body}
            onChange={this.handleBodyChange}
          />

          <StyledCommentBottom>
            <StyledCommentAvatar
              username={this.props.currentUser.username}
              image={this.props.currentUser.image}
            />

            <StyledCommentPost disabled={submitDisabled} />
          </StyledCommentBottom>
        </StyledComment>
      </form>
    );
  }

  renderError() {
    if (this.state.error.type === "none") {
      return <StyledCommentError />;
    } else if (this.state.error.type === "network") {
      return <StyledCommentError>An error occurred</StyledCommentError>;
    } else if (this.state.error.type === "fields" && this.state.error.body) {
      return (
        <StyledCommentError>Body {this.state.error.body[0]}</StyledCommentError>
      );
    }
  }
}

export default CommentForm;
