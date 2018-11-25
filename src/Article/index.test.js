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
