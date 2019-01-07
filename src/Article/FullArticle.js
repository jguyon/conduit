// @flow

import * as React from "react";
import { Link } from "@reach/router";
import Markdown from "react-markdown";
import cn from "classnames";
import FavoriteArticle from "./FavoriteArticle";
import DeleteArticle from "./DeleteArticle";
import ArticleInfo from "../ArticleInfo";
import Separator from "../Separator";
import * as api from "../api";

const RendererHr = (props: {}) => (
  <hr {...props} className={cn("light-gray", "bt", "bl-0", "br-0", "bb-0")} />
);

const RendererLink = ({ children, ...props }: { children?: React.Node }) => (
  <a {...props} className={cn("link", "green", "underline-hover")}>
    {children}
  </a>
);

const renderers = {
  thematicBreak: RendererHr,
  link: RendererLink,
  linkReference: RendererLink
};

type FullArticleProps =
  | {|
      placeholder: true
    |}
  | {|
      placeholder?: false,
      article: api.Article,
      currentUser: ?api.User
    |};

const FullArticle = (props: FullArticleProps) => {
  if (props.placeholder) {
    return (
      <div className={cn("bg-dark-gray", "pa4", "shadow-inset-2")}>
        <div className={cn("container", "mh-auto")}>
          <div
            className={cn(
              "f1",
              "bg-white",
              "mt0",
              "mb3",
              "shadow-1",
              "w-40",
              "o-20"
            )}
          >
            &nbsp;
          </div>

          <ArticleInfo color="white" placeholder />
        </div>
      </div>
    );
  } else {
    const { article, currentUser } = props;

    return (
      <article>
        <header
          className={cn("bg-dark-gray", "white", "pa4", "shadow-inset-2")}
        >
          <div className={cn("container", "mh-auto")}>
            <h1 className={cn("f1", "mt0", "mb3", "text-shadow-1")}>
              {article.title}
            </h1>

            <div className={cn("flex", "items-center")}>
              <ArticleInfo color="white" article={article} pubdate />

              {currentUser &&
              article.author.username === currentUser.username ? (
                <>
                  <Link
                    to={`/editor/${encodeURIComponent(article.slug)}`}
                    className={cn(
                      "f6",
                      "link",
                      "moon-gray",
                      "ba",
                      "br2",
                      "pointer",
                      "dim",
                      "pv1",
                      "ph2",
                      "ml4"
                    )}
                  >
                    Edit Article
                  </Link>

                  <DeleteArticle
                    article={article}
                    currentUser={currentUser}
                    className={cn("ml2")}
                  />
                </>
              ) : (
                <FavoriteArticle
                  className={cn("ml4")}
                  currentUser={currentUser}
                  article={article}
                />
              )}
            </div>
          </div>
        </header>

        <div className={cn("container", "mh-auto", "mv4")}>
          <div className={cn("f4", "dark-gray", "mv4")}>
            <Markdown source={article.body} renderers={renderers} />
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

          <div className={cn("flex", "justify-center", "mv4")}>
            <ArticleInfo color="green" article={article} pubdate />
          </div>
        </div>
      </article>
    );
  }
};

export default FullArticle;
