// @flow

import * as React from "react";
import * as testing from "react-testing-library";
import "jest-dom/extend-expect";
import * as api from "../api";
import Profile from ".";

afterEach(testing.cleanup);

const profile: api.Profile = {
  username: "johndoe",
  bio: null,
  image: "",
  following: false
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
    image: "",
    following: false
  }
});

const makeArticleList = (...names: string[]): api.ListArticles => ({
  articlesCount: names.length,
  articles: names.map(makeArticle)
});

const makePaginatedList = (page: number): api.ListArticles => {
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
  const rendered = testing.render(
    <Profile
      username="johndoe"
      getProfile={slug => {
        expect(slug).toBe("johndoe");
        return Promise.resolve({ profile });
      }}
      listArticles={() => Promise.resolve(makeArticleList())}
    />
  );

  await testing.wait(() => {
    rendered.getByText("johndoe");
  });
});

test("renders authored feed", async () => {
  const rendered = testing.render(
    <Profile
      username="johndoe"
      getProfile={() => Promise.resolve({ profile })}
      listArticles={({ author, favorited }) => {
        expect(author).toBe("johndoe");
        expect(favorited).toBe(undefined);
        return Promise.resolve(makeArticleList("one", "two"));
      }}
    />
  );

  await testing.wait(() => {
    rendered.getByTestId("article-one");
    rendered.getByTestId("article-two");
  });
});

test("supports changing pages on authored feed", async () => {
  const rendered = testing.render(
    <Profile
      username="johndoe"
      getProfile={() => Promise.resolve({ profile })}
      listArticles={({ author, favorited, page, perPage }) => {
        expect(author).toBe("johndoe");
        expect(favorited).toBe(undefined);
        expect(perPage).toBe(10);
        return Promise.resolve(makePaginatedList(page));
      }}
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

test("supports switching to favorited feed", async () => {
  const rendered = testing.render(
    <Profile
      username="johndoe"
      getProfile={() => Promise.resolve({ profile })}
      listArticles={({ author, favorited, page, perPage }) => {
        expect(perPage).toBe(10);

        if (author) {
          expect(author).toBe("johndoe");
          expect(favorited).toBe(undefined);
          return Promise.resolve(makePaginatedList(page));
        } else {
          expect(favorited).toBe("johndoe");
          expect(page).toBe(1);
          return Promise.resolve(makeArticleList("favorited"));
        }
      }}
    />
  );

  await testing.wait(() => {
    rendered.getByTestId("article-one");
  });

  testing.fireEvent.click(rendered.getByTestId("articles-page-2"));

  await testing.wait(() => {
    rendered.getByTestId("article-eleven");
  });

  testing.fireEvent.click(rendered.getByTestId("favorited-feed"));

  await testing.wait(() => {
    rendered.getByTestId("article-favorited");
  });
});

test("supports changing pages on favorited feed", async () => {
  const rendered = testing.render(
    <Profile
      username="johndoe"
      getProfile={() => Promise.resolve({ profile })}
      listArticles={({ author, favorited, page, perPage }) => {
        expect(perPage).toBe(10);

        if (author) {
          expect(author).toBe("johndoe");
          expect(favorited).toBe(undefined);
          expect(page).toBe(1);
          return Promise.resolve(makeArticleList());
        } else {
          expect(favorited).toBe("johndoe");
          return Promise.resolve(makePaginatedList(page));
        }
      }}
    />
  );

  const favorited = await testing.waitForElement(() =>
    rendered.getByTestId("favorited-feed")
  );

  testing.fireEvent.click(favorited);

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

test("supports switching back to authored feed", async () => {
  const rendered = testing.render(
    <Profile
      username="johndoe"
      getProfile={() => Promise.resolve({ profile })}
      listArticles={({ author, favorited, page, perPage }) => {
        expect(perPage).toBe(10);

        if (author) {
          expect(author).toBe("johndoe");
          expect(favorited).toBe(undefined);
          expect(page).toBe(1);
          return Promise.resolve(makeArticleList("authored"));
        } else {
          expect(favorited).toBe("johndoe");
          return Promise.resolve(makePaginatedList(page));
        }
      }}
    />
  );

  const favorited = await testing.waitForElement(() =>
    rendered.getByTestId("favorited-feed")
  );

  testing.fireEvent.click(favorited);

  await testing.wait(() => {
    rendered.getByTestId("article-one");
  });

  testing.fireEvent.click(rendered.getByTestId("articles-page-2"));

  await testing.wait(() => {
    rendered.getByTestId("article-eleven");
  });

  testing.fireEvent.click(rendered.getByTestId("authored-feed"));

  await testing.wait(() => {
    rendered.getByTestId("article-authored");
  });
});