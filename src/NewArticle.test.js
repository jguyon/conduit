// @flow

import * as React from "react";
import * as testing from "react-testing-library";
import "jest-dom/extend-expect";
import NewArticle from "./NewArticle";
import type { User, Article } from "./api";

const user: User = {
  email: "john@doe.com",
  token: "abcd",
  username: "johndoe",
  bio: null,
  image: ""
};

const article: Article = {
  title: "Some Article",
  slug: "some-article",
  description: "This is an article",
  body: "Lorem ipsum",
  tagList: ["test", "article"],
  favoritesCount: 0,
  favorited: false,
  createdAt: new Date().toJSON(),
  updatedAt: new Date().toJSON(),
  author: {
    username: user.username,
    bio: user.bio,
    image: user.image,
    following: false
  }
};

beforeEach(() => {
  window.history.pushState(null, "", "/editor");
});

afterEach(testing.cleanup);

test("creates article with valid fields", async () => {
  const createArticle = jest.fn(() =>
    Promise.resolve({
      isOk: true,
      article
    })
  );

  const rendered = testing.render(
    <NewArticle createArticle={createArticle} currentUser={user} />
  );

  testing.fireEvent.change(rendered.getByTestId("new-article-title"), {
    target: { value: "Some Article" }
  });

  testing.fireEvent.change(rendered.getByTestId("new-article-description"), {
    target: { value: "This is an article" }
  });

  testing.fireEvent.change(rendered.getByTestId("new-article-body"), {
    target: { value: "Lorem ipsum" }
  });

  testing.fireEvent.change(rendered.getByTestId("new-article-tag-list"), {
    target: { value: " test  article" }
  });

  testing.fireEvent.submit(rendered.getByTestId("new-article-form"));

  await testing.wait(() =>
    expect(window.location.pathname).toBe(`/article/${article.slug}`)
  );

  expect(createArticle).toHaveBeenCalledTimes(1);
  expect(createArticle).toHaveBeenLastCalledWith(user.token, {
    title: "Some Article",
    description: "This is an article",
    body: "Lorem ipsum",
    tagList: ["test", "article"]
  });
});

test("displays errors with invalid fields", async () => {
  const createArticle = jest.fn(() =>
    Promise.resolve({
      isOk: false,
      errors: {
        title: ["is invalid"],
        description: ["is invalid"],
        body: ["is invalid"],
        tagList: ["is invalid"]
      }
    })
  );

  const rendered = testing.render(
    <NewArticle createArticle={createArticle} currentUser={user} />
  );

  testing.fireEvent.change(rendered.getByTestId("new-article-title"), {
    target: { value: "Some Article" }
  });

  testing.fireEvent.change(rendered.getByTestId("new-article-description"), {
    target: { value: "This is an article" }
  });

  testing.fireEvent.change(rendered.getByTestId("new-article-body"), {
    target: { value: "Lorem ipsum" }
  });

  testing.fireEvent.change(rendered.getByTestId("new-article-tag-list"), {
    target: { value: " test  article" }
  });

  testing.fireEvent.submit(rendered.getByTestId("new-article-form"));

  expect(createArticle).toHaveBeenCalledTimes(1);
  expect(createArticle).toHaveBeenLastCalledWith(user.token, {
    title: "Some Article",
    description: "This is an article",
    body: "Lorem ipsum",
    tagList: ["test", "article"]
  });

  await testing.wait(() => {
    expect(rendered.getByTestId("new-article-title-error")).toHaveTextContent(
      "is invalid"
    );
    expect(
      rendered.getByTestId("new-article-description-error")
    ).toHaveTextContent("is invalid");
    expect(rendered.getByTestId("new-article-body-error")).toHaveTextContent(
      "is invalid"
    );
    expect(
      rendered.getByTestId("new-article-tag-list-error")
    ).toHaveTextContent("is invalid");
  });
});
