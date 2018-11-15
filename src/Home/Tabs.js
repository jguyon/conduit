// @flow

import * as React from "react";
import cn from "classnames";

type TabsProps = {|
  children: React.Node
|};

export const Tabs = (props: TabsProps) => (
  <div className={cn("light-gray", "bb", "mv4", "flex")}>{props.children}</div>
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
      borderBottomColor: "currentColor",
      position: "relative",
      top: "1px",
      ...(current ? {} : { borderColor: "transparent" })
    }}
  >
    {children}
  </button>
);
