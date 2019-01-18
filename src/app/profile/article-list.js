// @flow

import * as React from "react";
import Request from "../request";
import type { RequestData } from "../request";
import ArticlePreview from "../article-preview";
import {
  StyledContainer,
  StyledTabs,
  StyledTabItem,
  StyledArticleSeparator,
  StyledArticlesLoadingError,
  StyledPagination
} from "./styles";
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
  focusRef = React.createRef<HTMLDivElement>();

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
      this.focusRef.current &&
      (nextState.page !== prevState.page || nextState.route !== prevState.route)
    ) {
      this.focusRef.current.focus();
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
          <StyledContainer ref={this.focusRef}>
            {this.renderTabs()}
            {this.renderArticles(request)}
          </StyledContainer>
        )}
      </Request>
    );
  }

  renderTabs() {
    const { route } = this.state;

    return (
      <StyledTabs>
        <StyledTabItem
          testId="authored-feed"
          current={route === "authored"}
          onClick={this.handleAuthoredClick}
        >
          My Posts
        </StyledTabItem>

        <StyledTabItem
          testId="favorited-feed"
          current={route === "favorited"}
          onClick={this.handleFavoritedClick}
        >
          Favorited Posts
        </StyledTabItem>
      </StyledTabs>
    );
  }

  renderArticles(request: RequestData<api.ListArticlesResp>) {
    switch (request.status) {
      case "pending":
        return (
          <>
            <ArticlePreview placeholder />
            <StyledArticleSeparator />
            <ArticlePreview placeholder />
          </>
        );

      case "error":
        return <StyledArticlesLoadingError />;

      case "success":
        const { currentUser } = this.props;
        const { articles, articlesCount } = request.data;

        const articleElements = articles.map((article, i) => (
          <React.Fragment key={article.slug}>
            <ArticlePreview currentUser={currentUser} article={article} />
            {i === articles.length - 1 ? null : <StyledArticleSeparator />}
          </React.Fragment>
        ));

        const paginationElement = (
          <StyledPagination
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
