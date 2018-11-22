// @flow

import * as React from "react";
import { Router } from "@reach/router";
import * as api from "./api";
import CurrentUser from "./CurrentUser";
import Navbar from "./Navbar";
import Home from "./Home";
import Article from "./Article";
import Profile from "./Profile";
import Login from "./Login";
import Register from "./Register";
import Settings from "./Settings";
import NotFound from "./NotFound";

type RouteProps = {
  render: React.Node | ((props: any) => React.Node)
};

const Route = ({ render, ...props }: RouteProps) =>
  typeof render === "function" ? render(props) : render;

const App = () => (
  <CurrentUser
    getCurrentUser={api.getCurrentUser}
    getToken={() => localStorage.getItem("userToken")}
    setToken={token => localStorage.setItem("userToken", token)}
    removeToken={() => localStorage.removeItem("userToken")}
  >
    {data => {
      switch (data.status) {
        case "pending":
          return (
            <div className="sans-serif">
              <Navbar placeholder />
            </div>
          );

        case "ready":
          const { currentUser, setCurrentUser } = data;

          return (
            <div className="sans-serif">
              <Navbar currentUser={currentUser} />

              <main>
                <Router>
                  <Route
                    path="/"
                    render={
                      <Home
                        listArticles={api.listArticles}
                        listTags={api.listTags}
                      />
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
                        setCurrentUser={setCurrentUser}
                      />
                    }
                  />
                  <Route
                    path="/register"
                    render={
                      <Register
                        registerUser={api.registerUser}
                        setCurrentUser={setCurrentUser}
                      />
                    }
                  />
                  {currentUser ? (
                    <Route
                      path="/settings"
                      render={
                        <Settings
                          updateCurrentUser={api.updateCurrentUser}
                          currentUser={currentUser}
                          setCurrentUser={setCurrentUser}
                          unsetCurrentUser={setCurrentUser}
                        />
                      }
                    />
                  ) : null}
                  <Route default render={<NotFound />} />
                </Router>
              </main>
            </div>
          );

        default:
          throw new Error("invalid status");
      }
    }}
  </CurrentUser>
);

export default App;
