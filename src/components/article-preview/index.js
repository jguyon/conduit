// @flow

import * as React from "react";
import { Link } from "@reach/router";
import cn from "classnames";
import PlaceholderText from "../placeholder-text";
import ArticleInfo from "../article-info";
import FavoriteArticle from "./favorite-article";
import type { Article, User } from "../../lib/api";

type TagProps =
  | {|
      placeholder: true,
      size: 2 | 3
    |}
  | {|
      placeholder?: false,
      text: string
    |};

const Tag = (props: TagProps) => (
  <span
    className={cn(
      "dib",
      "light-silver",
      props.placeholder ? ["bg-current", `w${props.size}`, "o-20"] : null,
      "br-pill",
      "ba",
      "pv1",
      "ph2",
      "ml1"
    )}
  >
    {props.placeholder ? <>&nbsp;</> : props.text}
  </span>
);

type ArticlePreviewProps =
  | {
      placeholder: true
    }
  | {
      placeholder?: false,
      currentUser: ?User,
      article: Article
    };

const ArticlePreview = (props: ArticlePreviewProps) => {
  if (props.placeholder) {
    const { placeholder, ...rest } = props;

    return (
      <article {...rest}>
        <div className={cn("mv3")}>
          <ArticleInfo placeholder color="green" />
        </div>

        <div className={cn("moon-gray")}>
          <h3 className={cn("f4", "dark-gray", "mv1")}>
            <PlaceholderText className={cn("w4")} />
          </h3>
          <h4 className={cn("f5", "normal", "light-silver", "mv1")}>
            <PlaceholderText className={cn("w5")} />
          </h4>

          <div
            className={cn(
              "f6",
              "mv3",
              "h2",
              "flex",
              "justify-between",
              "items-center"
            )}
          >
            <div>
              <PlaceholderText className={cn("w3")} />
            </div>

            <div>
              <Tag placeholder size={2} />
              <Tag placeholder size={3} />
            </div>
          </div>
        </div>
      </article>
    );
  } else {
    const { placeholder, article, currentUser, ...rest } = props;

    return (
      <article {...rest}>
        <div className={cn("flex", "mv3")}>
          <ArticleInfo color="green" article={article} pubdate />

          <div className={cn("flex-auto", "tr")}>
            {(!currentUser ||
              currentUser.username !== article.author.username) && (
              <FavoriteArticle currentUser={currentUser} article={article} />
            )}
          </div>
        </div>

        <Link
          to={`/article/${article.slug}`}
          className={cn("link", "moon-gray", "hover-gray")}
        >
          <h3 className={cn("f4", "dark-gray", "mv1")}>{article.title}</h3>
          <h4 className={cn("f5", "normal", "light-silver", "mv1")}>
            {article.description}
          </h4>

          <div
            className={cn(
              "f6",
              "mv3",
              "h2",
              "flex",
              "justify-between",
              "items-center"
            )}
          >
            <div>Read more...</div>

            <div>
              {article.tagList.map(tag => (
                <Tag key={tag} text={tag} />
              ))}
            </div>
          </div>
        </Link>
      </article>
    );
  }
};

export default ArticlePreview;
