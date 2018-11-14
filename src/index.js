// @flow

import * as React from "react";
import * as ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

const rootNode = document.getElementById("root");

if (rootNode === null) {
  throw new Error("could not find element with id 'root'");
} else {
  ReactDOM.render(<App />, rootNode);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
