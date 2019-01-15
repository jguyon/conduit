// @flow

import * as React from "react";
import {
  StyledHead,
  StyledHeadInfo,
  StyledBody,
  StyledTitle,
  StyledDescription,
  StyledBottom,
  StyledReadMore,
  StyledTags
} from "./styles";
import FavoriteArticle from "./favorite-article";
import type { Article, User } from "../../lib/api";

type ArticlePreviewProps =
  | {|
      placeholder: true
    |}
  | {|
      placeholder?: false,
      currentUser: ?User,
      article: Article
    |};

const ArticlePreview = (props: ArticlePreviewProps) => {
  if (props.placeholder) {
    return (
      <article>
        <StyledHead>
          <StyledHeadInfo placeholder />
        </StyledHead>

        <StyledBody placeholder>
          <StyledTitle placeholder />
          <StyledDescription placeholder />

          <StyledBottom>
            <StyledReadMore placeholder />
            <StyledTags placeholder />
          </StyledBottom>
        </StyledBody>
      </article>
    );
  } else {
    const { article, currentUser } = props;

    return (
      <article data-testid={`article-${article.slug}`}>
        <StyledHead>
          <StyledHeadInfo article={article} pubdate />

          {(!currentUser ||
            currentUser.username !== article.author.username) && (
            <FavoriteArticle currentUser={currentUser} article={article} />
          )}
        </StyledHead>

        <StyledBody path={`/article/${encodeURIComponent(article.slug)}`}>
          <StyledTitle>{article.title}</StyledTitle>
          <StyledDescription>{article.description}</StyledDescription>

          <StyledBottom>
            <StyledReadMore />
            <StyledTags tags={article.tagList} />
          </StyledBottom>
        </StyledBody>
      </article>
    );
  }
};

export default ArticlePreview;
