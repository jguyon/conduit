// @flow

import * as React from "react";
import * as testing from "react-testing-library";
import "jest-dom/extend-expect";
import Home from ".";
import type { ListArticles, Article } from "../api";

afterEach(testing.cleanup);

const makeArticle = (name: string): Article => ({
  slug: name,
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
  const rendered = testing.render(
    <Home
      listArticles={() =>
        Promise.resolve({
          articlesCount: 2,
          articles: [makeArticle("one"), makeArticle("two")]
        })
      }
    />
  );

  await testing.wait(() => {
    rendered.getByTestId("article-one");
    rendered.getByTestId("article-two");
  });
});

test("supports changing pages", async () => {
  const rendered = testing.render(
    <Home
      listArticles={({ page, perPage }) => {
        expect(perPage).toEqual(10);

        if (page === 1) {
          return Promise.resolve({
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
        } else if (page === 2) {
          return Promise.resolve({
            articlesCount: 12,
            articles: [makeArticle("eleven"), makeArticle("twelve")]
          });
        } else {
          throw new Error(`unavailable page ${page}`);
        }
      }}
    />
  );

  await testing.wait(() => {
    rendered.getByTestId("article-ten");
    expect(rendered.queryByTestId("article-eleven")).toEqual(null);
  });

  testing.fireEvent.click(rendered.getByTestId("articles-page-2"));

  await testing.wait(() => {
    rendered.getByTestId("article-eleven");
    expect(rendered.queryByTestId("article-ten")).toEqual(null);
  });

  testing.fireEvent.click(rendered.getByTestId("articles-page-1"));

  await testing.wait(() => {
    rendered.getByTestId("article-ten");
    expect(rendered.queryByTestId("article-eleven")).toEqual(null);
  });
});
