// @flow

import * as React from "react";
import { navigate } from "@reach/router";
import { StyledDelete } from "./article-styles";
import {
  makeCancelable,
  CanceledError,
  noopCancel
} from "../../lib/make-cancelable";
import * as api from "../../lib/api";

type DeleteArticleProps = {|
  article: api.Article,
  currentUser: api.User
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

  cancelClick = noopCancel;

  handleClick = () => {
    this.cancelClick();

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
        navigate("/");
      },
      error => {
        if (!(error instanceof CanceledError)) {
          this.setState({ pending: false });
        }
      }
    );
  };

  componentWillUnmount() {
    this.cancelClick();
  }

  render() {
    return (
      <StyledDelete loading={this.state.pending} onClick={this.handleClick} />
    );
  }
}

export default DeleteArticle;
