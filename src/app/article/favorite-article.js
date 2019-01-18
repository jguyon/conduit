// @flow

import * as React from "react";
import { navigate } from "@reach/router";
import { StyledFavorite } from "./article-styles";
import {
  makeCancelable,
  CanceledError,
  noopCancel
} from "../../lib/make-cancelable";
import * as api from "../../lib/api";

type FavoriteArticleProps = {|
  currentUser: ?api.User,
  article: api.Article,
  onFavoriteArticle: () => void,
  onUnfavoriteArticle: () => void
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

  cancelClick = noopCancel;

  handleClick = () => {
    const { currentUser, article } = this.props;

    if (currentUser) {
      this.cancelClick();

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
            this.setState({ loading: false });
            this.props.onUnfavoriteArticle();
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
            this.setState({ loading: false });
            this.props.onFavoriteArticle();
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
      article: { favorited, favoritesCount }
    } = this.props;
    const { loading } = this.state;

    return (
      <StyledFavorite
        favorited={favorited}
        favoritesCount={favoritesCount}
        loading={loading}
        testId="favorite-article"
        onClick={this.handleClick}
      />
    );
  }
}

export default FavoriteArticle;
