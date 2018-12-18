// @flow

import * as React from "react";
import { navigate } from "@reach/router";
import cn from "classnames";
import * as api from "../api";

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

  handleClick = () => {
    if (!this.state.pending) {
      this.setState({ pending: true });

      api
        .deleteArticle({
          token: this.props.currentUser.token,
          slug: this.props.article.slug
        })
        .then(() => navigate("/"), () => this.setState({ pending: false }));
    }
  };

  render() {
    return (
      <button
        type="button"
        onClick={this.handleClick}
        disabled={this.state.pending}
        className={cn(
          this.props.className,
          "f6",
          "button-reset",
          "bg-transparent",
          "light-red",
          "b--light-red",
          "ba",
          "br2",
          "pv1",
          "ph2",
          this.state.pending ? "o-20" : ["pointer", "dim"]
        )}
      >
        Delete Article
      </button>
    );
  }
}

export default DeleteArticle;
