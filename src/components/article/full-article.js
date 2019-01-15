// @flow

import * as React from "react";
import FollowUser from "./follow-user";
import FavoriteArticle from "./favorite-article";
import EditArticle from "./edit-article";
import DeleteArticle from "./delete-article";
import ArticleBody from "./article-body";
import {
  StyledBanner,
  StyledBannerTitle,
  StyledBannerBottom,
  StyledContainer,
  StyledContainerBottom,
  StyledInfo,
  StyledTags,
  StyledSeparator
} from "./article-styles";
import * as api from "../../lib/api";

export const FullArticlePlaceholder = () => (
  <StyledBanner>
    <StyledBannerTitle placeholder />

    <StyledBannerBottom>
      <StyledInfo banner placeholder />
    </StyledBannerBottom>
  </StyledBanner>
);

type FullArticleProps = {|
  article: api.Article,
  currentUser: ?api.User
|};

type FullArticleState = {|
  article: api.Article
|};

export class FullArticle extends React.Component<
  FullArticleProps,
  FullArticleState
> {
  state = {
    article: this.props.article
  };

  handleFollowUser = () => {
    this.setState(({ article }) => ({
      article: {
        ...article,
        author: {
          ...article.author,
          following: true
        }
      }
    }));
  };

  handleUnfollowUser = () => {
    this.setState(({ article }) => ({
      article: {
        ...article,
        author: {
          ...article.author,
          following: false
        }
      }
    }));
  };

  handleFavoriteArticle = () => {
    this.setState(({ article }) => ({
      article: {
        ...article,
        favorited: true,
        favoritesCount: article.favorited
          ? article.favoritesCount
          : article.favoritesCount + 1
      }
    }));
  };

  handleUnfavoriteArticle = () => {
    this.setState(({ article }) => ({
      article: {
        ...article,
        favorited: false,
        favoritesCount: article.favorited
          ? article.favoritesCount - 1
          : article.favoritesCount
      }
    }));
  };

  render() {
    const { currentUser } = this.props;
    const { article } = this.state;

    const buttons =
      currentUser && article.author.username === currentUser.username ? (
        <>
          <EditArticle article={article} />
          <DeleteArticle article={article} currentUser={currentUser} />
        </>
      ) : (
        <>
          <FollowUser
            currentUser={currentUser}
            user={article.author}
            onFollowUser={this.handleFollowUser}
            onUnfollowUser={this.handleUnfollowUser}
          />
          <FavoriteArticle
            currentUser={currentUser}
            article={article}
            onFavoriteArticle={this.handleFavoriteArticle}
            onUnfavoriteArticle={this.handleUnfavoriteArticle}
          />
        </>
      );

    return (
      <article>
        <StyledBanner>
          <StyledBannerTitle>{article.title}</StyledBannerTitle>

          <StyledBannerBottom>
            <StyledInfo banner article={article} pubdate />

            {buttons}
          </StyledBannerBottom>
        </StyledBanner>

        <StyledContainer>
          <ArticleBody body={article.body} />

          <StyledTags tags={article.tagList} />

          <StyledSeparator />

          <StyledContainerBottom>
            <StyledInfo article={article} pubdate />

            {buttons}
          </StyledContainerBottom>
        </StyledContainer>
      </article>
    );
  }
}
