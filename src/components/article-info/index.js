// @flow

import * as React from "react";
import { Link } from "@reach/router";
import cn from "classnames";
import Avatar from "../avatar";
import PlaceholderText from "../placeholder-text";
import PrettyDate from "../pretty-date";
import type { Article } from "../../lib/api";

type ArticleInfoProps =
  | {|
      placeholder: true,
      color: "green" | "white",
      className?: string
    |}
  | {|
      placeholder?: false,
      color: "green" | "white",
      pubdate?: boolean,
      className?: string,
      article: Article
    |};

const authorProfilePath = (article: Article) =>
  `/profile/${encodeURIComponent(article.author.username)}`;

const ArticleInfo = (props: ArticleInfoProps) => {
  if (props.placeholder) {
    const { placeholder, color, className, ...rest } = props;

    return (
      <div {...rest} className={cn(className, "flex")}>
        <div>
          <Avatar placeholder size={2} />
        </div>

        <div className={cn("ml2")}>
          <PlaceholderText className={cn(color, "w3")} />

          <br />

          <PlaceholderText className={cn("moon-gray", "f6", "w4")} />
        </div>
      </div>
    );
  } else {
    const { placeholder, color, pubdate, className, article, ...rest } = props;

    return (
      <div {...rest} className={cn(className, "flex")}>
        <Link to={authorProfilePath(article)}>
          <Avatar
            size={2}
            username={article.author.username}
            image={article.author.image}
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
            pubdate={pubdate ? "pubdate" : undefined}
            date={new Date(article.createdAt)}
          />
        </div>
      </div>
    );
  }
};

export default ArticleInfo;
