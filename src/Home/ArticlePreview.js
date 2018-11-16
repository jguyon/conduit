// @flow

import * as React from "react";
import { Link } from "@reach/router";
import cn from "classnames";
import ArticleInfo from "../ArticleInfo";
import * as api from "../api";

type ArticlePreviewProps = {|
  article: api.Article
|};

const ArticlePreview = ({ article }: ArticlePreviewProps) => (
  <article data-testid={`article-${article.slug}`}>
    <ArticleInfo className={cn("mv3")} article={article} />

    <Link
      to={`/article/${article.slug}`}
      className={cn("link", "moon-gray", "hover-gray")}
    >
      <h3 className={cn("f4", "black", "mv1")}>{article.title}</h3>
      <h4 className={cn("f5", "normal", "light-silver", "mv1")}>
        {article.description}
      </h4>

      <div
        className={cn("f6", "mv3", "flex", "justify-between", "items-center")}
      >
        <div>Read more...</div>

        <div className={cn("light-silver")}>
          {article.tagList.map(tag => (
            <span
              key={tag}
              className={cn("dib", "br-pill", "ba", "pv1", "ph2", "ml1")}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  </article>
);

export default ArticlePreview;
