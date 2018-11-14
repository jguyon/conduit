// @flow

import * as React from "react";
import cn from "classnames";

const NotFound = () => (
  <div className={cn("container", "mh-auto", "tc")}>
    <h1 className={cn("f3", "normal", "mv3")}>Page not found</h1>

    <p className={cn("mv3")}>
      Sorry, we couldn't find the content you're looking for :(
    </p>
  </div>
);

export default NotFound;
