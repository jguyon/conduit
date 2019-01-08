// @flow

import * as React from "react";
import { Link } from "@reach/router";
import cn from "classnames";
import ArticleInfo from "./ArticleInfo";
import type { Article } from "../lib/api";

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
      props.placeholder ? ["bg-light-silver", `w${props.size}`] : null,
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
      article: Article
    };

const ArticlePreview = (props: ArticlePreviewProps) => {
  if (props.placeholder) {
    const { placeholder, ...rest } = props;

    return (
      <div {...rest}>
        <ArticleInfo placeholder color="green" className={cn("mv3")} />

        <div className={cn("o-20")}>
          <div className={cn("f4", "bg-dark-gray", "mv1", "w4")}>&nbsp;</div>
          <div className={cn("f5", "bg-light-silver", "mv1", "w5")}>&nbsp;</div>

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
            <div className={cn("bg-moon-gray", "w3")}>&nbsp;</div>

            <div>
              <Tag placeholder size={2} />
              <Tag placeholder size={3} />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    const { placeholder, article, ...rest } = props;

    return (
      <article {...rest}>
        <ArticleInfo
          color="green"
          className={cn("mv3")}
          article={article}
          pubdate
        />

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
