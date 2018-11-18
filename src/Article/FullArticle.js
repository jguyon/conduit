// @flow

import * as React from "react";
import Markdown from "react-markdown";
import cn from "classnames";
import ArticleInfo from "../ArticleInfo";
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

type FullArticleProps = {|
  article: api.Article
|};

const FullArticle = ({ article }: FullArticleProps) => (
  <article>
    <header className={cn("bg-dark-gray", "white", "pa4", "shadow-inset-2")}>
      <div className={cn("container", "mh-auto")}>
        <h1 className={cn("f1", "mt0", "mb3", "test-shadow-1")}>
          {article.title}
        </h1>

        <ArticleInfo color="white" article={article} pubdate />
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
        <ArticleInfo color="green" article={article} pubdate />
      </div>
    </div>
  </article>
);

export default FullArticle;
