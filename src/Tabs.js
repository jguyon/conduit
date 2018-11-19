// @flow

import * as React from "react";
import cn from "classnames";

type TabsProps = {
  className?: string,
  children: React.Node
};

export const Tabs = ({ className, children, ...props }: TabsProps) => (
  <div {...props} className={cn(className, "light-gray", "bb", "flex")}>
    {children}
  </div>
);

type TabItemProps = {
  current?: boolean,
  children: React.Node
};

export const TabItem = ({ current, children, ...props }: TabItemProps) => (
  <button
    {...props}
    type="button"
    disabled={current}
    className={cn(
      "button",
      "bg-transparent",
      current
        ? ["green", "b--green"]
        : ["light-silver", "b--transparent", "hover-gray", "pointer"],
      "bb",
      "bw1",
      "bl-0",
      "bt-0",
      "br-0",
      "pv2",
      "ph3",
      "relative"
    )}
    style={{
      top: 1
    }}
  >
    {children}
  </button>
);
