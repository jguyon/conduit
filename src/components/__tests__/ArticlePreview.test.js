// @flow

import * as React from "react";
import * as testing from "react-testing-library";
import "jest-dom/extend-expect";
import ArticlePreview from "../ArticlePreview";
import * as api from "../../lib/api";

const favoriteArticle = jest.spyOn(api, "favoriteArticle");
const unfavoriteArticle = jest.spyOn(api, "unfavoriteArticle");

beforeEach(() => {
  window.history.pushState(null, "", "/");
});

afterEach(() => {
  testing.cleanup();
  favoriteArticle.mockReset();
  unfavoriteArticle.mockReset();
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

const user: api.User = {
  email: "john@doe.com",
  token: "abcd",
  username: "johndoe",
  bio: null,
  image: null
};

test("does not favorite article while logged out", async () => {
  const rendered = testing.render(
    <ArticlePreview currentUser={null} article={article} />
  );

  const favorite = rendered.getByTestId(`favorite-article-${article.slug}`);

  testing.fireEvent.click(favorite);

  await testing.wait(() => {
    expect(window.location.pathname).toBe("/login");
  });

  expect(favoriteArticle).not.toHaveBeenCalled();
  expect(unfavoriteArticle).not.toHaveBeenCalled();
});

test("favorites article while logged in", async () => {
  favoriteArticle.mockReturnValue(Promise.resolve());

  const rendered = testing.render(
    <ArticlePreview
      currentUser={user}
      article={{
        ...article,
        favorited: false
      }}
    />
  );

  const favorite = rendered.getByTestId(`favorite-article-${article.slug}`);

  expect(favorite).toHaveTextContent(`+ ${article.favoritesCount}`);

  testing.fireEvent.click(favorite);

  expect(favoriteArticle).toHaveBeenCalledTimes(1);
  expect(favoriteArticle).toHaveBeenLastCalledWith({
    slug: article.slug,
    token: user.token
  });

  await testing.wait(() => {
    expect(favorite).toHaveTextContent(`+ ${article.favoritesCount + 1}`);
  });
});

test("unfavorites article while logged in", async () => {
  unfavoriteArticle.mockReturnValue(Promise.resolve());

  const rendered = testing.render(
    <ArticlePreview
      currentUser={user}
      article={{
        ...article,
        favorited: true
      }}
    />
  );

  const favorite = rendered.getByTestId(`favorite-article-${article.slug}`);

  expect(favorite).toHaveTextContent(`+ ${article.favoritesCount}`);

  testing.fireEvent.click(favorite);

  expect(unfavoriteArticle).toHaveBeenCalledTimes(1);
  expect(unfavoriteArticle).toHaveBeenLastCalledWith({
    slug: article.slug,
    token: user.token
  });

  await testing.wait(() => {
    expect(favorite).toHaveTextContent(`+ ${article.favoritesCount - 1}`);
  });
});
