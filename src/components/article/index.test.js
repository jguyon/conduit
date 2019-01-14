// @flow

import * as React from "react";
import * as testing from "react-testing-library";
import "jest-dom/extend-expect";
import Article from ".";
import * as api from "../../lib/api";

const getArticle = jest.spyOn(api, "getArticle");
const followUser = jest.spyOn(api, "followUser");
const unfollowUser = jest.spyOn(api, "unfollowUser");
const favoriteArticle = jest.spyOn(api, "favoriteArticle");
const unfavoriteArticle = jest.spyOn(api, "unfavoriteArticle");
const deleteArticle = jest.spyOn(api, "deleteArticle");
const listComments = jest.spyOn(api, "listComments");
const addComment = jest.spyOn(api, "addComment");
const deleteComment = jest.spyOn(api, "deleteComment");

beforeEach(() => {
  window.history.pushState(null, "", "/article/the-answer");
});

afterEach(() => {
  testing.cleanup();
  getArticle.mockReset();
  deleteArticle.mockReset();
  followUser.mockReset();
  unfollowUser.mockReset();
  favoriteArticle.mockReset();
  unfavoriteArticle.mockReset();
  listComments.mockReset();
  addComment.mockReset();
  deleteComment.mockReset();
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

const ownComment: api.Comment = {
  id: 2,
  createdAt: new Date().toJSON(),
  updatedAt: new Date().toJSON(),
  body: "I'm awesome!",
  author: {
    username: user.username,
    bio: user.bio,
    image: user.image,
    following: false
  }
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

test("does not follow user white logged out", async () => {
  getArticle.mockReturnValue(Promise.resolve(article));
  listComments.mockReturnValue(Promise.resolve([]));

  const rendered = testing.render(
    <Article slug="the-answer" currentUser={null} />
  );

  const follow = await testing.waitForElement(() =>
    rendered.getByTestId("follow-user")
  );

  testing.fireEvent.click(follow);

  await testing.wait(() => {
    expect(window.location.pathname).toBe("/login");
  });

  expect(followUser).not.toHaveBeenCalled();
  expect(unfollowUser).not.toHaveBeenCalled();
});

test("follows user while logged in", async () => {
  getArticle.mockReturnValue(
    Promise.resolve({
      ...article,
      author: { ...article.author, following: false }
    })
  );
  listComments.mockReturnValue(Promise.resolve([]));
  followUser.mockReturnValue(Promise.resolve());

  const rendered = testing.render(
    <Article slug="the-answer" currentUser={user} />
  );

  const follow = await testing.waitForElement(() =>
    rendered.getByTestId("follow-user")
  );

  expect(follow).toHaveTextContent(`Follow ${article.author.username}`);

  testing.fireEvent.click(follow);

  expect(followUser).toHaveBeenCalledTimes(1);
  expect(followUser).toHaveBeenLastCalledWith({
    username: article.author.username,
    token: user.token
  });

  await testing.wait(() => {
    expect(follow).toHaveTextContent(`Unfollow ${article.author.username}`);
  });
});

test("unfollows user while logged in", async () => {
  getArticle.mockReturnValue(
    Promise.resolve({
      ...article,
      author: {
        ...article.author,
        following: true
      }
    })
  );
  listComments.mockReturnValue(Promise.resolve([]));
  unfollowUser.mockReturnValue(Promise.resolve());

  const rendered = testing.render(
    <Article slug="the-answer" currentUser={user} />
  );

  const follow = await testing.waitForElement(() =>
    rendered.getByTestId("follow-user")
  );

  expect(follow).toHaveTextContent(`Unfollow ${article.author.username}`);

  testing.fireEvent.click(follow);

  expect(unfollowUser).toHaveBeenCalledTimes(1);
  expect(unfollowUser).toHaveBeenLastCalledWith({
    username: article.author.username,
    token: user.token
  });

  await testing.wait(() => {
    expect(follow).toHaveTextContent(`Follow ${article.author.username}`);
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

test("does not display comment form when not logged in", async () => {
  getArticle.mockReturnValue(Promise.resolve(article));
  listComments.mockReturnValue(Promise.resolve([comment]));

  const rendered = testing.render(
    <Article slug="the-answer" currentUser={null} />
  );

  await testing.wait(() => {
    rendered.getByText(comment.body);
  });

  expect(rendered.queryByTestId("add-comment")).toEqual(null);
});

test("adds comment when logged in", async () => {
  getArticle.mockReturnValue(Promise.resolve(article));
  listComments.mockReturnValue(Promise.resolve([comment]));
  addComment.mockReturnValue(
    Promise.resolve({
      isOk: true,
      comment: ownComment
    })
  );

  const rendered = testing.render(
    <Article slug="the-answer" currentUser={user} />
  );

  const { form, input } = await testing.waitForElement(() => ({
    form: rendered.getByTestId("add-comment"),
    input: rendered.getByTestId("add-comment-body")
  }));

  testing.fireEvent.change(input, {
    target: { value: ownComment.body }
  });

  testing.fireEvent.submit(form);

  expect(addComment).toHaveBeenCalledTimes(1);
  expect(addComment).toHaveBeenLastCalledWith({
    token: user.token,
    slug: article.slug,
    body: ownComment.body
  });

  await testing.wait(() => {
    expect(input).not.toHaveTextContent(ownComment.body);
    rendered.getByText(ownComment.body);
  });
});

test("cannot remove comments when not logged in", async () => {
  getArticle.mockReturnValue(Promise.resolve(article));
  listComments.mockReturnValue(Promise.resolve([comment]));

  const rendered = testing.render(
    <Article slug="the-answer" currentUser={null} />
  );

  await testing.wait(() => {
    rendered.getByText(comment.body);
  });

  expect(rendered.queryByTestId(`remove-comment-${comment.id}`)).toEqual(null);
});

test("cannot remove comments from other users", async () => {
  getArticle.mockReturnValue(Promise.resolve(article));
  listComments.mockReturnValue(Promise.resolve([comment]));

  const rendered = testing.render(
    <Article slug="the-answer" currentUser={user} />
  );

  await testing.wait(() => {
    rendered.getByText(comment.body);
  });

  expect(rendered.queryByTestId(`remove-comment-${comment.id}`)).toEqual(null);
});

test("removes own existing comment", async () => {
  getArticle.mockReturnValue(Promise.resolve(article));
  listComments.mockReturnValue(Promise.resolve([comment, ownComment]));
  deleteComment.mockReturnValue(Promise.resolve());

  const rendered = testing.render(
    <Article slug="the-answer" currentUser={user} />
  );

  const removeComment = await testing.waitForElement(() =>
    rendered.getByTestId(`remove-comment-${ownComment.id}`)
  );

  testing.fireEvent.click(removeComment);

  expect(deleteComment).toHaveBeenCalledTimes(1);
  expect(deleteComment).toHaveBeenLastCalledWith({
    token: user.token,
    slug: article.slug,
    commentId: ownComment.id
  });

  await testing.wait(() => {
    expect(rendered.queryByText(ownComment.body)).toEqual(null);
    rendered.getByText(comment.body);
  });
});

test("removes own added comment", async () => {
  getArticle.mockReturnValue(Promise.resolve(article));
  listComments.mockReturnValue(Promise.resolve([comment]));
  addComment.mockReturnValue(
    Promise.resolve({
      isOk: true,
      comment: ownComment
    })
  );
  deleteComment.mockReturnValue(Promise.resolve());

  const rendered = testing.render(
    <Article slug="the-answer" currentUser={user} />
  );

  const { form, input } = await testing.waitForElement(() => ({
    form: rendered.getByTestId("add-comment"),
    input: rendered.getByTestId("add-comment-body")
  }));

  testing.fireEvent.change(input, {
    target: { value: ownComment.body }
  });

  testing.fireEvent.submit(form);

  const removeComment = await testing.waitForElement(() =>
    rendered.getByTestId(`remove-comment-${ownComment.id}`)
  );

  testing.fireEvent.click(removeComment);

  expect(deleteComment).toHaveBeenCalledTimes(1);
  expect(deleteComment).toHaveBeenLastCalledWith({
    token: user.token,
    slug: article.slug,
    commentId: ownComment.id
  });

  await testing.wait(() => {
    expect(rendered.queryByText(ownComment.body)).toEqual(null);
    rendered.getByText(comment.body);
  });
});
