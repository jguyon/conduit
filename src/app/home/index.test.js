// @flow

import * as React from "react";
import * as testing from "react-testing-library";
import "jest-dom/extend-expect";
import Home from ".";
import * as api from "../../lib/api";

const listArticles = jest.spyOn(api, "listArticles");
const listFeedArticles = jest.spyOn(api, "listFeedArticles");
const listTags = jest.spyOn(api, "listTags");

afterEach(() => {
  testing.cleanup();
  listArticles.mockReset();
  listFeedArticles.mockReset();
  listTags.mockReset();
});

const user: api.User = {
  username: "johndoe",
  email: "john@doe.com",
  bio: null,
  image: null,
  token: "abcd"
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

  const rendered = testing.render(<Home currentUser={null} />);

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

test("supports switching to global feed", async () => {
  listArticles.mockImplementation(({ page, tag }) => {
    if (tag) {
      return Promise.resolve(makePaginatedList(page));
    } else {
      return Promise.resolve(makeArticleList("untagged"));
    }
  });
  listTags.mockReturnValue(Promise.resolve(["one"]));

  const rendered = testing.render(<Home currentUser={null} />);

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

test("supports changing pages on global feed", async () => {
  listArticles.mockImplementation(({ page }) =>
    Promise.resolve(makePaginatedList(page))
  );
  listTags.mockReturnValue(Promise.resolve([]));

  const rendered = testing.render(<Home currentUser={null} />);

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

test("renders user feed", async () => {
  listFeedArticles.mockReturnValue(
    Promise.resolve(makeArticleList("one", "two"))
  );
  listTags.mockReturnValue(Promise.resolve([]));

  const rendered = testing.render(<Home currentUser={user} />);

  expect(listFeedArticles).toHaveBeenCalledTimes(1);
  expect(listFeedArticles).toHaveBeenLastCalledWith({
    page: 1,
    perPage: 10,
    token: user.token
  });

  await testing.wait(() => {
    rendered.getByTestId("article-one");
    rendered.getByTestId("article-two");
  });
});

test("supports switching to user feed", async () => {
  listArticles.mockImplementation(({ page }) =>
    Promise.resolve(makePaginatedList(page))
  );
  listFeedArticles.mockReturnValue(
    Promise.resolve(makeArticleList("untagged"))
  );
  listTags.mockReturnValue(Promise.resolve(["one"]));

  const rendered = testing.render(<Home currentUser={user} />);

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

  testing.fireEvent.click(rendered.getByTestId("my-feed"));

  expect(listFeedArticles).toHaveBeenCalledTimes(2);
  expect(listFeedArticles).toHaveBeenLastCalledWith({
    page: 1,
    perPage: 10,
    token: user.token
  });

  await testing.wait(() => {
    rendered.getByTestId("article-untagged");
  });
});

test("supports switching pages on user feed", async () => {
  listFeedArticles.mockImplementation(({ page }) =>
    Promise.resolve(makePaginatedList(page))
  );
  listTags.mockReturnValue(Promise.resolve([]));

  const rendered = testing.render(<Home currentUser={user} />);

  expect(listFeedArticles).toHaveBeenCalledTimes(1);
  expect(listFeedArticles).toHaveBeenLastCalledWith({
    page: 1,
    perPage: 10,
    token: user.token
  });

  await testing.wait(() => {
    rendered.getByTestId("article-ten");
    expect(rendered.queryByTestId("article-eleven")).toEqual(null);
  });

  testing.fireEvent.click(rendered.getByTestId("articles-page-2"));

  expect(listFeedArticles).toHaveBeenCalledTimes(2);
  expect(listFeedArticles).toHaveBeenLastCalledWith({
    page: 2,
    perPage: 10,
    token: user.token
  });

  await testing.wait(() => {
    rendered.getByTestId("article-eleven");
    expect(rendered.queryByTestId("article-ten")).toEqual(null);
  });

  testing.fireEvent.click(rendered.getByTestId("articles-page-1"));

  expect(listFeedArticles).toHaveBeenCalledTimes(3);
  expect(listFeedArticles).toHaveBeenLastCalledWith({
    page: 1,
    perPage: 10,
    token: user.token
  });

  await testing.wait(() => {
    rendered.getByTestId("article-ten");
    expect(rendered.queryByTestId("article-eleven"));
  });
});

test("renders popular tags", async () => {
  listArticles.mockReturnValue(Promise.resolve(makeArticleList()));
  listTags.mockReturnValue(Promise.resolve(["one", "two"]));

  const rendered = testing.render(<Home currentUser={null} />);

  expect(listTags).toHaveBeenCalledTimes(1);
  expect(listTags).toHaveBeenLastCalledWith();

  await testing.wait(() => {
    rendered.getByTestId("tag-one");
    rendered.getByTestId("tag-two");
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

  const rendered = testing.render(<Home currentUser={null} />);

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

  const rendered = testing.render(<Home currentUser={null} />);

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
