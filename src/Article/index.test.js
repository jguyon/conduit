// @flow

import * as React from "react";
import * as testing from "react-testing-library";
import "jest-dom/extend-expect";
import Article from ".";
import * as api from "../api";

const getArticle = jest.spyOn(api, "getArticle");
const favoriteArticle = jest.spyOn(api, "favoriteArticle");
const unfavoriteArticle = jest.spyOn(api, "unfavoriteArticle");
const deleteArticle = jest.spyOn(api, "deleteArticle");
const listComments = jest.spyOn(api, "listComments");

beforeEach(() => {
  window.history.pushState(null, "", "/article/the-answer");
});

afterEach(() => {
  testing.cleanup();
  getArticle.mockReset();
  deleteArticle.mockReset();
  favoriteArticle.mockReset();
  unfavoriteArticle.mockReset();
  listComments.mockReset();
});

const article: api.Article = {
  slug: "the-answer",
  title: "The Answer",
  description: "The answer to life, the universe and everything",
  body: "Forty-two.",
  tagList: ["answer", "universe"],
  createdAt: new Date().toJSON(),
  updatedAt: new Date().toJSON(),
  favorited: false,
  favoritesCount: 3,
  author: {
    username: "douglas",
    bio: null,
    image: null,
    following: false
  }
};

const comment: api.Comment = {
  id: 1,
  createdAt: new Date().toJSON(),
  updatedAt: new Date().toJSON(),
  body: "lol rofl",
  author: {
    username: "jane",
    bio: null,
    image: null,
    following: false
  }
};

const user: api.User = {
  email: "john@doe.com",
  token: "abcd",
  username: "johndoe",
  bio: null,
  image: null
};

const EDIT_BUTTON_TEXT = "Edit Article";
const DELETE_BUTTON_TEXT = "Delete Article";

test("renders the article", async () => {
  getArticle.mockReturnValue(Promise.resolve(article));
  listComments.mockReturnValue(Promise.resolve([]));

  const rendered = testing.render(
    <Article slug="the-answer" currentUser={null} />
  );

  expect(getArticle).toHaveBeenCalledTimes(1);
  expect(getArticle).toHaveBeenLastCalledWith({ slug: "the-answer" });

  await testing.wait(() => {
    rendered.getByText(article.title);
  });
});

test("renders the comments", async () => {
  getArticle.mockReturnValue(Promise.resolve(article));
  listComments.mockReturnValue(Promise.resolve([comment]));

  const rendered = testing.render(
    <Article slug="the-answer" currentUser={null} />
  );

  expect(listComments).toHaveBeenCalledTimes(1);
  expect(listComments).toHaveBeenLastCalledWith({ slug: "the-answer" });

  await testing.wait(() => {
    rendered.getByText(comment.body);
  });
});

test("does not render edit buttons with no current user", async () => {
  getArticle.mockReturnValue(Promise.resolve(article));
  listComments.mockReturnValue(Promise.resolve([]));

  const rendered = testing.render(
    <Article slug="the-answer" currentUser={null} />
  );

  await testing.wait(() => {
    rendered.getByText(article.title);
  });

  expect(rendered.queryByText(EDIT_BUTTON_TEXT)).toEqual(null);
  expect(rendered.queryByText(DELETE_BUTTON_TEXT)).toEqual(null);
});

test("does not render edit buttons with non-author current user", async () => {
  getArticle.mockReturnValue(Promise.resolve(article));
  listComments.mockReturnValue(Promise.resolve([]));

  const rendered = testing.render(
    <Article slug="the-answer" currentUser={user} />
  );

  await testing.wait(() => {
    rendered.getByText(article.title);
  });

  expect(rendered.queryByText(EDIT_BUTTON_TEXT)).toEqual(null);
  expect(rendered.queryByText(DELETE_BUTTON_TEXT)).toEqual(null);
  rendered.getByTestId("favorite-article");
});

test("renders edit buttons with author current user", async () => {
  getArticle.mockReturnValue(
    Promise.resolve({
      ...article,
      author: {
        username: user.username,
        bio: user.bio,
        image: user.image,
        following: false
      }
    })
  );
  listComments.mockReturnValue(Promise.resolve([]));

  const rendered = testing.render(
    <Article slug="the-answer" currentUser={user} />
  );

  await testing.wait(() => {
    rendered.getByText(EDIT_BUTTON_TEXT);
    rendered.getByText(DELETE_BUTTON_TEXT);
    expect(rendered.queryByTestId("favorite-article")).toEqual(null);
  });
});

test("does not favorite article while logged out", async () => {
  getArticle.mockReturnValue(Promise.resolve(article));
  listComments.mockReturnValue(Promise.resolve([]));

  const rendered = testing.render(
    <Article slug="the-answer" currentUser={null} />
  );

  const favorite = await testing.waitForElement(() =>
    rendered.getByTestId("favorite-article")
  );

  testing.fireEvent.click(favorite);

  await testing.wait(() => {
    expect(window.location.pathname).toBe("/login");
  });

  expect(favoriteArticle).not.toHaveBeenCalled();
  expect(unfavoriteArticle).not.toHaveBeenCalled();
});

test("favorites article while logged in", async () => {
  getArticle.mockReturnValue(Promise.resolve({ ...article, favorited: false }));
  listComments.mockReturnValue(Promise.resolve([]));
  favoriteArticle.mockReturnValue(Promise.resolve());

  const rendered = testing.render(
    <Article slug="the-answer" currentUser={user} />
  );

  const favorite = await testing.waitForElement(() =>
    rendered.getByTestId("favorite-article")
  );

  expect(favorite).toHaveTextContent(
    `Favorite Article (${article.favoritesCount})`
  );

  testing.fireEvent.click(favorite);

  expect(favoriteArticle).toHaveBeenCalledTimes(1);
  expect(favoriteArticle).toHaveBeenLastCalledWith({
    slug: article.slug,
    token: user.token
  });

  await testing.wait(() => {
    expect(favorite).toHaveTextContent(
      `Unfavorite Article (${article.favoritesCount + 1})`
    );
  });
});

test("unfavorites article while logged in", async () => {
  getArticle.mockReturnValue(Promise.resolve({ ...article, favorited: true }));
  listComments.mockReturnValue(Promise.resolve([]));
  unfavoriteArticle.mockReturnValue(Promise.resolve());

  const rendered = testing.render(
    <Article slug="the-answer" currentUser={user} />
  );

  const favorite = await testing.waitForElement(() =>
    rendered.getByTestId("favorite-article")
  );

  expect(favorite).toHaveTextContent(
    `Unfavorite Article (${article.favoritesCount})`
  );

  testing.fireEvent.click(favorite);

  expect(unfavoriteArticle).toHaveBeenCalledTimes(1);
  expect(unfavoriteArticle).toHaveBeenLastCalledWith({
    slug: article.slug,
    token: user.token
  });

  await testing.wait(() => {
    expect(favorite).toHaveTextContent(
      `Favorite Article (${article.favoritesCount - 1})`
    );
  });
});

test("deletes article", async () => {
  getArticle.mockReturnValue(
    Promise.resolve({
      ...article,
      author: {
        username: user.username,
        bio: user.bio,
        image: user.image,
        following: false
      }
    })
  );
  listComments.mockReturnValue(Promise.resolve([]));
  deleteArticle.mockReturnValue(Promise.resolve());

  const rendered = testing.render(
    <Article slug="the-answer" currentUser={user} />
  );

  const edit = await testing.waitForElement(() =>
    rendered.getByText(DELETE_BUTTON_TEXT)
  );

  testing.fireEvent.click(edit);

  expect(deleteArticle).toHaveBeenCalledTimes(1);
  await testing.wait(() => expect(window.location.pathname).toBe("/"));
});
