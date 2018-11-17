// @flow

import * as React from "react";
import { Link } from "@reach/router";
import cn from "classnames";
import PrettyDate from "./PrettyDate";
import * as api from "./api";

type ArticleInfoProps = {
  color: "green" | "white",
  article: api.Article,
  className?: string
};

const authorProfilePath = (article: api.Article) =>
  `/profile/${encodeURIComponent(article.author.username)}`;

const ArticleInfo = ({
  color,
  article,
  className,
  ...props
}: ArticleInfoProps) => (
  <div {...props} className={cn(className, "flex")}>
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
        className={cn("link", color, "underline-hover")}
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
);

export default ArticleInfo;
