// @flow

import * as React from "react";
import { Link } from "@reach/router";
import cn from "classnames";
import PrettyDate from "./PrettyDate";
import type { Article } from "../lib/api";

type ProfileImageProps =
  | {|
      placeholder: true
    |}
  | {|
      placeholder?: false,
      alt: string,
      src: null | string
    |};

const ProfileImage = (props: ProfileImageProps) => (
  <img
    className={cn("br-100", "h2", "w2", "dib", "overflow-hidden")}
    alt={props.placeholder ? "profile" : props.alt}
    src={
      props.placeholder || !props.src
        ? "https://static.productionready.io/images/smiley-cyrus.jpg"
        : props.src
    }
  />
);

type ArticleInfoProps =
  | {
      placeholder: true,
      color: "green" | "white",
      className?: string
    }
  | {
      placeholder?: false,
      color: "green" | "white",
      pubdate?: boolean,
      className?: string,
      article: Article
    };

const authorProfilePath = (article: Article) =>
  `/profile/${encodeURIComponent(article.author.username)}`;

const ArticleInfo = (props: ArticleInfoProps) => {
  if (props.placeholder) {
    const { placeholder, color, className, ...rest } = props;

    return (
      <div {...rest} className={cn(className, "flex", "o-20")}>
        <div>
          <ProfileImage placeholder />
        </div>

        <div className={cn("ml2")}>
          <span className={cn(`bg-${color}`, "dib", "w3")}>&nbsp;</span>

          <br />

          <span className={cn("bg-moon-gray", "f6", "dib", "w4")}>&nbsp;</span>
        </div>
      </div>
    );
  } else {
    const { placeholder, color, pubdate, className, article, ...rest } = props;

    return (
      <div {...rest} className={cn(className, "flex")}>
        <Link to={authorProfilePath(article)}>
          <ProfileImage
            alt={article.author.username}
            src={article.author.image}
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
