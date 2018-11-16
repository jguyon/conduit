// @flow

import * as React from "react";
import * as testing from "react-testing-library";
import "jest-dom/extend-expect";
import Home from ".";
import type { ListArticles, Article, ListTags } from "../api";

afterEach(testing.cleanup);

const makeArticle = (name: string): Article => ({
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
    image: "",
    following: false
  }
});

const makeArticleList = (...names: string[]): ListArticles => ({
  articlesCount: names.length,
  articles: names.map(makeArticle)
});

const makePaginatedList = (page: number): ListArticles => {
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

const makeTagList = (...tags: string[]): ListTags => ({ tags });

test("renders global feed", async () => {
  const rendered = testing.render(
    <Home
      listArticles={() => Promise.resolve(makeArticleList("one", "two"))}
      listTags={() => Promise.resolve(makeTagList())}
    />
  );

  await testing.wait(() => {
    rendered.getByTestId("article-one");
    rendered.getByTestId("article-two");
  });
});

test("renders popular tags", async () => {
  const rendered = testing.render(
    <Home
      listArticles={() => Promise.resolve(makeArticleList())}
      listTags={() => Promise.resolve(makeTagList("one", "two"))}
    />
  );

  await testing.wait(() => {
    rendered.getByTestId("tag-one");
    rendered.getByTestId("tag-two");
  });
});

test("supports changing pages on global feed", async () => {
  const rendered = testing.render(
    <Home
      listArticles={({ page, perPage }) => {
        expect(perPage).toEqual(10);
        return Promise.resolve(makePaginatedList(page));
      }}
      listTags={() => Promise.resolve(makeTagList())}
    />
  );

  await testing.wait(() => {
    rendered.getByTestId("article-ten");
    expect(rendered.queryByTestId("article-eleven")).toEqual(null);
  });

  testing.fireEvent.click(rendered.getByTestId("articles-page-2"));

  await testing.wait(() => {
    rendered.getByTestId("article-eleven");
    expect(rendered.queryByTestId("article-ten")).toEqual(null);
  });

  testing.fireEvent.click(rendered.getByTestId("articles-page-1"));

  await testing.wait(() => {
    rendered.getByTestId("article-ten");
    expect(rendered.queryByTestId("article-eleven")).toEqual(null);
  });
});

test("supports switching to tag feed", async () => {
  const rendered = testing.render(
    <Home
      listArticles={({ tag, page, perPage }) => {
        expect(perPage).toBe(10);

        if (tag === undefined) {
          return Promise.resolve(makePaginatedList(page));
        } else {
          expect(tag).toBe("one");
          expect(page).toBe(1);
          return Promise.resolve(makeArticleList("tagged"));
        }
      }}
      listTags={() => Promise.resolve(makeTagList("one"))}
    />
  );

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

  await testing.wait(() => {
    rendered.getByTestId("article-tagged");
  });
});

test("supports changing pages on tag feed", async () => {
  const rendered = testing.render(
    <Home
      listArticles={({ page, perPage, tag }) => {
        expect(perPage).toBe(10);

        if (tag === undefined) {
          expect(page).toBe(1);
          return Promise.resolve(makeArticleList());
        } else {
          expect(tag).toBe("one");
          return Promise.resolve(makePaginatedList(page));
        }
      }}
      listTags={() => Promise.resolve(makeTagList("one"))}
    />
  );

  const tag = await testing.waitForElement(() =>
    rendered.getByTestId("tag-one")
  );

  testing.fireEvent.click(tag);

  await testing.wait(() => {
    rendered.getByTestId("article-ten");
    expect(rendered.queryByTestId("article-eleven")).toEqual(null);
  });

  testing.fireEvent.click(rendered.getByTestId("articles-page-2"));

  await testing.wait(() => {
    rendered.getByTestId("article-eleven");
    expect(rendered.queryByTestId("article-ten")).toEqual(null);
  });

  testing.fireEvent.click(rendered.getByTestId("articles-page-1"));

  await testing.wait(() => {
    rendered.getByTestId("article-ten");
    expect(rendered.queryByTestId("article-eleven")).toEqual(null);
  });
});

test("supports switching back to global feed", async () => {
  const rendered = testing.render(
    <Home
      listArticles={({ page, perPage, tag }) => {
        expect(perPage).toBe(10);

        if (tag === undefined) {
          expect(page).toBe(1);
          return Promise.resolve(makeArticleList("untagged"));
        } else {
          expect(tag).toBe("one");
          return Promise.resolve(makePaginatedList(page));
        }
      }}
      listTags={() => Promise.resolve(makeTagList("one"))}
    />
  );

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

  await testing.wait(() => {
    rendered.getByTestId("article-untagged");
  });
});
