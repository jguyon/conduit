// @flow

import * as React from "react";
import * as testing from "react-testing-library";
import "jest-dom/extend-expect";
import Home from "./Home";
import type { ListArticles } from "./api";

afterEach(testing.cleanup);

const articles: ListArticles = {
  articlesCount: 2,
  articles: [
    {
      slug: "article-one",
      title: "Article One",
      description: "This is the first article",
      body: "This is the first article",
      tagList: ["one"],
      createdAt: new Date().toJSON(),
      updatedAt: new Date().toJSON(),
      favorited: false,
      favoritesCount: 3,
      author: {
        username: "user-one",
        bio: null,
        image: "",
        following: false
      }
    },
    {
      slug: "article-two",
      title: "Article Two",
      description: "This is the second article",
      body: "This is the second article",
      tagList: ["two"],
      createdAt: new Date().toJSON(),
      updatedAt: new Date().toJSON(),
      favorited: false,
      favoritesCount: 2,
      author: {
        username: "user-two",
        bio: null,
        image: "",
        following: false
      }
    }
  ]
};

test("renders the articles", async () => {
  const resolvedArticles = Promise.resolve(articles);
  const rendered = testing.render(
    <Home listArticles={() => resolvedArticles} />
  );

  await resolvedArticles;

  expect(rendered.getByTestId("article-title-article-one")).toHaveTextContent(
    "Article One"
  );
  expect(rendered.getByTestId("article-title-article-two")).toHaveTextContent(
    "Article Two"
  );
});
