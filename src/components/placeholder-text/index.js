// @flow

import * as React from "react";
import cn from "classnames";

type PlaceholderTextProps = {|
  className?: string
|};

const PlaceholderText = (props: PlaceholderTextProps) => (
  <span className={cn(props.className, "dib", "bg-current", "o-20")}>
    &nbsp;
  </span>
);

export default PlaceholderText;
