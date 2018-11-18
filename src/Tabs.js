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
      current ? "green" : ["light-silver", "hover-gray", "pointer"],
      "pv2",
      "ph3",
      "ba"
    )}
    style={{
      borderTopWidth: 0,
      borderLeftWidth: 0,
      borderRightWidth: 0,
      borderBottomWidth: "2px",
      position: "relative",
      top: "1px",
      ...(current
        ? { borderColor: "currentColor" }
        : { borderColor: "transparent" })
    }}
  >
    {children}
  </button>
);
