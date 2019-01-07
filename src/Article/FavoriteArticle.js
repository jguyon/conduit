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
  favorited: boolean,
  favoritesCount: number
|};

class FavoriteArticle extends React.Component<
  FavoriteArticleProps,
  FavoriteArticleState
> {
  state = {
    loading: false,
    favorited: this.props.article.favorited,
    favoritesCount: this.props.article.favoritesCount
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
                this.setState(({ favorited, favoritesCount }) =>
                  favorited
                    ? {
                        loading: false,
                        favorited: false,
                        favoritesCount: favoritesCount - 1
                      }
                    : undefined
                ),
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
                this.setState(({ favorited, favoritesCount }) =>
                  favorited
                    ? undefined
                    : {
                        loading: false,
                        favorited: true,
                        favoritesCount: favoritesCount + 1
                      }
                ),
              () => this.setState({ loading: false })
            );
        }
      }
    } else {
      navigate("/login");
    }
  };

  render() {
    const { className } = this.props;
    const { loading, favorited, favoritesCount } = this.state;

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
        {favorited ? "Unfavorite Article" : "Favorite Article"} (
        {favoritesCount})
      </button>
    );
  }
}

export default FavoriteArticle;
