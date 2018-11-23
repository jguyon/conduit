// @flow

import * as React from "react";
import * as testing from "react-testing-library";
import "jest-dom/extend-expect";
import PostArticle from "./PostArticle";
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

describe("with type 'create'", () => {
  test("creates article with valid fields", async () => {
    const createArticle = jest.fn(() =>
      Promise.resolve({
        isOk: true,
        article
      })
    );

    const rendered = testing.render(
      <PostArticle
        type="create"
        createArticle={createArticle}
        currentUser={user}
      />
    );

    testing.fireEvent.change(rendered.getByTestId("post-article-title"), {
      target: { value: "Some Article" }
    });

    testing.fireEvent.change(rendered.getByTestId("post-article-description"), {
      target: { value: "This is an article" }
    });

    testing.fireEvent.change(rendered.getByTestId("post-article-body"), {
      target: { value: "Lorem ipsum" }
    });

    testing.fireEvent.change(rendered.getByTestId("post-article-tag-list"), {
      target: { value: " test  article" }
    });

    testing.fireEvent.submit(rendered.getByTestId("post-article-form"));

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
      <PostArticle
        type="create"
        createArticle={createArticle}
        currentUser={user}
      />
    );

    testing.fireEvent.change(rendered.getByTestId("post-article-title"), {
      target: { value: "Some Article" }
    });

    testing.fireEvent.change(rendered.getByTestId("post-article-description"), {
      target: { value: "This is an article" }
    });

    testing.fireEvent.change(rendered.getByTestId("post-article-body"), {
      target: { value: "Lorem ipsum" }
    });

    testing.fireEvent.change(rendered.getByTestId("post-article-tag-list"), {
      target: { value: " test  article" }
    });

    testing.fireEvent.submit(rendered.getByTestId("post-article-form"));

    expect(createArticle).toHaveBeenCalledTimes(1);
    expect(createArticle).toHaveBeenLastCalledWith(user.token, {
      title: "Some Article",
      description: "This is an article",
      body: "Lorem ipsum",
      tagList: ["test", "article"]
    });

    await testing.wait(() => {
      expect(
        rendered.getByTestId("post-article-title-error")
      ).toHaveTextContent("is invalid");
      expect(
        rendered.getByTestId("post-article-description-error")
      ).toHaveTextContent("is invalid");
      expect(rendered.getByTestId("post-article-body-error")).toHaveTextContent(
        "is invalid"
      );
      expect(
        rendered.getByTestId("post-article-tag-list-error")
      ).toHaveTextContent("is invalid");
    });
  });
});

describe("with type 'update'", () => {
  test("loads article", async () => {
    const getArticle = jest.fn(() => Promise.resolve({ article }));

    const rendered = testing.render(
      <PostArticle
        type="update"
        currentUser={user}
        slug={article.slug}
        getArticle={getArticle}
        updateArticle={() =>
          Promise.reject(new Error("updateArticle should not be called"))
        }
      />
    );

    await testing.wait(() => {
      expect(rendered.getByTestId("post-article-title")).toHaveAttribute(
        "value",
        article.title
      );
      expect(rendered.getByTestId("post-article-description")).toHaveAttribute(
        "value",
        article.description
      );
      expect(rendered.getByTestId("post-article-body")).toHaveTextContent(
        article.body
      );
      expect(rendered.getByTestId("post-article-tag-list")).toHaveAttribute(
        "value",
        article.tagList.join(" ")
      );
    });
  });

  test("updates article with valid fields", async () => {
    const getArticle = () => Promise.resolve({ article });

    const updatedArticle = {
      ...article,
      slug: "new-article",
      title: "New Title",
      description: "This is a new description",
      body: "This is a new body",
      tagList: ["new", "tags"]
    };

    const updateArticle = jest.fn(() =>
      Promise.resolve({
        isOk: true,
        article: updatedArticle
      })
    );

    const rendered = testing.render(
      <PostArticle
        type="update"
        slug={article.slug}
        currentUser={user}
        getArticle={getArticle}
        updateArticle={updateArticle}
      />
    );

    await testing.wait(() => {
      expect(rendered.getByTestId("post-article-title")).not.toBeDisabled();
    });

    testing.fireEvent.change(rendered.getByTestId("post-article-title"), {
      target: { value: updatedArticle.title }
    });

    testing.fireEvent.change(rendered.getByTestId("post-article-description"), {
      target: { value: updatedArticle.description }
    });

    testing.fireEvent.change(rendered.getByTestId("post-article-body"), {
      target: { value: updatedArticle.body }
    });

    testing.fireEvent.change(rendered.getByTestId("post-article-tag-list"), {
      target: { value: updatedArticle.tagList.join("  ") }
    });

    testing.fireEvent.submit(rendered.getByTestId("post-article-form"));

    await testing.wait(() =>
      expect(window.location.pathname).toBe(`/article/${updatedArticle.slug}`)
    );

    expect(updateArticle).toHaveBeenCalledTimes(1);
    expect(updateArticle).toHaveBeenLastCalledWith(user.token, article.slug, {
      title: updatedArticle.title,
      description: updatedArticle.description,
      body: updatedArticle.body,
      tagList: updatedArticle.tagList
    });
  });

  test("displays errors with invalid fields", async () => {
    const getArticle = () => Promise.resolve({ article });

    const updateArticle = jest.fn(() =>
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
      <PostArticle
        type="update"
        slug={article.slug}
        currentUser={user}
        getArticle={getArticle}
        updateArticle={updateArticle}
      />
    );

    await testing.wait(() => {
      expect(rendered.getByTestId("post-article-title")).not.toBeDisabled();
    });

    testing.fireEvent.change(rendered.getByTestId("post-article-title"), {
      target: { value: "New Title" }
    });

    testing.fireEvent.change(rendered.getByTestId("post-article-description"), {
      target: { value: "This is a new description" }
    });

    testing.fireEvent.change(rendered.getByTestId("post-article-body"), {
      target: { value: "This is a new body" }
    });

    testing.fireEvent.change(rendered.getByTestId("post-article-tag-list"), {
      target: { value: " new  tags  " }
    });

    testing.fireEvent.submit(rendered.getByTestId("post-article-form"));

    expect(updateArticle).toHaveBeenCalledTimes(1);
    expect(updateArticle).toHaveBeenLastCalledWith(user.token, article.slug, {
      title: "New Title",
      description: "This is a new description",
      body: "This is a new body",
      tagList: ["new", "tags"]
    });

    await testing.wait(() => {
      expect(
        rendered.getByTestId("post-article-title-error")
      ).toHaveTextContent("is invalid");
      expect(
        rendered.getByTestId("post-article-description-error")
      ).toHaveTextContent("is invalid");
      expect(rendered.getByTestId("post-article-body-error")).toHaveTextContent(
        "is invalid"
      );
      expect(
        rendered.getByTestId("post-article-tag-list-error")
      ).toHaveTextContent("is invalid");
    });
  });
});
