// @flow

import * as React from "react";
import * as testing from "react-testing-library";
import "jest-dom/extend-expect";
import * as api from "../api";
import Profile from ".";

afterEach(testing.cleanup);

const profile: api.Profile = {
  username: "johndoe",
  bio: null,
  image: "",
  following: false
};

const makeArticle = (name: string): api.Article => ({
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

const makeArticleList = (...names: string[]): api.ListArticles => ({
  articlesCount: names.length,
  articles: names.map(makeArticle)
});

const makePaginatedList = (page: number): api.ListArticles => {
  if (page === 1) {
    return {
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
    };
  } else if (page === 2) {
    return {
      articlesCount: 12,
      articles: [makeArticle("eleven"), makeArticle("twelve")]
    };
  } else {
    throw new Error(`invalid page ${page}`);
  }
};

test("renders the profile", async () => {
  const getProfile = jest.fn(() => Promise.resolve({ profile }));

  const rendered = testing.render(
    <Profile
      username="johndoe"
      getProfile={getProfile}
      listArticles={() => Promise.resolve(makeArticleList())}
    />
  );

  expect(getProfile).toHaveBeenCalledTimes(1);
  expect(getProfile).toHaveBeenLastCalledWith("johndoe");

  await testing.wait(() => {
    rendered.getByText("johndoe");
  });
});

test("renders authored feed", async () => {
  const listArticles = jest.fn(() =>
    Promise.resolve(makeArticleList("one", "two"))
  );

  const rendered = testing.render(
    <Profile
      username="johndoe"
      getProfile={() => Promise.resolve({ profile })}
      listArticles={listArticles}
    />
  );

  expect(listArticles).toHaveBeenCalledTimes(1);
  expect(listArticles).toHaveBeenLastCalledWith({
    author: "johndoe",
    page: 1,
    perPage: 10
  });

  await testing.wait(() => {
    rendered.getByTestId("article-one");
    rendered.getByTestId("article-two");
  });
});

test("supports changing pages on authored feed", async () => {
  const listArticles = jest.fn(({ page }) =>
    Promise.resolve(makePaginatedList(page))
  );

  const rendered = testing.render(
    <Profile
      username="johndoe"
      getProfile={() => Promise.resolve({ profile })}
      listArticles={listArticles}
    />
  );

  expect(listArticles).toHaveBeenCalledTimes(1);
  expect(listArticles).toHaveBeenLastCalledWith({
    page: 1,
    perPage: 10,
    author: "johndoe"
  });

  await testing.wait(() => {
    rendered.getByTestId("article-ten");
    expect(rendered.queryByTestId("article-eleven")).toEqual(null);
  });

  testing.fireEvent.click(rendered.getByTestId("articles-page-2"));

  expect(listArticles).toHaveBeenCalledTimes(2);
  expect(listArticles).toHaveBeenLastCalledWith({
    page: 2,
    perPage: 10,
    author: "johndoe"
  });

  await testing.wait(() => {
    rendered.getByTestId("article-eleven");
    expect(rendered.queryByTestId("article-ten")).toEqual(null);
  });

  testing.fireEvent.click(rendered.getByTestId("articles-page-1"));

  expect(listArticles).toHaveBeenCalledTimes(3);
  expect(listArticles).toHaveBeenLastCalledWith({
    page: 1,
    perPage: 10,
    author: "johndoe"
  });

  await testing.wait(() => {
    rendered.getByTestId("article-ten");
    expect(rendered.queryByTestId("article-eleven")).toEqual(null);
  });
});

test("supports switching to favorited feed", async () => {
  const listArticles = jest.fn(({ page, author }) => {
    if (author) {
      return Promise.resolve(makePaginatedList(page));
    } else {
      return Promise.resolve(makeArticleList("favorited"));
    }
  });

  const rendered = testing.render(
    <Profile
      username="johndoe"
      getProfile={() => Promise.resolve({ profile })}
      listArticles={listArticles}
    />
  );

  await testing.wait(() => {
    rendered.getByTestId("article-one");
  });

  testing.fireEvent.click(rendered.getByTestId("articles-page-2"));

  await testing.wait(() => {
    rendered.getByTestId("article-eleven");
  });

  testing.fireEvent.click(rendered.getByTestId("favorited-feed"));

  expect(listArticles).toHaveBeenCalledTimes(3);
  expect(listArticles).toHaveBeenLastCalledWith({
    page: 1,
    perPage: 10,
    favorited: "johndoe"
  });

  await testing.wait(() => {
    rendered.getByTestId("article-favorited");
  });
});

test("supports changing pages on favorited feed", async () => {
  const listArticles = jest.fn(({ author, page }) => {
    if (author) {
      return Promise.resolve(makeArticleList());
    } else {
      return Promise.resolve(makePaginatedList(page));
    }
  });

  const rendered = testing.render(
    <Profile
      username="johndoe"
      getProfile={() => Promise.resolve({ profile })}
      listArticles={listArticles}
    />
  );

  testing.fireEvent.click(rendered.getByTestId("favorited-feed"));

  expect(listArticles).toHaveBeenCalledTimes(2);
  expect(listArticles).toHaveBeenLastCalledWith({
    page: 1,
    perPage: 10,
    favorited: "johndoe"
  });

  await testing.wait(() => {
    rendered.getByTestId("article-ten");
    expect(rendered.queryByTestId("article-eleven")).toEqual(null);
  });

  testing.fireEvent.click(rendered.getByTestId("articles-page-2"));

  expect(listArticles).toHaveBeenCalledTimes(3);
  expect(listArticles).toHaveBeenLastCalledWith({
    page: 2,
    perPage: 10,
    favorited: "johndoe"
  });

  await testing.wait(() => {
    rendered.getByTestId("article-eleven");
    expect(rendered.queryByTestId("article-ten")).toEqual(null);
  });

  testing.fireEvent.click(rendered.getByTestId("articles-page-1"));

  expect(listArticles).toHaveBeenCalledTimes(4);
  expect(listArticles).toHaveBeenLastCalledWith({
    page: 1,
    perPage: 10,
    favorited: "johndoe"
  });

  await testing.wait(() => {
    rendered.getByTestId("article-ten");
    expect(rendered.queryByTestId("article-eleven")).toEqual(null);
  });
});

test("supports switching back to authored feed", async () => {
  const listArticles = jest.fn(({ author, page }) => {
    if (author) {
      return Promise.resolve(makeArticleList("authored"));
    } else {
      return Promise.resolve(makePaginatedList(page));
    }
  });

  const rendered = testing.render(
    <Profile
      username="johndoe"
      getProfile={() => Promise.resolve({ profile })}
      listArticles={listArticles}
    />
  );

  testing.fireEvent.click(rendered.getByTestId("favorited-feed"));

  await testing.wait(() => {
    rendered.getByTestId("article-one");
  });

  testing.fireEvent.click(rendered.getByTestId("articles-page-2"));

  await testing.wait(() => {
    rendered.getByTestId("article-eleven");
  });

  testing.fireEvent.click(rendered.getByTestId("authored-feed"));

  expect(listArticles).toHaveBeenCalledTimes(4);
  expect(listArticles).toHaveBeenLastCalledWith({
    page: 1,
    perPage: 10,
    author: "johndoe"
  });

  await testing.wait(() => {
    rendered.getByTestId("article-authored");
  });
});
