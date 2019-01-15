// @flow

import * as React from "react";
import { Link } from "@reach/router";
import cn from "classnames";
import Avatar from "../avatar";
import PrettyDate from "../pretty-date";
import Button from "../button";

type StyledContainerProps = {|
  children: React.Node
|};

export const StyledContainer = (props: StyledContainerProps) => (
  <div className={cn("container", "mv5", "mh-auto")}>
    <div className={cn("w-60", "mh-auto")}>{props.children}</div>
  </div>
);

export const StyledLoadingError = () => (
  <div className={cn("tc", "red", "mv5")}>Error loading comments!</div>
);

type StyledLinksProps = {|
  loginPath: string,
  registerPath: string
|};

export const StyledLinks = (props: StyledLinksProps) => {
  const linkClassName = cn("link", "green", "underline-hover");

  return (
    <div className={cn("tc", "light-silver")}>
      <Link to={props.loginPath} className={linkClassName}>
        Sign in
      </Link>{" "}
      or{" "}
      <Link to={props.registerPath} className={linkClassName}>
        sign up
      </Link>{" "}
      to add comments on this article
    </div>
  );
};

type StyledCommentProps = {|
  tag: "article" | "div",
  children: React.Node
|};

export const StyledComment = (props: StyledCommentProps) =>
  React.createElement(
    props.tag,
    { className: cn("light-gray", "mv2", "ba", "br1") },
    props.children
  );

type StyledCommentBodyProps = {|
  children: React.Node
|};

export const StyledCommentBody = (props: StyledCommentBodyProps) => (
  <div className={cn("bb", "pa3")}>
    <span className={cn("dark-gray")}>{props.children}</span>
  </div>
);

type StyledCommentTextAreaProps = {|
  testId?: string,
  disabled?: boolean,
  value: string,
  onChange: (SyntheticEvent<HTMLTextAreaElement>) => void
|};

export const StyledCommentTextArea = React.forwardRef<
  StyledCommentTextAreaProps,
  HTMLTextAreaElement
>((props, ref) => (
  <div className={cn("bb")}>
    <textarea
      ref={ref}
      data-testid={props.testId}
      disabled={props.disabled}
      value={props.value}
      onChange={props.onChange}
      rows="4"
      placeholder="Write a comment..."
      className={cn(
        "w-100",
        "dark-gray",
        "bn",
        "pa3",
        "bg-transparent",
        "outline-0"
      )}
    />
  </div>
));

type StyledCommentBottomProps = {|
  children: React.Node
|};

export const StyledCommentBottom = (props: StyledCommentBottomProps) => (
  <div
    className={cn("bg-near-white", "ph3", "pv2", "f6", "flex", "items-center")}
  >
    {props.children}
  </div>
);

type StyledCommentAvatarProps = {|
  path?: string,
  username: string,
  image: ?string
|};

export const StyledCommentAvatar = (props: StyledCommentAvatarProps) => {
  if (props.path) {
    return (
      <Link className={cn("mr2", "flex", "items-center")} to={props.path}>
        <Avatar size={1} username={props.username} image={props.image} />
      </Link>
    );
  } else {
    return (
      <Avatar
        size={1}
        username={props.username}
        image={props.image}
        className={cn("mr2")}
      />
    );
  }
};

type StyledCommentUsernameProps = {|
  path: string,
  username: string
|};

export const StyledCommentUsername = (props: StyledCommentUsernameProps) => (
  <Link
    className={cn("mr2", "link", "green", "underline-hover")}
    to={props.path}
  >
    {props.username}
  </Link>
);

type StyledCommentDateProps = {|
  date: Date,
  pubdate?: boolean
|};

export const StyledCommentDate = (props: StyledCommentDateProps) => (
  <PrettyDate
    className={cn("moon-gray")}
    pubdate={props.pubdate ? "pubdate" : undefined}
    date={props.date}
  />
);

type StyledCommentRemoveProps = {|
  loading: boolean,
  testId?: string,
  onClick: () => void
|};

export const StyledCommentRemove = (props: StyledCommentRemoveProps) => (
  <div className={cn("flex-auto", "tr")}>
    <button
      type="button"
      disabled={props.loading}
      data-testid={props.testId}
      onClick={props.onClick}
      className={cn(
        "button-reset",
        "bg-transparent",
        "dark-gray",
        "bn",
        "f5",
        "pv0",
        "ph1",
        props.loading ? "o-20" : ["o-70", "pointer", "glow"]
      )}
    >
      &times;
    </button>
  </div>
);

type StyledCommentPostProps = {|
  disabled: boolean
|};

export const StyledCommentPost = (props: StyledCommentPostProps) => (
  <div className={cn("flex-auto", "tr")}>
    <Button type="submit" color="green" disabled={props.disabled}>
      Post Comment
    </Button>
  </div>
);

type StyledCommentErrorProps = {|
  children?: React.Node
|};

export const StyledCommentError = (props: StyledCommentErrorProps) => (
  <div
    role="alert"
    className={props.children ? cn("mv3", "dark-red", "tc") : undefined}
  >
    {props.children}
  </div>
);
