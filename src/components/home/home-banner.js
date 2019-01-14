// @flow

import * as React from "react";
import cn from "classnames";
import Banner from "../banner";

const HomeBanner = () => (
  <Banner bg="green" fg="white" className={cn("tc")}>
    <h1 className={cn("f1", "mt0", "mb3", "text-shadow-1")}>conduit</h1>

    <h2 className={cn("f4", "normal", "ma0")}>
      A place to share your knowledge.
    </h2>
  </Banner>
);

export default HomeBanner;
