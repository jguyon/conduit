// @flow

import * as React from "react";
import cn from "classnames";

const Banner = () => (
  <header className={cn("bg-green", "white", "pa4", "shadow-inset-2")}>
    <div className={cn("container", "mh-auto", "tc")}>
      <h1 className={cn("f1", "mt0", "mb3", "text-shadow-1")}>conduit</h1>

      <h2 className={cn("f4", "normal", "ma0")}>
        A place to share your knowledge.
      </h2>
    </div>
  </header>
);

export default Banner;
