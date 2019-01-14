// @flow

import * as React from "react";
import cn from "classnames";
import Banner from "../banner";
import PlaceholderText from "../placeholder-text";
import FollowUser from "./follow-user";
import FavoriteArticle from "./favorite-article";
import EditArticle from "./edit-article";
import DeleteArticle from "./delete-article";
import ArticleInfo from "../article-info";
import ArticleBody from "./article-body";
import Separator from "../separator";
import * as api from "../../lib/api";

export const FullArticlePlaceholder = () => (
  <Banner bg="dark-gray" fg="white">
    <h1 className={cn("f1", "mt0", "mb3", "text-shadow-1")}>
      <PlaceholderText className={cn("w-40")} />
    </h1>

    <ArticleInfo color="white" placeholder />
  </Banner>
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

          <DeleteArticle
            article={article}
            currentUser={currentUser}
            className={cn("ml2")}
          />
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
            className={cn("ml2")}
            currentUser={currentUser}
            article={article}
            onFavoriteArticle={this.handleFavoriteArticle}
            onUnfavoriteArticle={this.handleUnfavoriteArticle}
          />
        </>
      );

    return (
      <article>
        <Banner bg="dark-gray" fg="white">
          <h1 className={cn("f1", "mt0", "mb3", "text-shadow-1")}>
            {article.title}
          </h1>

          <div className={cn("flex", "items-center")}>
            <ArticleInfo
              className={cn("mr4")}
              color="white"
              article={article}
              pubdate
            />

            {buttons}
          </div>
        </Banner>

        <div className={cn("container", "mh-auto", "mv4")}>
          <div className={cn("f4", "dark-gray", "mv4")}>
            <ArticleBody body={article.body} />
          </div>

          <div className={cn("mv4", "light-silver", "f6")}>
            {article.tagList.map(tag => (
              <span
                key={tag}
                className={cn("dib", "br-pill", "ba", "pv1", "ph2", "mr1")}
              >
                {tag}
              </span>
            ))}
          </div>

          <Separator className={cn("mv4")} />

          <div className={cn("flex", "justify-center", "items-center", "mv4")}>
            <ArticleInfo
              className={cn("mr4")}
              color="green"
              article={article}
              pubdate
            />

            {buttons}
          </div>
        </div>
      </article>
    );
  }
}
