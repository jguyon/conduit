// @flow

import * as React from "react";
import * as testing from "react-testing-library";
import "jest-dom/extend-expect";
import Home from ".";
import * as api from "../api";

const listArticles = jest.spyOn(api, "listArticles");
const listTags = jest.spyOn(api, "listTags");

afterEach(() => {
  testing.cleanup();
  listArticles.mockReset();
  listTags.mockReset();
});

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
    image: null,
    following: false
  }
});

const makeArticleList = (...names: string[]): api.ListArticlesResp => ({
  articlesCount: names.length,
  articles: names.map(makeArticle)
});

const makePaginatedList = (page: number): api.ListArticlesResp => {
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

test("renders global feed", async () => {
  listArticles.mockReturnValue(Promise.resolve(makeArticleList("one", "two")));
  listTags.mockReturnValue(Promise.resolve([]));

  const rendered = testing.render(<Home />);

  expect(listArticles).toHaveBeenCalledTimes(1);
  expect(listArticles).toHaveBeenLastCalledWith({
    page: 1,
    perPage: 10
  });

  await testing.wait(() => {
    rendered.getByTestId("article-one");
    rendered.getByTestId("article-two");
  });
});

test("renders popular tags", async () => {
  listArticles.mockReturnValue(Promise.resolve(makeArticleList()));
  listTags.mockReturnValue(Promise.resolve(["one", "two"]));

  const rendered = testing.render(<Home />);

  expect(listTags).toHaveBeenCalledTimes(1);
  expect(listTags).toHaveBeenLastCalledWith();

  await testing.wait(() => {
    rendered.getByTestId("tag-one");
    rendered.getByTestId("tag-two");
  });
});

test("supports changing pages on global feed", async () => {
  listArticles.mockImplementation(({ page }) =>
    Promise.resolve(makePaginatedList(page))
  );
  listTags.mockReturnValue(Promise.resolve([]));

  const rendered = testing.render(<Home />);

  expect(listArticles).toHaveBeenCalledTimes(1);
  expect(listArticles).toHaveBeenLastCalledWith({
    page: 1,
    perPage: 10
  });

  await testing.wait(() => {
    rendered.getByTestId("article-ten");
    expect(rendered.queryByTestId("article-eleven")).toEqual(null);
  });

  testing.fireEvent.click(rendered.getByTestId("articles-page-2"));

  expect(listArticles).toHaveBeenCalledTimes(2);
  expect(listArticles).toHaveBeenLastCalledWith({
    page: 2,
    perPage: 10
  });

  await testing.wait(() => {
    rendered.getByTestId("article-eleven");
    expect(rendered.queryByTestId("article-ten")).toEqual(null);
  });

  testing.fireEvent.click(rendered.getByTestId("articles-page-1"));

  expect(listArticles).toHaveBeenCalledTimes(3);
  expect(listArticles).toHaveBeenLastCalledWith({
    page: 1,
    perPage: 10
  });

  await testing.wait(() => {
    rendered.getByTestId("article-ten");
    expect(rendered.queryByTestId("article-eleven")).toEqual(null);
  });
});

test("supports switching to tag feed", async () => {
  listArticles.mockImplementation(({ tag, page }) => {
    if (tag) {
      return Promise.resolve(makeArticleList("tagged"));
    } else {
      return Promise.resolve(makePaginatedList(page));
    }
  });
  listTags.mockReturnValue(Promise.resolve(["one"]));

  const rendered = testing.render(<Home />);

  await testing.wait(() => {
    rendered.getByTestId("article-one");
  });

  testing.fireEvent.click(rendered.getByTestId("articles-page-2"));

  await testing.wait(() => {
    rendered.getByTestId("article-eleven");
  });

  const tag = await testing.waitForElement(() =>
    rendered.getByTestId("tag-one")
  );

  testing.fireEvent.click(tag);

  expect(listArticles).toHaveBeenCalledTimes(3);
  expect(listArticles).toHaveBeenLastCalledWith({
    page: 1,
    perPage: 10,
    tag: "one"
  });

  await testing.wait(() => {
    rendered.getByTestId("article-tagged");
  });
});

test("supports changing pages on tag feed", async () => {
  listArticles.mockImplementation(({ page, tag }) => {
    if (tag) {
      return Promise.resolve(makePaginatedList(page));
    } else {
      return Promise.resolve(makeArticleList());
    }
  });
  listTags.mockReturnValue(Promise.resolve(["one"]));

  const rendered = testing.render(<Home />);

  const tag = await testing.waitForElement(() =>
    rendered.getByTestId("tag-one")
  );

  testing.fireEvent.click(tag);

  expect(listArticles).toHaveBeenCalledTimes(2);
  expect(listArticles).toHaveBeenLastCalledWith({
    page: 1,
    perPage: 10,
    tag: "one"
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
    tag: "one"
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
    tag: "one"
  });

  await testing.wait(() => {
    rendered.getByTestId("article-ten");
    expect(rendered.queryByTestId("article-eleven")).toEqual(null);
  });
});

test("supports switching back to global feed", async () => {
  listArticles.mockImplementation(({ page, tag }) => {
    if (tag) {
      return Promise.resolve(makePaginatedList(page));
    } else {
      return Promise.resolve(makeArticleList("untagged"));
    }
  });
  listTags.mockReturnValue(Promise.resolve(["one"]));

  const rendered = testing.render(<Home />);

  const tag = await testing.waitForElement(() =>
    rendered.getByTestId("tag-one")
  );

  testing.fireEvent.click(tag);

  await testing.wait(() => {
    rendered.getByTestId("article-one");
  });

  testing.fireEvent.click(rendered.getByTestId("articles-page-2"));

  await testing.wait(() => {
    rendered.getByTestId("article-eleven");
  });

  testing.fireEvent.click(rendered.getByTestId("global-feed"));

  expect(listArticles).toHaveBeenCalledTimes(4);
  expect(listArticles).toHaveBeenLastCalledWith({
    page: 1,
    perPage: 10
  });

  await testing.wait(() => {
    rendered.getByTestId("article-untagged");
  });
});
