// @flow

import * as React from "react";
import cn from "classnames";
import Request from "../Request";
import type { RequestData } from "../Request";
import Banner from "./Banner";
import { Tags, TagItem } from "./Tags";
import { Tabs, TabItem } from "../Tabs";
import Pagination from "../Pagination";
import ArticlePreview from "../ArticlePreview";
import Separator from "../Separator";
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
  focusNode: ?HTMLElement = null;

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
              <Request load={api.listTags}>{this.renderTags}</Request>
            </Tags>
          </div>
        </div>
      </>
    );
  }

  renderTabs() {
    const { currentUser } = this.props;
    const { route } = this.state;

    return (
      <Tabs className={cn("mb4")}>
        {currentUser ? (
          <TabItem
            data-testid="my-feed"
            current={route.type === "my"}
            onClick={this.handleMyFeedClick}
          >
            Your Feed
          </TabItem>
        ) : null}

        <TabItem
          data-testid="global-feed"
          current={route.type === "global"}
          onClick={this.handleGlobalFeedClick}
        >
          Global Feed
        </TabItem>

        {route.type === "tag" ? <TabItem current>#{route.tag}</TabItem> : null}
      </Tabs>
    );
  }

  renderArticles = (request: RequestData<api.ListArticlesResp>) => {
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
  };

  renderTags = (request: RequestData<string[]>): React.Node => {
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
        const tags = request.data;

        return tags.map(tag => (
          <TagItem key={tag} name={tag} onClick={this.handleTagClick(tag)} />
        ));

      default:
        throw new Error("invalid status");
    }
  };
}

export default Home;
