// @flow

import * as React from "react";
import { navigate } from "@reach/router";
import Button from "../Button";
import { makeCancelable, CanceledError } from "../../lib/makeCancelable";
import * as api from "../../lib/api";

type DeleteArticleProps = {|
  article: api.Article,
  currentUser: api.User,
  className?: string
|};

type DeleteArticleState = {|
  pending: boolean
|};

class DeleteArticle extends React.Component<
  DeleteArticleProps,
  DeleteArticleState
> {
  state = {
    pending: false
  };

  cancelClick: ?() => void = null;

  handleClick = () => {
    if (this.cancelClick) {
      this.cancelClick();
    }

    this.setState({ pending: true });

    const [promise, cancel] = makeCancelable(
      api.deleteArticle({
        token: this.props.currentUser.token,
        slug: this.props.article.slug
      })
    );

    this.cancelClick = cancel;

    promise.then(
      () => {
        this.cancelClick = null;
        navigate("/");
      },
      error => {
        if (!(error instanceof CanceledError)) {
          this.cancelClick = null;
          this.setState({ pending: false });
        }
      }
    );
  };

  componentWillUnmount() {
    if (this.cancelClick) {
      this.cancelClick();
    }
  }

  render() {
    return (
      <Button
        type="button"
        color="light-red"
        outline
        onClick={this.handleClick}
        disabled={this.state.pending}
        className={this.props.className}
      >
        Delete Article
      </Button>
    );
  }
}

export default DeleteArticle;
