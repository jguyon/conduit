// @flow

import * as React from "react";
import cn from "classnames";

type BannerProps = {|
  bg: string,
  fg: string,
  className?: string,
  children?: React.Node
|};

const Banner = (props: BannerProps) => (
  <header className={cn(`bg-${props.bg}`, props.fg, "pa4", "shadow-inset-2")}>
    <div className={cn(props.className, "container", "mh-auto")}>
      {props.children}
    </div>
  </header>
);

export default Banner;
