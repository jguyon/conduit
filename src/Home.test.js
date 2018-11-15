// @flow

import * as React from "react";
import * as testing from "react-testing-library";
import "jest-dom/extend-expect";
import Home from "./Home";
import type { ListArticles, Article } from "./api";

afterEach(testing.cleanup);

const makeArticle = (name: string): Article => ({
  slug: `article-${name}`,
  title: `Article ${name}`,
  description: `This is the description of article ${name}`,
  body: `This is the body of article ${name}`,
  tagList: [name],
  createdAt: new Date().toJSON(),
  updatedAt: new Date().toJSON(),
  favorited: false,
  favoritesCount: 3,
  author: {
    username: `user-${name}`,
    bio: null,
    image: "",
    following: false
  }
});

test("renders the articles", async () => {
  const articles: Promise<ListArticles> = Promise.resolve({
    articlesCount: 2,
    articles: [makeArticle("one"), makeArticle("two")]
  });

  const rendered = testing.render(<Home listArticles={() => articles} />);

  await articles;

  expect(rendered.getByTestId("article-title-article-one")).toHaveTextContent(
    "Article one"
  );
  expect(rendered.getByTestId("article-title-article-two")).toHaveTextContent(
    "Article two"
  );
});

test("supports changing pages", async () => {
  const pageOne: Promise<ListArticles> = Promise.resolve({
    articlesCount: 12,
    articles: [
      makeArticle("one"),
      makeArticle("two"),
      makeArticle("three"),
      makeArticle("four"),
      makeArticle("five"),
      makeArticle("six"),
      makeArticle("seven"),
      makeArticle("eight"),
      makeArticle("nine"),
      makeArticle("ten")
    ]
  });

  const pageTwo: Promise<ListArticles> = Promise.resolve({
    articlesCount: 12,
    articles: [makeArticle("eleven"), makeArticle("twelve")]
  });

  const rendered = testing.render(
    <Home
      listArticles={({ page, perPage }) => {
        expect(perPage).toEqual(10);

        if (page === 1) {
          return pageOne;
        } else if (page === 2) {
          return pageTwo;
        } else {
          throw new Error(`unavailable page ${page}`);
        }
      }}
    />
  );

  await pageOne;

  expect(rendered.getByTestId("article-title-article-one")).toHaveTextContent(
    "Article one"
  );

  testing.fireEvent.click(rendered.getByTestId("articles-page-2"));

  await pageTwo;

  expect(
    rendered.getByTestId("article-title-article-eleven")
  ).toHaveTextContent("Article eleven");
});
