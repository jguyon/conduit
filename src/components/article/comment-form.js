// @flow

import * as React from "react";
import cn from "classnames";
import Button from "../button";
import { makeCancelable, CanceledError } from "../../lib/make-cancelable";
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

  cancelSubmit: ?() => void = null;

  handleSubmit = (event: SyntheticEvent<*>) => {
    const { currentUser, slug } = this.props;
    const { body } = this.state;

    event.preventDefault();

    if (this.cancelSubmit) {
      this.cancelSubmit();
    }

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
        this.cancelSubmit = null;

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
          this.cancelSubmit = null;

          this.setState({
            submitting: false,
            error: { type: "network" }
          });
        }
      }
    );
  };

  componentWillUnmount() {
    if (this.cancelSubmit) {
      this.cancelSubmit();
    }
  }

  render() {
    const submitDisabled =
      this.state.body.trim() === "" || this.state.submitting;

    return (
      <form data-testid="add-comment" onSubmit={this.handleSubmit}>
        {this.renderError()}

        <div className={cn("light-gray", "mv2", "ba", "br1")}>
          <div className={cn("bb")}>
            <textarea
              ref={this.bodyInputRef}
              data-testid="add-comment-body"
              disabled={this.state.submitting}
              value={this.state.body}
              onChange={this.handleBodyChange}
              rows="4"
              placeholder="Write a comment..."
              className={cn(
                "w-100",
                "dark-gray",
                "bn",
                "pa3",
                "bg-transparent",
                "outline-0"
              )}
            />
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
            <img
              className={cn("br-100", "h1", "w1", "dib", "overflow-hidden")}
              alt={this.props.currentUser.username}
              src={
                this.props.currentUser.image
                  ? this.props.currentUser.image
                  : "https://static.productionready.io/images/smiley-cyrus.jpg"
              }
            />

            <div className={cn("flex-auto", "tr")}>
              <Button type="submit" color="green" disabled={submitDisabled}>
                Post Comment
              </Button>
            </div>
          </div>
        </div>
      </form>
    );
  }

  renderError() {
    const className = cn("mv3", "dark-red", "tc");

    if (this.state.error.type === "none") {
      return <div role="alert" />;
    } else if (this.state.error.type === "network") {
      return (
        <div role="alert" className={className}>
          An error occurred
        </div>
      );
    } else if (this.state.error.type === "fields" && this.state.error.body) {
      return (
        <div role="alert" className={className}>
          Body {this.state.error.body[0]}
        </div>
      );
    }
  }
}

export default CommentForm;
