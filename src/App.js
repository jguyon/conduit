// @flow

import * as React from "react";
import { Router } from "@reach/router";
import * as api from "./api";
import Navbar from "./Navbar";
import Home from "./Home";
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
        <Route path="/" render={<Home listArticles={api.listArticles} />} />
        <Route default render={<NotFound />} />
      </Router>
    </main>
  </div>
);

export default App;
