// @flow

import * as React from "react";
import cn from "classnames";

type TagsProps = {|
  children: React.Node
|};

export const Tags = (props: TagsProps) => (
  <div className={cn("bg-light-gray", "br2", "pa3")}>
    <h3 className={cn("f5", "normal", "mid-gray", "mt0", "mb2")}>
      Popular Tags
    </h3>

    <div>{props.children}</div>
  </div>
);

type TagItemProps =
  | {|
      placeholder: true,
      size: 2 | 3 | 4
    |}
  | {|
      placeholder?: false,
      name: string,
      onClick: () => void
    |};

export const TagItem = (props: TagItemProps) => (
  <button
    type="button"
    data-testid={props.placeholder ? undefined : `tag-${props.name}`}
    onClick={props.placeholder ? undefined : props.onClick}
    className={cn(
      props.placeholder ? [`w${props.size}`, "o-20"] : "dim",
      "button",
      "f6",
      "white",
      "bg-gray",
      "pointer",
      "br-pill",
      "bn",
      "pv1",
      "ph2",
      "mr1",
      "mb1"
    )}
  >
    {props.placeholder ? <>&nbsp;</> : props.name}
  </button>
);
