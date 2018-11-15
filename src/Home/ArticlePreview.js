// @flow

import * as React from "react";
import { Link } from "@reach/router";
import cn from "classnames";
import PrettyDate from "../PrettyDate";
import * as api from "../api";

type ArticlePreviewProps = {|
  article: api.Article
|};

const authorProfilePath = (article: api.Article) =>
  `/profile/${encodeURIComponent(article.author.username)}`;

const ArticlePreview = ({ article }: ArticlePreviewProps) => (
  <article>
    <div className={cn("mv3", "flex")}>
      <Link to={authorProfilePath(article)}>
        <img
          className={cn("br-100", "h2", "w2", "dib", "overflow-hidden")}
          alt={article.author.username}
          src={
            article.author.image === ""
              ? "https://static.productionready.io/images/smiley-cyrus.jpg"
              : article.author.image
          }
        />
      </Link>

      <div className={cn("ml2")}>
        <Link
          className={cn("link", "green", "underline-hover")}
          to={authorProfilePath(article)}
        >
          {article.author.username}
        </Link>

        <br />

        <PrettyDate
          className={cn("moon-gray", "f6")}
          pubdate="pubdate"
          date={new Date(article.createdAt)}
        />
      </div>
    </div>

    <Link
      to={`/article/${article.slug}`}
      className={cn("link", "moon-gray", "hover-gray")}
    >
      <h3
        className={cn("f4", "black", "mv1")}
        data-testid={`article-title-${article.slug}`}
      >
        {article.title}
      </h3>
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
