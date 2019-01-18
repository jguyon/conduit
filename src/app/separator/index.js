// @flow

import * as React from "react";
import cn from "classnames";

type SeparatorProps = {
  className?: string
};

const Separator = ({ className, ...props }: SeparatorProps) => (
  <hr
    {...props}
    className={cn(className, "light-gray", "bt", "bl-0", "br-0", "bb-0")}
  />
);

export default Separator;
