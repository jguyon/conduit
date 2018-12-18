// @flow

const ENDPOINT = "https://conduit.productionready.io/api";

export type User = {
  email: string,
  token: string,
  username: string,
  bio: null | string,
  image: null | string
};

export type Profile = {
  username: string,
  bio: null | string,
  image: null | string,
  following: boolean
};

export type Article = {
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
};

export type Comment = {
  id: number,
  createdAt: string,
  updatedAt: string,
  body: string,
  author: Profile
};

type LoginUserOpts = {|
  email: string,
  password: string
|};

type LoginUserRespOk = {|
  isOk: true,
  user: User
|};

type LoginUserRespErr = {|
  isOk: false
|};

export type LoginUserResp = LoginUserRespOk | LoginUserRespErr;

export const loginUser = (fields: LoginUserOpts): Promise<LoginUserResp> =>
  fetch(`${ENDPOINT}/users/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({ user: fields })
  }).then(response => {
    if (response.status === 200) {
      return response.json().then(({ user }) => ({
        isOk: true,
        user
      }));
    } else if (response.status === 422) {
      return {
        isOk: false
      };
    } else {
      throw new Error(`expected status 200 or 422 but got ${response.status}`);
    }
  });

type RegisterUserOpts = {|
  username: string,
  email: string,
  password: string
|};

type RegisterUserRespOk = {|
  isOk: true,
  user: User
|};

type RegisterUserRespErr = {|
  isOk: false,
  errors: {
    username?: string[],
    email?: string[],
    password?: string[]
  }
|};

export type RegisterUserResp = RegisterUserRespOk | RegisterUserRespErr;

export const registerUser = (
  fields: RegisterUserOpts
): Promise<RegisterUserResp> =>
  fetch(`${ENDPOINT}/users`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({ user: fields })
  }).then(response => {
    if (response.status === 200) {
      return response.json().then(({ user }) => ({
        isOk: true,
        user
      }));
    } else if (response.status === 422) {
      return response.json().then(({ errors }) => ({
        isOk: false,
        errors
      }));
    } else {
      throw new Error(`expected status 200 or 422 but got ${response.status}`);
    }
  });

type GetCurrentUserOpts = {|
  token: string
|};

export const getCurrentUser = ({ token }: GetCurrentUserOpts): Promise<User> =>
  fetch(`${ENDPOINT}/user`, {
    headers: {
      authorization: `Token ${token}`
    }
  }).then(response => {
    if (response.status === 200) {
      return response.json().then(({ user }) => user);
    } else {
      throw new Error(`expected status 200 but got ${response.status}`);
    }
  });

type UpdateCurrentUserOpts = {|
  token: string,
  username?: string,
  email?: string,
  password?: string,
  image?: null | string,
  bio?: null | string
|};

type UpdateCurrentUserRespOk = {|
  isOk: true,
  user: User
|};

type UpdateCurrentUserRespErr = {|
  isOk: false,
  errors: {
    username?: string[],
    email?: string[],
    password?: string[],
    image?: string[],
    bio?: string[]
  }
|};

export type UpdateCurrentUserResp =
  | UpdateCurrentUserRespOk
  | UpdateCurrentUserRespErr;

export const updateCurrentUser = ({
  token,
  ...fields
}: UpdateCurrentUserOpts): Promise<UpdateCurrentUserResp> =>
  fetch(`${ENDPOINT}/user`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      authorization: `Token ${token}`
    },
    body: JSON.stringify({ user: fields })
  }).then(response => {
    if (response.status === 200) {
      return response.json().then(({ user }) => ({
        isOk: true,
        user
      }));
    } else if (response.status === 422) {
      return response.json().then(({ errors }) => ({
        isOk: false,
        errors
      }));
    } else {
      throw new Error(`expected status 200 or 422 but got ${response.status}`);
    }
  });

type GetProfileOpts = {|
  username: string
|};

export const getProfile = ({ username }: GetProfileOpts): Promise<Profile> =>
  fetch(`${ENDPOINT}/profiles/${encodeURIComponent(username)}`).then(
    response => {
      if (response.status === 200) {
        return response.json().then(({ profile }) => profile);
      } else {
        throw new Error(`expected status 200 but got ${response.status}`);
      }
    }
  );

type ListArticlesOpts = {|
  page: number,
  perPage: number,
  tag?: string,
  author?: string,
  favorited?: string
|};

export type ListArticlesResp = {
  articlesCount: number,
  articles: Article[]
};

export const listArticles = ({
  page,
  perPage,
  tag,
  author,
  favorited
}: ListArticlesOpts): Promise<ListArticlesResp> =>
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

type GetArticleOpts = {|
  slug: string
|};

export const getArticle = ({ slug }: GetArticleOpts): Promise<Article> =>
  fetch(`${ENDPOINT}/articles/${encodeURIComponent(slug)}`).then(response => {
    if (response.status === 200) {
      return response.json().then(({ article }) => article);
    } else {
      throw new Error(`expected status 200 but got ${response.status}`);
    }
  });

type CreateArticleOpts = {|
  token: string,
  title: string,
  description: string,
  body: string,
  tagList: string[]
|};

type CreateArticleRespOk = {|
  isOk: true,
  article: Article
|};

type CreateArticleRespErr = {|
  isOk: false,
  errors: {
    title?: string[],
    description?: string[],
    body?: string[],
    tagList?: string[]
  }
|};

export type CreateArticleResp = CreateArticleRespOk | CreateArticleRespErr;

export const createArticle = ({
  token,
  ...fields
}: CreateArticleOpts): Promise<CreateArticleResp> =>
  fetch(`${ENDPOINT}/articles`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Token ${token}`
    },
    body: JSON.stringify({ article: fields })
  }).then(response => {
    if (response.status === 200) {
      return response.json().then(({ article }) => ({
        isOk: true,
        article
      }));
    } else if (response.status === 422) {
      return response.json().then(({ errors }) => ({
        isOk: false,
        errors
      }));
    } else {
      throw new Error(`expected status 200 or 422 but got ${response.status}`);
    }
  });

type UpdateArticleOpts = {|
  token: string,
  slug: string,
  title: string,
  description: string,
  body: string,
  tagList: string[]
|};

type UpdateArticleRespOk = {|
  isOk: true,
  article: Article
|};

type UpdateArticleRespErr = {|
  isOk: false,
  errors: {
    title?: string[],
    description?: string[],
    body?: string[],
    tagList?: string[]
  }
|};

export type UpdateArticleResp = UpdateArticleRespOk | UpdateArticleRespErr;

export const updateArticle = ({
  token,
  slug,
  ...fields
}: UpdateArticleOpts): Promise<UpdateArticleResp> =>
  fetch(`${ENDPOINT}/articles/${encodeURIComponent(slug)}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      authorization: `Token ${token}`
    },
    body: JSON.stringify({ article: fields })
  }).then(response => {
    if (response.status === 200) {
      return response.json().then(({ article }) => ({
        isOk: true,
        article
      }));
    } else if (response.status === 422) {
      return response.json().then(({ errors }) => ({
        isOk: false,
        errors
      }));
    } else {
      throw new Error(`expected status 200 or 422 but got ${response.status}`);
    }
  });

type DeleteArticleOpts = {|
  token: string,
  slug: string
|};

export const deleteArticle = ({
  token,
  slug
}: DeleteArticleOpts): Promise<void> =>
  fetch(`${ENDPOINT}/articles/${encodeURIComponent(slug)}`, {
    method: "DELETE",
    headers: {
      authorization: `Token ${token}`
    }
  }).then(response => {
    if (response.status !== 200) {
      throw new Error(`expected status 200 but got ${response.status}`);
    }
  });

type ListCommentsOpts = {|
  slug: string
|};

export const listComments = ({ slug }: ListCommentsOpts): Promise<Comment[]> =>
  fetch(`${ENDPOINT}/articles/${encodeURIComponent(slug)}/comments`).then(
    response => {
      if (response.status === 200) {
        return response.json().then(({ comments }) => comments);
      } else {
        throw new Error(`expected status 200 but got ${response.status}`);
      }
    }
  );

export const listTags = (): Promise<string[]> =>
  fetch(`${ENDPOINT}/tags`).then(response => {
    if (response.status === 200) {
      return response.json().then(({ tags }) => tags);
    } else {
      throw new Error(`expected status 200 but got ${response.status}`);
    }
  });
