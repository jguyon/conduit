// @flow

import * as React from "react";
import cn from "classnames";
import { navigate } from "@reach/router";
import * as api from "../api";

type FavoriteArticleProps = {|
  currentUser: ?api.User,
  article: api.Article,
  className?: string
|};

type FavoriteArticleState = {|
  loading: boolean,
  favorited: boolean
|};

class FavoriteArticle extends React.Component<
  FavoriteArticleProps,
  FavoriteArticleState
> {
  state = {
    loading: false,
    favorited: this.props.article.favorited
  };

  handleClick = () => {
    const { currentUser, article } = this.props;

    if (currentUser) {
      if (!this.state.loading) {
        this.setState({ loading: true });

        if (this.state.favorited) {
          api
            .unfavoriteArticle({
              token: currentUser.token,
              slug: article.slug
            })
            .then(
              () =>
                this.setState({
                  loading: false,
                  favorited: false
                }),
              () => this.setState({ loading: false })
            );
        } else {
          api
            .favoriteArticle({
              token: currentUser.token,
              slug: article.slug
            })
            .then(
              () =>
                this.setState({
                  loading: false,
                  favorited: true
                }),
              () => this.setState({ loading: false })
            );
        }
      }
    } else {
      navigate("/login");
    }
  };

  render() {
    const {
      className,
      article: { favoritesCount }
    } = this.props;
    const { loading, favorited } = this.state;

    return (
      <button
        type="button"
        onClick={this.handleClick}
        disabled={loading}
        data-testid="favorite-article"
        className={cn(
          className,
          "f6",
          "button-reset",
          favorited
            ? ["bg-green", "b--green", "white"]
            : ["bg-transparent", "b--green", "green"],
          "ba",
          "br2",
          "pv1",
          "ph2",
          loading ? "o-20" : ["pointer", "dim"]
        )}
      >
        Favorite Article ({favorited ? favoritesCount + 1 : favoritesCount})
      </button>
    );
  }
}

export default FavoriteArticle;
