// @flow

import * as React from "react";
import cn from "classnames";
import { navigate } from "@reach/router";
import { makeCancelable, CanceledError } from "../../lib/makeCancelable";
import * as api from "../../lib/api";

type FavoriteArticleProps = {|
  currentUser: ?api.User,
  article: api.Article,
  onFavoriteArticle: () => void,
  onUnfavoriteArticle: () => void,
  className?: string
|};

type FavoriteArticleState = {|
  loading: boolean
|};

class FavoriteArticle extends React.Component<
  FavoriteArticleProps,
  FavoriteArticleState
> {
  state = {
    loading: false
  };

  cancelClick: ?() => void = null;

  handleClick = () => {
    const { currentUser, article } = this.props;

    if (currentUser) {
      if (this.cancelClick) {
        this.cancelClick();
      }

      this.setState({ loading: true });

      if (article.favorited) {
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
            this.setState({ loading: false });
            this.props.onUnfavoriteArticle();
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
            this.setState({ loading: false });
            this.props.onFavoriteArticle();
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
    const {
      className,
      article: { favorited, favoritesCount }
    } = this.props;
    const { loading } = this.state;

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
