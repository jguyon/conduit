// @flow

import * as React from "react";
import cn from "classnames";
import { Link } from "@reach/router";
import Avatar from "../avatar";
import PlaceholderText from "../placeholder-text";
import PrettyDate from "../pretty-date";

type StyledRootProps = {|
  className?: string,
  children: React.Node
|};

export const StyledRoot = (props: StyledRootProps) => (
  <div className={cn(props.className, "flex")}>{props.children}</div>
);

type StyledAvatarProps =
  | {|
      placeholder: true
    |}
  | {|
      placeholder?: false,
      path: string,
      username: string,
      image: ?string
    |};

export const StyledAvatar = (props: StyledAvatarProps) => {
  if (props.placeholder) {
    return (
      <div>
        <Avatar placeholder size={2} />
      </div>
    );
  } else {
    return (
      <Link to={props.path}>
        <Avatar size={2} username={props.username} image={props.image} />
      </Link>
    );
  }
};

type StyledInfosProps = {|
  children: React.Node
|};

export const StyledInfos = (props: StyledInfosProps) => (
  <div className={cn("ml2")}>{props.children}</div>
);

type StyledUsernameProps =
  | {|
      placeholder: true,
      color: "green" | "white"
    |}
  | {|
      placeholder?: false,
      color: "green" | "white",
      path: string,
      username: string
    |};

export const StyledUsername = (props: StyledUsernameProps) => {
  if (props.placeholder) {
    return <PlaceholderText className={cn(props.color, "w3")} />;
  } else {
    return (
      <Link
        className={cn("link", props.color, "underline-hover")}
        to={props.path}
      >
        {props.username}
      </Link>
    );
  }
};

type StyledDateProps =
  | {|
      placeholder: true
    |}
  | {|
      placeholder?: false,
      pubdate?: boolean,
      date: Date
    |};

export const StyledDate = (props: StyledDateProps) => {
  if (props.placeholder) {
    return <PlaceholderText className={cn("moon-gray", "f6", "w4")} />;
  } else {
    return (
      <PrettyDate
        className={cn("moon-gray", "f6")}
        pudate={props.pubdate ? "pubdate" : undefined}
        date={props.date}
      />
    );
  }
};
