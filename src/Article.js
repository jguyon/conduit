// @flow

import * as React from "react";
import cn from "classnames";
import Request from "./Request";
import ArticleInfo from "./ArticleInfo";
import NotFound from "./NotFound";
import * as api from "./api";

type ArticleProps = {|
  slug: string,
  getArticle: typeof api.getArticle
|};

const Article = (props: ArticleProps) => (
  <Request load={() => props.getArticle(props.slug)}>
    {request => {
      switch (request.status) {
        case "pending":
          return (
            <div className={cn("tc", "moon-gray", "mv5")}>
              Loading article...
            </div>
          );

        case "error":
          return <NotFound />;

        case "success":
          const { article } = request.data;

          return (
            <>
              <header
                className={cn("bg-dark-gray", "white", "pa4", "shadow-inset-2")}
              >
                <div className={cn("container", "mh-auto")}>
                  <h1 className={cn("f1", "mt0", "mb3", "test-shadow-1")}>
                    {article.title}
                  </h1>

                  <ArticleInfo color="white" article={article} />
                </div>
              </header>

              <div className={cn("container mh-auto", "mv4")}>
                <p className={cn("f4", "serif", "mv4")}>{article.body}</p>

                <div className={cn("mv4", "light-silver", "f6")}>
                  {article.tagList.map(tag => (
                    <span
                      key={tag}
                      className={cn(
                        "dib",
                        "br-pill",
                        "ba",
                        "pv1",
                        "ph2",
                        "mr1"
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <hr
                  className={cn(
                    "light-gray",
                    "bt",
                    "bl-0",
                    "br-0",
                    "bb-0",
                    "mv4"
                  )}
                />

                <div className={cn("flex", "justify-center")}>
                  <ArticleInfo color="green" article={article} />
                </div>
              </div>
            </>
          );

        default:
          throw new Error("invalid status");
      }
    }}
  </Request>
);

export default Article;
