// @flow

import * as React from "react";
import cn from "classnames";
import Request from "../request";
import type { RequestData } from "../request";
import { Tabs, TabItem } from "../tabs";
import ArticlePreview from "../article-preview";
import Separator from "../separator";
import Pagination from "../pagination";
import * as api from "../../lib/api";

type ArticleListProps = {|
  currentUser: ?api.User,
  username: string
|};

type ArticleListState = {|
  page: number,
  route: "authored" | "favorited"
|};

class ArticleList extends React.Component<ArticleListProps, ArticleListState> {
  focusNode: ?HTMLElement = null;

  state = {
    page: 1,
    route: "authored"
  };

  setPage = (page: number) => {
    this.setState({ page });
  };

  loadArticles() {
    const { currentUser } = this.props;
    const { page, route } = this.state;

    const opts = {
      page,
      perPage: 10,
      token: currentUser ? currentUser.token : undefined
    };

    switch (route) {
      case "authored":
        return api.listArticles({
          ...opts,
          author: this.props.username
        });

      case "favorited":
        return api.listArticles({
          ...opts,
          favorited: this.props.username
        });

      default:
        throw new Error("invalid route");
    }
  }

  handleAuthoredClick = () => {
    this.setState({
      page: 1,
      route: "authored"
    });
  };

  handleFavoritedClick = () => {
    this.setState({
      page: 1,
      route: "favorited"
    });
  };

  componentDidUpdate(
    _prevProps: ArticleListProps,
    prevState: ArticleListState
  ) {
    const nextState = this.state;

    if (
      this.focusNode &&
      (nextState.page !== prevState.page || nextState.route !== prevState.route)
    ) {
      this.focusNode.focus();
    }
  }

  shouldComponentUpdate(
    nextProps: ArticleListProps,
    nextState: ArticleListState
  ) {
    const prevProps = this.props;
    const prevState = this.state;

    return (
      nextProps.username !== prevProps.username ||
      nextState.page !== prevState.page ||
      nextState.route !== prevState.route
    );
  }

  render() {
    return (
      <Request load={() => this.loadArticles()}>
        {request => (
          <div
            tabIndex="-1"
            role="group"
            ref={node => (this.focusNode = node)}
            className={cn("outline-0", "container", "mh-auto", "mv4")}
          >
            <div className={cn("w-80", "mh-auto")}>
              {this.renderTabs()}
              {this.renderArticles(request)}
            </div>
          </div>
        )}
      </Request>
    );
  }

  renderTabs() {
    const { route } = this.state;

    return (
      <Tabs className={cn("mb4")}>
        <TabItem
          data-testid="authored-feed"
          current={route === "authored"}
          onClick={this.handleAuthoredClick}
        >
          My Posts
        </TabItem>

        <TabItem
          data-testid="favorited-feed"
          current={route === "favorited"}
          onClick={this.handleFavoritedClick}
        >
          Favorited Posts
        </TabItem>
      </Tabs>
    );
  }

  renderArticles(request: RequestData<api.ListArticlesResp>) {
    switch (request.status) {
      case "pending":
        return (
          <>
            <ArticlePreview placeholder />
            <Separator className={cn("mv4")} />
            <ArticlePreview placeholder />
          </>
        );

      case "error":
        return <div className={cn("red")}>Error loading articles!</div>;

      case "success":
        const { currentUser } = this.props;
        const { articles, articlesCount } = request.data;

        const articleElements = articles.map((article, i) => (
          <React.Fragment key={article.slug}>
            <ArticlePreview
              currentUser={currentUser}
              article={article}
              data-testid={`article-${article.slug}`}
            />
            {i === articles.length - 1 ? null : (
              <Separator className={cn("mv4")} />
            )}
          </React.Fragment>
        ));

        const paginationElement = (
          <Pagination
            className={cn("mv4")}
            testIdPrefix="articles"
            setPage={this.setPage}
            currentPage={this.state.page}
            pageCount={
              Math.floor(articlesCount / 10) +
              (articlesCount === 0 || articlesCount % 10 !== 0 ? 1 : 0)
            }
          />
        );

        return (
          <>
            {articleElements}
            {paginationElement}
          </>
        );

      default:
        throw new Error("invalid status");
    }
  }
}

export default ArticleList;
