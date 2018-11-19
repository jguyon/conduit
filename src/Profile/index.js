// @flow

import * as React from "react";
import cn from "classnames";
import Request from "../Request";
import type { RequestData } from "../Request";
import Banner from "./Banner";
import { Tabs, TabItem } from "../Tabs";
import ArticlePreview from "../ArticlePreview";
import Separator from "../Separator";
import Pagination from "../Pagination";
import NotFound from "../NotFound";
import * as api from "../api";

type ProfileArticlesProps = {|
  username: string,
  listArticles: typeof api.listArticles
|};

type ProfileArticlesState = {|
  page: number,
  route: "authored" | "favorited"
|};

class ProfileArticles extends React.Component<
  ProfileArticlesProps,
  ProfileArticlesState
> {
  focusNode: ?HTMLElement = null;

  state = {
    page: 1,
    route: "authored"
  };

  setPage = (page: number) => {
    this.setState({ page });
  };

  loadArticles() {
    const { page, route } = this.state;

    const opts = {
      page,
      perPage: 10
    };

    switch (route) {
      case "authored":
        return this.props.listArticles({
          ...opts,
          author: this.props.username
        });

      case "favorited":
        return this.props.listArticles({
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
    _prevProps: ProfileArticlesProps,
    prevState: ProfileArticlesState
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
    nextProps: ProfileArticlesProps,
    nextState: ProfileArticlesState
  ) {
    const prevProps = this.props;
    const prevState = this.state;

    return (
      nextProps.username !== prevProps.username ||
      nextProps.listArticles !== prevProps.listArticles ||
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

  renderArticles(request: RequestData<api.ListArticles>) {
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
        const { articles, articlesCount } = request.data;

        const articleElements = articles.map((article, i) => (
          <React.Fragment key={article.slug}>
            <ArticlePreview
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

type ProfileProps = {|
  username: string,
  getProfile: typeof api.getProfile,
  listArticles: typeof api.listArticles
|};

class Profile extends React.PureComponent<ProfileProps> {
  render() {
    return (
      <Request load={() => this.props.getProfile(this.props.username)}>
        {request => {
          switch (request.status) {
            case "pending":
              return (
                <>
                  <Banner placeholder />
                  <ProfileArticles
                    username={this.props.username}
                    listArticles={this.props.listArticles}
                  />
                </>
              );

            case "error":
              return <NotFound />;

            case "success":
              const { profile } = request.data;

              return (
                <>
                  <Banner profile={profile} />
                  <ProfileArticles
                    username={this.props.username}
                    listArticles={this.props.listArticles}
                  />
                </>
              );

            default:
              throw new Error("invalid status");
          }
        }}
      </Request>
    );
  }
}

export default Profile;
