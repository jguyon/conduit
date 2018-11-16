// @flow

import * as React from "react";
import cn from "classnames";
import * as api from "../api";
import Request from "../Request";
import type { RequestData } from "../Request";
import Banner from "./Banner";
import { Tabs, TabItem } from "./Tabs";
import Pagination from "./Pagination";
import ArticlePreview from "./ArticlePreview";
import ArticleSeparator from "./ArticleSeparator";
import { Tags, TagItem } from "./Tags";

type HomeProps = {|
  listArticles: typeof api.listArticles,
  listTags: typeof api.listTags
|};

type HomeState = {|
  page: number,
  route:
    | {| type: "global" |}
    | {|
        type: "tag",
        tag: string
      |}
|};

class Home extends React.Component<HomeProps, HomeState> {
  state = {
    page: 1,
    route: { type: "global" }
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

    switch (route.type) {
      case "global":
        return this.props.listArticles(opts);

      case "tag":
        return this.props.listArticles({
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

  render() {
    return (
      <>
        <Banner />

        <div className={cn("container", "mh-auto", "mv4")}>
          <div className={cn("fl", "pr3", "w-70")}>
            {this.renderTabs()}

            <Request load={() => this.loadArticles()}>
              {this.renderArticles}
            </Request>
          </div>

          <div className={cn("fl", "pl3", "w-30")}>
            <Tags>
              <Request load={this.props.listTags}>{this.renderTags}</Request>
            </Tags>
          </div>
        </div>
      </>
    );
  }

  renderTabs() {
    const { route } = this.state;

    return (
      <Tabs>
        <TabItem
          data-testid="global-feed"
          current={route.type === "global"}
          onClick={this.handleGlobalFeedClick}
        >
          Global feed
        </TabItem>

        {route.type === "tag" ? <TabItem current>#{route.tag}</TabItem> : null}
      </Tabs>
    );
  }

  renderArticles = (request: RequestData<api.ListArticles>) => {
    switch (request.status) {
      case "pending":
        return <div className={cn("moon-gray")}>Loading articles...</div>;

      case "error":
        return <div className={cn("red")}>Error loading articles!</div>;

      case "success":
        const { articles, articlesCount } = request.data;

        const articleElements = articles.map((article, i) => (
          <React.Fragment key={article.slug}>
            <ArticlePreview article={article} />
            {i === articles.length - 1 ? null : <ArticleSeparator />}
          </React.Fragment>
        ));

        const paginationElement = (
          <Pagination
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

  renderTags = (request: RequestData<api.ListTags>): React.Node => {
    switch (request.status) {
      case "pending":
        return <div className={cn("f6", "light-silver")}>Loading tags...</div>;

      case "error":
        return <div className={cn("f6", "red")}>Error loading tags!</div>;

      case "success":
        return request.data.tags.map(tag => (
          <TagItem key={tag} name={tag} onClick={this.handleTagClick(tag)} />
        ));

      default:
        throw new Error("invalid status");
    }
  };
}

export default Home;
