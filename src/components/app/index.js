// @flow

import * as React from "react";
import { Router } from "@reach/router";
import CurrentUser from "../current-user";
import Navbar from "../navbar";
import Home from "../home";
import Article from "../article";
import Profile from "../profile";
import Login from "../login";
import Register from "../register";
import PostArticle from "../post-article";
import Settings from "../settings";
import NotFound from "../not-found";

// Simple pass-through component to avoid typing errors due to props that will
// be given via a url fragment.

type RouteProps = {
  render: React.Node | ((props: any) => React.Node)
};

const Route = ({ render, ...props }: RouteProps) =>
  typeof render === "function" ? render(props) : render;

const App = () => (
  <CurrentUser>
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
                  <Route path="/" render={<Home currentUser={currentUser} />} />
                  <Route
                    path="/article/:slug"
                    render={({ slug }) => (
                      <Article
                        key={slug}
                        slug={slug}
                        currentUser={currentUser}
                      />
                    )}
                  />
                  <Route
                    path="/profile/:username"
                    render={({ username }) => (
                      <Profile
                        key={username}
                        username={username}
                        currentUser={currentUser}
                      />
                    )}
                  />
                  <Route
                    path="/login"
                    render={<Login setCurrentUser={setCurrentUser} />}
                  />
                  <Route
                    path="/register"
                    render={<Register setCurrentUser={setCurrentUser} />}
                  />
                  {currentUser ? (
                    <Route
                      path="/editor"
                      render={
                        <PostArticle type="create" currentUser={currentUser} />
                      }
                    />
                  ) : null}
                  {currentUser ? (
                    <Route
                      path="/editor/:slug"
                      render={({ slug }) => (
                        <PostArticle
                          key={slug}
                          type="update"
                          slug={slug}
                          currentUser={currentUser}
                        />
                      )}
                    />
                  ) : null}
                  {currentUser ? (
                    <Route
                      path="/settings"
                      render={
                        <Settings
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
