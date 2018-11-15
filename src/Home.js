// @flow

import * as React from "react";
import { Link } from "@reach/router";
import cn from "classnames";
import Request from "./Request";
import PrettyDate from "./PrettyDate";
import * as api from "./api";

const HomeBanner = () => (
  <header className={cn("bg-green", "white", "pa4", "shadow-inset-2")}>
    <div className={cn("container", "mh-auto", "tc")}>
      <h1 className={cn("f1", "mt0", "mb3", "text-shadow-1")}>conduit</h1>

      <h2 className={cn("f4", "normal", "ma0")}>
        A place to share your knowledge.
      </h2>
    </div>
  </header>
);

type ArticleListProps = {|
  articles: api.Article[]
|};

const authorProfilePath = (article: api.Article) =>
  `/profile/${encodeURIComponent(article.author.username)}`;

const ArticleList = (props: ArticleListProps) =>
  props.articles.map((article, i) => (
    <React.Fragment key={article.slug}>
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
            className={cn(
              "f6",
              "mv3",
              "flex",
              "justify-between",
              "items-center"
            )}
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

      {i === props.articles.length - 1 ? null : (
        <hr className={cn("light-gray", "bt", "bl-0", "br-0", "bb-0", "mv4")} />
      )}
    </React.Fragment>
  ));

type PageProps = {|
  page: number,
  setPage: number => void,
  current?: boolean,
  className?: string
|};

const Page = (props: PageProps) => (
  <button
    type="button"
    data-testid={`articles-page-${props.page}`}
    onClick={() => props.setPage(props.page)}
    disabled={props.current}
    className={cn(
      props.className,
      "br-pill",
      "ba",
      "pv1",
      "ph2",
      "b--green",
      props.current
        ? ["white", "bg-green"]
        : [
            "green",
            "bg-white",
            "bg-animate",
            "hover-white",
            "hover-bg-green",
            "pointer"
          ]
    )}
  >
    {props.page}
  </button>
);

type PaginationProps = {|
  currentPage: number,
  pageCount: number,
  setPage: number => void
|};

const Pagination = (props: PaginationProps) => (
  <div className={cn("mv4", "flex", "justify-center")}>
    {props.currentPage > 2 ? (
      <Page className="mr3" page={1} setPage={props.setPage} />
    ) : null}

    {props.currentPage > 1 ? (
      <Page
        className="mr1"
        page={props.currentPage - 1}
        setPage={props.setPage}
      />
    ) : null}

    <Page current page={props.currentPage} setPage={props.setPage} />

    {props.currentPage < props.pageCount ? (
      <Page
        className="ml1"
        page={props.currentPage + 1}
        setPage={props.setPage}
      />
    ) : null}

    {props.currentPage < props.pageCount - 1 ? (
      <Page className="ml3" page={props.pageCount} setPage={props.setPage} />
    ) : null}
  </div>
);

type TabsProps = {|
  children: React.Node
|};

const Tabs = (props: TabsProps) => (
  <div className={cn("light-gray", "bb", "mv4", "flex")}>{props.children}</div>
);

type TabItemProps = {
  current?: boolean,
  children: React.Node
};

const TabItem = ({ current, children, ...props }: TabItemProps) => (
  <button
    {...props}
    type="button"
    disabled={current}
    className={cn(
      "bg-transparent",
      current ? "green" : ["light-silver", "hover-gray", "pointer"],
      "pv2",
      "ph3",
      "ba"
    )}
    style={{
      borderTopWidth: 0,
      borderLeftWidth: 0,
      borderRightWidth: 0,
      borderBottomWidth: "2px",
      borderBottomColor: "currentColor",
      position: "relative",
      top: "1px",
      ...(current ? {} : { borderColor: "transparent" })
    }}
  >
    {children}
  </button>
);

type HomeProps = {|
  listArticles: typeof api.listArticles
|};

type HomeState = {|
  page: number
|};

class Home extends React.Component<HomeProps, HomeState> {
  state = {
    page: 1
  };

  setPage = (page: number) => {
    this.setState({ page });
  };

  render() {
    return (
      <>
        <HomeBanner />

        <div className={cn("container", "mh-auto", "mv4")}>
          <Tabs>
            <TabItem current>Global feed</TabItem>
          </Tabs>

          <Request
            load={() =>
              this.props.listArticles({ page: this.state.page, perPage: 10 })
            }
          >
            {request => {
              switch (request.status) {
                case "pending":
                  return (
                    <div className={cn("moon-gray")}>Loading articles...</div>
                  );

                case "error":
                  return (
                    <div className={cn("red")}>Error loading articles!</div>
                  );

                case "success":
                  const { articles, articlesCount } = request.data;

                  return (
                    <>
                      <ArticleList articles={articles} />
                      <Pagination
                        setPage={this.setPage}
                        currentPage={this.state.page}
                        pageCount={
                          Math.floor(articlesCount / 10) +
                          (articlesCount === 0 || articlesCount % 10 !== 0
                            ? 1
                            : 0)
                        }
                      />
                    </>
                  );

                default:
                  throw new Error("invalid status");
              }
            }}
          </Request>
        </div>
      </>
    );
  }
}

export default Home;
