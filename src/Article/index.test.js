// @flow

import * as React from "react";
import * as testing from "react-testing-library";
import "jest-dom/extend-expect";
import * as api from "../api";
import Article from ".";

afterEach(testing.cleanup);

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
    image: "",
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
    image: "",
    following: false
  }
};

const user: api.User = {
  email: "john@doe.com",
  token: "abcd",
  username: "johndoe",
  bio: null,
  image: ""
};

const EDIT_BUTTON_TEXT = "Edit Article";
const DELETE_BUTTON_TEXT = "Delete Article";

test("renders the article", async () => {
  const rendered = testing.render(
    <Article
      slug="the-answer"
      getArticle={slug => {
        expect(slug).toBe("the-answer");
        return Promise.resolve({ article });
      }}
      deleteArticle={() => Promise.resolve()}
      listComments={slug => {
        expect(slug).toBe("the-answer");
        return Promise.resolve({ comments: [comment] });
      }}
      currentUser={null}
    />
  );

  await testing.wait(() => {
    rendered.getByText(article.title);
    rendered.getByText(comment.body);
  });
});

test("does not render edit buttons with no current user", async () => {
  const rendered = testing.render(
    <Article
      slug="the-answer"
      getArticle={slug => {
        expect(slug).toBe("the-answer");
        return Promise.resolve({ article });
      }}
      deleteArticle={() => Promise.resolve()}
      listComments={slug => {
        expect(slug).toBe("the-answer");
        return Promise.resolve({ comments: [comment] });
      }}
      currentUser={null}
    />
  );

  await testing.wait(() => {
    rendered.getByText(article.title);
  });

  expect(rendered.queryByText(EDIT_BUTTON_TEXT)).toEqual(null);
  expect(rendered.queryByText(DELETE_BUTTON_TEXT)).toEqual(null);
});

test("does not render edit buttons with non-author current user", async () => {
  const rendered = testing.render(
    <Article
      slug="the-answer"
      getArticle={slug => {
        expect(slug).toBe("the-answer");
        return Promise.resolve({ article });
      }}
      deleteArticle={() => Promise.resolve()}
      listComments={slug => {
        expect(slug).toBe("the-answer");
        return Promise.resolve({ comments: [comment] });
      }}
      currentUser={user}
    />
  );

  await testing.wait(() => {
    rendered.getByText(article.title);
  });

  expect(rendered.queryByText(EDIT_BUTTON_TEXT)).toEqual(null);
  expect(rendered.queryByText(DELETE_BUTTON_TEXT)).toEqual(null);
});

test("renders edit button with author current user", async () => {
  const rendered = testing.render(
    <Article
      slug="the-answer"
      getArticle={slug => {
        expect(slug).toBe("the-answer");
        return Promise.resolve({
          article: {
            ...article,
            author: {
              username: user.username,
              bio: user.bio,
              image: user.image,
              following: false
            }
          }
        });
      }}
      deleteArticle={() => Promise.resolve()}
      listComments={slug => {
        expect(slug).toBe("the-answer");
        return Promise.resolve({ comments: [comment] });
      }}
      currentUser={user}
    />
  );

  await testing.wait(() => {
    rendered.getByText(EDIT_BUTTON_TEXT);
    rendered.getByText(DELETE_BUTTON_TEXT);
  });
});
