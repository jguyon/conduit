// @flow

import * as React from "react";
import { navigate } from "@reach/router";
import Button from "../Button";
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
      <Button
        type="button"
        color="green"
        onClick={this.handleClick}
        outline={!favorited}
        disabled={loading}
        testId="favorite-article"
        className={className}
      >
        {favorited ? "Unfavorite Article" : "Favorite Article"} (
        {favoritesCount})
      </Button>
    );
  }
}

export default FavoriteArticle;
