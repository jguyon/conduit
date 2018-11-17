// @flow

import * as React from "react";
import { Link } from "@reach/router";
import Markdown from "react-markdown";
import cn from "classnames";
import Request from "./Request";
import type { RequestData } from "./Request";
import ArticleInfo from "./ArticleInfo";
import NotFound from "./NotFound";
import PrettyDate from "./PrettyDate";
import * as api from "./api";

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

type LoadedCommentsProps = {|
  comments: api.Comment[]
|};

const authorProfilePath = (comment: api.Comment) =>
  `/profile/${encodeURIComponent(comment.author.username)}`;

const LoadedComments = ({ comments }: LoadedCommentsProps) => (
  <>
    {comments.map(comment => (
      <article
        key={comment.id}
        className={cn("light-gray", "mv2", "ba", "br1")}
      >
        <div className={cn("bb", "pa3")}>
          <span className={cn("dark-gray")}>{comment.body}</span>
        </div>

        <div className={cn("bg-near-white", "ph3", "pv2", "f6", "flex")}>
          <Link className={cn("mr2")} to={authorProfilePath(comment)}>
            <img
              className={cn("br-100", "h1", "w1", "dib", "overflow-hidden")}
              alt={comment.author.username}
              src={
                comment.author.image === ""
                  ? "https://static.productionready.io/images/smiley-cyrus.jpg"
                  : comment.author.image
              }
            />
          </Link>

          <Link
            className={cn("mr2", "link", "green", "underline-hover")}
            to={authorProfilePath(comment)}
          >
            {comment.author.username}
          </Link>

          <PrettyDate
            className={cn("moon-gray")}
            pubdate="pubdate"
            date={new Date(comment.createdAt)}
          />
        </div>
      </article>
    ))}
  </>
);

type LoadedArticleProps = {|
  article: api.Article,
  requestComments: RequestData<api.ListComments>
|};

const LoadedArticle = ({ article, requestComments }: LoadedArticleProps) => {
  const articleElement = (
    <>
      <header className={cn("bg-dark-gray", "white", "pa4", "shadow-inset-2")}>
        <div className={cn("container", "mh-auto")}>
          <h1 className={cn("f1", "mt0", "mb3", "test-shadow-1")}>
            {article.title}
          </h1>

          <ArticleInfo color="white" article={article} />
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

        <hr className={cn("light-gray", "bt", "bl-0", "br-0", "bb-0", "mv4")} />

        <div className={cn("flex", "justify-center", "mv4")}>
          <ArticleInfo color="green" article={article} />
        </div>
      </div>
    </>
  );

  switch (requestComments.status) {
    case "pending":
      return (
        <>
          {articleElement}
          <div className={cn("tc", "moon-gray", "mv5")}>
            Loading comments...
          </div>
        </>
      );

    case "error":
      return (
        <>
          {articleElement}
          <div className={cn("tc", "red", "mv5")}>Error loading comments!</div>
        </>
      );

    case "success":
      return (
        <>
          {articleElement}
          <div className={cn("container", "mv5", "mh-auto")}>
            <div className={cn("w-60", "mh-auto")}>
              <LoadedComments comments={requestComments.data.comments} />
            </div>
          </div>
        </>
      );

    default:
      throw new Error("invalid status");
  }
};

type ArticleProps = {|
  slug: string,
  getArticle: typeof api.getArticle,
  listComments: typeof api.listComments
|};

const Article = (props: ArticleProps) => {
  const loadArticle = () => props.getArticle(props.slug);
  const loadComments = () => props.listComments(props.slug);

  return (
    <Request load={loadArticle}>
      {requestArticle => (
        <Request load={loadComments}>
          {requestComments => {
            switch (requestArticle.status) {
              case "pending":
                return (
                  <div className={cn("tc", "moon-gray", "mv5")}>
                    Loading article...
                  </div>
                );

              case "error":
                return <NotFound />;

              case "success":
                return (
                  <LoadedArticle
                    article={requestArticle.data.article}
                    requestComments={requestComments}
                  />
                );

              default:
                throw new Error("invalid status");
            }
          }}
        </Request>
      )}
    </Request>
  );
};

export default Article;
