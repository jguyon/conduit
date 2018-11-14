// @flow

import * as React from "react";
import { Router } from "@reach/router";
import Navbar from "./Navbar";
import Home from "./Home";
import NotFound from "./NotFound";

const App = () => (
  <div className="sans-serif">
    <Navbar />
    <main>
      <Router>
        <Home path="/" />
        <NotFound default />
      </Router>
    </main>
  </div>
);

export default App;
