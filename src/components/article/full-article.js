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

const FullArticlePlaceholder = () => (
  <StyledBanner>
    <StyledBannerTitle placeholder />

    <StyledBannerBottom>
      <StyledInfo banner placeholder />
    </StyledBannerBottom>
  </StyledBanner>
);

type FullArticleDataProps = {|
  article: api.Article,
  currentUser: ?api.User
|};

type FullArticleDataState = {|
  article: api.Article
|};

class FullArticleData extends React.Component<
  FullArticleDataProps,
  FullArticleDataState
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

type FullArticleProps =
  | {|
      placeholder: true
    |}
  | {|
      placeholder?: false,
      currentUser: ?api.User,
      article: api.Article
    |};

const FullArticle = (props: FullArticleProps) => {
  if (props.placeholder) {
    return <FullArticlePlaceholder />;
  } else {
    return (
      <FullArticleData
        currentUser={props.currentUser}
        article={props.article}
      />
    );
  }
};

export default FullArticle;
