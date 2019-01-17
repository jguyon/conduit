// @flow

import * as React from "react";
import cn from "classnames";
import Request from "../request";
import type { RequestData } from "../request";
import {
  StyledBanner,
  StyledContainer,
  StyledContainerMain,
  StyledContainerAside,
  StyledTabs,
  StyledTabItem,
  StyledArticleSeparator,
  StyledPagination,
  StyledTags,
  StyledTagItem,
  StyledTagLoadingError
} from "./styles";
import ArticlePreview from "../article-preview";
import * as api from "../../lib/api";

type HomeProps = {|
  currentUser: ?api.User
|};

type HomeState = {|
  page: number,
  route:
    | {| type: "global" |}
    | {|
        type: "my",
        token: string
      |}
    | {|
        type: "tag",
        tag: string
      |}
|};

class Home extends React.Component<HomeProps, HomeState> {
  focusRef = React.createRef<HTMLDivElement>();

  state = {
    page: 1,
    route: this.props.currentUser
      ? { type: "my", token: this.props.currentUser.token }
      : { type: "global" }
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

    switch (route.type) {
      case "global":
        return api.listArticles(opts);

      case "my":
        return api.listFeedArticles({
          ...opts,
          token: route.token
        });

      case "tag":
        return api.listArticles({
          ...opts,
          tag: route.tag
        });

      default:
        throw new Error("invalid route type");
    }
  }

  handleGlobalFeedClick = () => {
    this.setState({
      page: 1,
      route: { type: "global" }
    });
  };

  handleMyFeedClick = () => {
    if (this.props.currentUser) {
      this.setState({
        page: 1,
        route: {
          type: "my",
          token: this.props.currentUser.token
        }
      });
    }
  };

  handleTagClick(tag: string) {
    return () =>
      this.setState({
        page: 1,
        route: {
          type: "tag",
          tag
        }
      });
  }

  componentDidUpdate(_prevProps: HomeProps, prevState: HomeState) {
    const nextState = this.state;

    if (
      this.focusRef.current &&
      (nextState.page !== prevState.page || nextState.route !== prevState.route)
    ) {
      this.focusRef.current.focus();
    }
  }

  render() {
    return (
      <>
        <StyledBanner />

        <StyledContainer ref={this.focusRef}>
          <StyledContainerMain>
            {this.renderTabs()}

            <Request load={() => this.loadArticles()}>
              {this.renderArticles}
            </Request>
          </StyledContainerMain>

          <StyledContainerAside>
            <StyledTags>
              <Request load={api.listTags}>{this.renderTags}</Request>
            </StyledTags>
          </StyledContainerAside>
        </StyledContainer>
      </>
    );
  }

  renderTabs() {
    const { currentUser } = this.props;
    const { route } = this.state;

    return (
      <StyledTabs>
        {currentUser ? (
          <StyledTabItem
            testId="my-feed"
            current={route.type === "my"}
            onClick={this.handleMyFeedClick}
          >
            Your Feed
          </StyledTabItem>
        ) : null}

        <StyledTabItem
          testId="global-feed"
          current={route.type === "global"}
          onClick={this.handleGlobalFeedClick}
        >
          Global Feed
        </StyledTabItem>

        {route.type === "tag" ? (
          <StyledTabItem current>#{route.tag}</StyledTabItem>
        ) : null}
      </StyledTabs>
    );
  }

  renderArticles = (request: RequestData<api.ListArticlesResp>) => {
    switch (request.status) {
      case "pending":
        return (
          <>
            <ArticlePreview placeholder />
            <StyledArticleSeparator />
            <ArticlePreview placeholder />
            <StyledArticleSeparator />
            <ArticlePreview placeholder />
            <StyledArticleSeparator />
            <ArticlePreview placeholder />
            <StyledArticleSeparator />
            <ArticlePreview placeholder />
            <StyledArticleSeparator />
            <ArticlePreview placeholder />
            <StyledArticleSeparator />
            <ArticlePreview placeholder />
            <StyledArticleSeparator />
            <ArticlePreview placeholder />
            <StyledArticleSeparator />
            <ArticlePreview placeholder />
            <StyledArticleSeparator />
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
  };

  renderTags = (request: RequestData<string[]>): React.Node => {
    switch (request.status) {
      case "pending":
        return (
          <>
            <StyledTagItem placeholder size={3} />
            <StyledTagItem placeholder size={2} />
            <StyledTagItem placeholder size={4} />
            <StyledTagItem placeholder size={3} />
            <StyledTagItem placeholder size={3} />
            <StyledTagItem placeholder size={2} />
            <StyledTagItem placeholder size={3} />
            <StyledTagItem placeholder size={2} />
            <StyledTagItem placeholder size={4} />
            <StyledTagItem placeholder size={2} />
            <StyledTagItem placeholder size={3} />
            <StyledTagItem placeholder size={3} />
            <StyledTagItem placeholder size={4} />
            <StyledTagItem placeholder size={3} />
          </>
        );

      case "error":
        return <StyledTagLoadingError />;

      case "success":
        const tags = request.data;

        return tags.map(tag => (
          <StyledTagItem
            key={tag}
            name={tag}
            testId={`tag-${tag}`}
            onClick={this.handleTagClick(tag)}
          />
        ));

      default:
        throw new Error("invalid status");
    }
  };
}

export default Home;
