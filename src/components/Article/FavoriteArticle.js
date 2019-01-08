// @flow

import * as React from "react";
import cn from "classnames";
import { navigate } from "@reach/router";
import { makeCancelable, CanceledError } from "../../lib/makeCancelable";
import * as api from "../../lib/api";

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

  cancelClick: ?() => void = null;

  handleClick = () => {
    const { currentUser, article } = this.props;

    if (currentUser) {
      if (this.cancelClick) {
        this.cancelClick();
      }

      this.setState({ loading: true });

      if (this.state.favorited) {
        const [promise, cancel] = makeCancelable(
          api.unfavoriteArticle({
            token: currentUser.token,
            slug: article.slug
          })
        );

        this.cancelClick = cancel;

        promise.then(
          () => {
            this.cancelClick = null;

            this.setState(({ favorited, favoritesCount }) =>
              favorited
                ? {
                    loading: false,
                    favorited: false,
                    favoritesCount: favoritesCount - 1
                  }
                : { loading: false }
            );
          },
          error => {
            if (!(error instanceof CanceledError)) {
              this.cancelClick = null;
              this.setState({ loading: false });
            }
          }
        );
      } else {
        const [promise, cancel] = makeCancelable(
          api.favoriteArticle({
            token: currentUser.token,
            slug: article.slug
          })
        );

        this.cancelClick = cancel;

        promise.then(
          () => {
            this.cancelClick = null;

            this.setState(({ favorited, favoritesCount }) =>
              favorited
                ? { loading: false }
                : {
                    loading: false,
                    favorited: true,
                    favoritesCount: favoritesCount + 1
                  }
            );
          },
          error => {
            if (!(error instanceof CanceledError)) {
              this.cancelClick = null;
              this.setState({ loading: false });
            }
          }
        );
      }
    } else {
      navigate("/login");
    }
  };

  componentWillUnmount() {
    if (this.cancelClick) {
      this.cancelClick();
    }
  }

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
