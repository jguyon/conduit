// @flow

import * as React from "react";
import cn from "classnames";
import * as api from "../api";
import Request from "../Request";
import type { RequestData } from "../Request";
import Banner from "./Banner";
import { Tags, TagItem } from "./Tags";
import { Tabs, TabItem } from "../Tabs";
import Pagination from "../Pagination";
import ArticlePreview from "../ArticlePreview";
import Separator from "../Separator";

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
  focusNode: ?HTMLElement = null;

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

  componentDidUpdate(_prevProps: HomeProps, prevState: HomeState) {
    const nextState = this.state;

    if (
      this.focusNode &&
      (nextState.page !== prevState.page || nextState.route !== prevState.route)
    ) {
      this.focusNode.focus();
    }
  }

  render() {
    return (
      <>
        <Banner />

        <div
          tabIndex="-1"
          role="group"
          ref={node => (this.focusNode = node)}
          className={cn("outline-0", "container", "mh-auto", "mv4")}
        >
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
      <Tabs className={cn("mb4")}>
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
        return (
          <>
            <ArticlePreview placeholder />
            <Separator className={cn("mv4")} />
            <ArticlePreview placeholder />
            <Separator className={cn("mv4")} />
            <ArticlePreview placeholder />
            <Separator className={cn("mv4")} />
            <ArticlePreview placeholder />
            <Separator className={cn("mv4")} />
            <ArticlePreview placeholder />
            <Separator className={cn("mv4")} />
            <ArticlePreview placeholder />
            <Separator className={cn("mv4")} />
            <ArticlePreview placeholder />
            <Separator className={cn("mv4")} />
            <ArticlePreview placeholder />
            <Separator className={cn("mv4")} />
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
  };

  renderTags = (request: RequestData<api.ListTags>): React.Node => {
    switch (request.status) {
      case "pending":
        return (
          <>
            <TagItem placeholder size={3} />
            <TagItem placeholder size={2} />
            <TagItem placeholder size={4} />
            <TagItem placeholder size={3} />
            <TagItem placeholder size={3} />
            <TagItem placeholder size={2} />
            <TagItem placeholder size={3} />
            <TagItem placeholder size={2} />
            <TagItem placeholder size={4} />
            <TagItem placeholder size={2} />
            <TagItem placeholder size={3} />
            <TagItem placeholder size={3} />
            <TagItem placeholder size={4} />
            <TagItem placeholder size={3} />
          </>
        );

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
