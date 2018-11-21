// @flow

import * as React from "react";
import { Router } from "@reach/router";
import * as api from "./api";
import Navbar from "./Navbar";
import Home from "./Home";
import Article from "./Article";
import Profile from "./Profile";
import Login from "./Login";
import NotFound from "./NotFound";

type RouteProps = {
  render: React.Node | ((props: any) => React.Node)
};

const Route = ({ render, ...props }: RouteProps) =>
  typeof render === "function" ? render(props) : render;

const App = () => (
  <div className="sans-serif">
    <Navbar />
    <main>
      <Router>
        <Route
          path="/"
          render={
            <Home listArticles={api.listArticles} listTags={api.listTags} />
          }
        />
        <Route
          path="/article/:slug"
          render={({ slug }) => (
            <Article
              getArticle={api.getArticle}
              listComments={api.listComments}
              slug={slug}
            />
          )}
        />
        <Route
          path="/profile/:username"
          render={({ username }) => (
            <Profile
              key={username}
              getProfile={api.getProfile}
              listArticles={api.listArticles}
              username={username}
            />
          )}
        />
        <Route
          path="/login"
          render={
            <Login
              loginUser={api.loginUser}
              setCurrentUser={user => {
                console.log(user);
              }}
            />
          }
        />
        <Route default render={<NotFound />} />
      </Router>
    </main>
  </div>
);

export default App;
