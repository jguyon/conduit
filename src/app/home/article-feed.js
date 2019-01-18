// @flow

import * as React from "react";
import Request from "../request";
import {
  StyledContainerMain,
  StyledTabs,
  StyledTabItem,
  StyledArticlesLoadingError,
  StyledArticleSeparator,
  StyledPagination
} from "./styles";
import ArticlePreview from "../article-preview";
import * as api from "../../lib/api";

type ArticleFeedProps = {|
  currentUser: ?api.User,
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
      |},
  setPage: number => void,
  onGlobalFeedClick: () => void,
  onMyFeedClick: () => void
|};

const ArticleFeed = React.memo<ArticleFeedProps>(props => (
  <StyledContainerMain>
    <StyledTabs>
      {props.currentUser ? (
        <StyledTabItem
          testId="my-feed"
          current={props.route.type === "my"}
          onClick={props.onMyFeedClick}
        >
          Your Feed
        </StyledTabItem>
      ) : null}

      <StyledTabItem
        testId="global-feed"
        current={props.route.type === "global"}
        onClick={props.onGlobalFeedClick}
      >
        Global Feed
      </StyledTabItem>

      {props.route.type === "tag" ? (
        <StyledTabItem current>#{props.route.tag}</StyledTabItem>
      ) : null}
    </StyledTabs>

    <Request
      load={() => {
        const { currentUser, page, route } = props;

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
      }}
    >
      {request => {
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
            return <StyledArticlesLoadingError />;

          case "success":
            const { currentUser, page, setPage } = props;
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
                setPage={setPage}
                currentPage={page}
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
      }}
    </Request>
  </StyledContainerMain>
));

export default ArticleFeed;
