// @flow

import * as React from "react";
import cn from "classnames";

type RootProps = {|
  children: React.Node
|};

const Root = (props: RootProps) => (
  <div className={cn("sans-serif", "dark-gray")}>{props.children}</div>
);

export default Root;
