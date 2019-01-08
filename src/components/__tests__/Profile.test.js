// @flow

import * as React from "react";
import * as testing from "react-testing-library";
import "jest-dom/extend-expect";
import Profile from "../Profile";
import * as api from "../../lib/api";

const getProfile = jest.spyOn(api, "getProfile");
const listArticles = jest.spyOn(api, "listArticles");
const followUser = jest.spyOn(api, "followUser");
const unfollowUser = jest.spyOn(api, "unfollowUser");

beforeEach(() => {
  window.history.pushState(null, "", "/profile/johndoe");
});

afterEach(() => {
  testing.cleanup();
  getProfile.mockReset();
  listArticles.mockReset();
  followUser.mockReset();
  unfollowUser.mockReset();
});

const profile: api.Profile = {
  username: "johndoe",
  bio: null,
  image: null,
  following: false
};

const user: api.User = {
  email: "jane@doe.com",
  username: "janedoe",
  bio: null,
  image: null,
  follow: false,
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

test("renders the profile", async () => {
  getProfile.mockReturnValue(Promise.resolve(profile));
  listArticles.mockReturnValue(Promise.resolve(makeArticleList()));

  const rendered = testing.render(
    <Profile username="johndoe" currentUser={null} />
  );

  expect(getProfile).toHaveBeenCalledTimes(1);
  expect(getProfile).toHaveBeenLastCalledWith({ username: "johndoe" });

  await testing.wait(() => {
    rendered.getByText("johndoe");
  });
});

test("renders authored feed", async () => {
  getProfile.mockReturnValue(Promise.resolve(profile));
  listArticles.mockReturnValue(Promise.resolve(makeArticleList("one", "two")));

  const rendered = testing.render(
    <Profile username="johndoe" currentUser={null} />
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
  getProfile.mockReturnValue(Promise.resolve(profile));
  listArticles.mockImplementation(({ page }) =>
    Promise.resolve(makePaginatedList(page))
  );

  const rendered = testing.render(
    <Profile username="johndoe" currentUser={null} />
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
  getProfile.mockReturnValue(Promise.resolve(profile));
  listArticles.mockImplementation(({ page, author }) => {
    if (author) {
      return Promise.resolve(makePaginatedList(page));
    } else {
      return Promise.resolve(makeArticleList("favorited"));
    }
  });

  const rendered = testing.render(
    <Profile username="johndoe" currentUser={null} />
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
  getProfile.mockReturnValue(Promise.resolve(profile));
  listArticles.mockImplementation(({ author, page }) => {
    if (author) {
      return Promise.resolve(makeArticleList());
    } else {
      return Promise.resolve(makePaginatedList(page));
    }
  });

  const rendered = testing.render(
    <Profile username="johndoe" currentUser={null} />
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
  getProfile.mockReturnValue(Promise.resolve(profile));
  listArticles.mockImplementation(({ author, page }) => {
    if (author) {
      return Promise.resolve(makeArticleList("authored"));
    } else {
      return Promise.resolve(makePaginatedList(page));
    }
  });

  const rendered = testing.render(
    <Profile username="johndoe" currentUser={null} />
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

test("does not follow user while logged out", async () => {
  getProfile.mockReturnValue(Promise.resolve(profile));
  listArticles.mockReturnValue(Promise.resolve(makeArticleList()));

  const rendered = testing.render(
    <Profile username="johndoe" currentUser={null} />
  );

  const follow = await testing.waitForElement(() =>
    rendered.getByTestId("follow-user")
  );

  expect(follow).toHaveTextContent("Follow johndoe");

  testing.fireEvent.click(follow);

  await testing.wait(() => {
    expect(window.location.pathname).toBe("/login");
  });

  expect(followUser).not.toHaveBeenCalled();
  expect(unfollowUser).not.toHaveBeenCalled();
});

test("follows user while logged in", async () => {
  getProfile.mockReturnValue(Promise.resolve({ ...profile, following: false }));
  listArticles.mockReturnValue(Promise.resolve(makeArticleList()));
  followUser.mockReturnValue(Promise.resolve());

  const rendered = testing.render(
    <Profile username="johndoe" currentUser={user} />
  );

  const follow = await testing.waitForElement(() =>
    rendered.getByTestId("follow-user")
  );

  expect(follow).toHaveTextContent("Follow johndoe");

  testing.fireEvent.click(follow);

  expect(followUser).toHaveBeenCalledTimes(1);
  expect(followUser).toHaveBeenLastCalledWith({
    username: profile.username,
    token: user.token
  });

  await testing.wait(() => {
    expect(follow).toHaveTextContent("Unfollow johndoe");
  });
});

test("unfollows user while logged in", async () => {
  getProfile.mockReturnValue(Promise.resolve({ ...profile, following: true }));
  listArticles.mockReturnValue(Promise.resolve(makeArticleList()));
  unfollowUser.mockReturnValue(Promise.resolve());

  const rendered = testing.render(
    <Profile username="johndoe" currentUser={user} />
  );

  const follow = await testing.waitForElement(() =>
    rendered.getByTestId("follow-user")
  );

  expect(follow).toHaveTextContent("Unfollow johndoe");

  testing.fireEvent.click(follow);

  expect(unfollowUser).toHaveBeenCalledTimes(1);
  expect(unfollowUser).toHaveBeenLastCalledWith({
    username: profile.username,
    token: user.token
  });

  await testing.wait(() => {
    expect(follow).toHaveTextContent("Follow johndoe");
  });
});
