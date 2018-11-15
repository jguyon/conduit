// @flow

export type Profile = {|
  username: string,
  bio: null | string,
  image: string,
  following: boolean
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
  perPage: number
|};

const ENDPOINT = "https://conduit.productionready.io/api";

export const listArticles = ({
  page,
  perPage
}: ListArticlesOpts): Promise<ListArticles> =>
  fetch(
    `${ENDPOINT}/articles?limit=${perPage}&offset=${(page - 1) * perPage}`
  ).then(response => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error(`expected status 200 but got ${response.status}`);
    }
  });
