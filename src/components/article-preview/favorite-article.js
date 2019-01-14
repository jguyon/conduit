// @flow

import * as React from "react";
import { navigate } from "@reach/router";
import Button from "../button";
import {
  makeCancelable,
  CanceledError,
  noopCancel
} from "../../lib/make-cancelable";
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

  cancelClick = noopCancel;

  handleClick = () => {
    const { currentUser, article } = this.props;

    if (currentUser) {
      this.cancelClick();

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
    this.cancelClick();
  }

  render() {
    const {
      className,
      article: { slug }
    } = this.props;
    const { loading, favorited, favoritesCount } = this.state;

    return (
      <Button
        type="button"
        color="green"
        outline={!favorited}
        onClick={this.handleClick}
        disabled={loading}
        testId={`favorite-article-${slug}`}
        className={className}
      >
        <strong>+</strong> {favoritesCount}
      </Button>
    );
  }
}

export default FavoriteArticle;
