// @flow

import * as React from "react";
import cn from "classnames";
import * as api from "../api";
import Request from "../Request";
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
        <Banner />

        <div className={cn("container", "mh-auto", "mv4")}>
          <div className={cn("fl", "pr3", "w-70")}>
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
                        {articles.map((article, i) => (
                          <React.Fragment key={article.slug}>
                            <ArticlePreview article={article} />
                            {i === articles.length - 1 ? null : (
                              <ArticleSeparator />
                            )}
                          </React.Fragment>
                        ))}

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

          <div className={cn("fl", "pl3", "w-30")}>
            <Tags>
              <Request load={this.props.listTags}>
                {request => {
                  switch (request.status) {
                    case "pending":
                      return (
                        <div className={cn("f6", "light-silver")}>
                          Loading tags...
                        </div>
                      );

                    case "error":
                      return (
                        <div className={cn("f6", "red")}>
                          Error loading tags!
                        </div>
                      );

                    case "success":
                      return request.data.tags.map(tag => (
                        <TagItem key={tag} name={tag} onClick={() => {}} />
                      ));

                    default:
                      throw new Error("invalid status");
                  }
                }}
              </Request>
            </Tags>
          </div>
        </div>
      </>
    );
  }
}

export default Home;
