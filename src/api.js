// @flow

export type Profile = {|
  username: string,
  bio: null | string,
  image: string,
  following: boolean
|};

export type GetProfile = {|
  profile: Profile
|};

export type Article = {|
  slug: string,
  title: string,
  description: string,
  body: string,
  tagList: string[],
  createdAt: string,
  updatedAt: string,
  favorited: boolean,
  favoritesCount: number,
  author: Profile
|};

export type ListArticles = {|
  articlesCount: number,
  articles: Article[]
|};

type ListArticlesOpts = {|
  page: number,
  perPage: number,
  tag?: string,
  author?: string,
  favorited?: string
|};

export type GetArticle = {|
  article: Article
|};

export type ListTags = {|
  tags: string[]
|};

export type Comment = {|
  id: number,
  createdAt: string,
  updatedAt: string,
  body: string,
  author: Profile
|};

export type ListComments = {|
  comments: Comment[]
|};

const ENDPOINT = "https://conduit.productionready.io/api";

export const listArticles = ({
  page,
  perPage,
  tag,
  author,
  favorited
}: ListArticlesOpts): Promise<ListArticles> =>
  fetch(
    `${ENDPOINT}/articles?limit=${perPage}&offset=${(page - 1) * perPage}${
      tag ? `&tag=${encodeURIComponent(tag)}` : ""
    }${author ? `&author=${encodeURIComponent(author)}` : ""}${
      favorited ? `&favorited=${encodeURIComponent(favorited)}` : ""
    }`
  ).then(response => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error(`expected status 200 but got ${response.status}`);
    }
  });

export const getArticle = (slug: string): Promise<GetArticle> =>
  fetch(`${ENDPOINT}/articles/${encodeURIComponent(slug)}`).then(response => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error(`expected status 200 but got ${response.status}`);
    }
  });

export const listTags = (): Promise<ListTags> =>
  fetch(`${ENDPOINT}/tags`).then(response => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error(`expected status 200 but got ${response.status}`);
    }
  });

export const listComments = (slug: string): Promise<ListComments> =>
  fetch(`${ENDPOINT}/articles/${encodeURIComponent(slug)}/comments`).then(
    response => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error(`expected status 200 but got ${response.status}`);
      }
    }
  );

export const getProfile = (username: string): Promise<GetProfile> =>
  fetch(`${ENDPOINT}/profiles/${encodeURIComponent(username)}`).then(
    response => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error(`expected status 200 but got ${response.status}`);
      }
    }
  );
