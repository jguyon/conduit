// @flow

import * as React from "react";
import { Link } from "@reach/router";
import cn from "classnames";

type StyledContainerProps = {|
  children: React.Node
|};

export const StyledContainer = (props: StyledContainerProps) => (
  <div className={cn("container", "mh-auto")}>{props.children}</div>
);

type StyledHeaderProps = {|
  children: React.Node
|};

export const StyledHeader = (props: StyledHeaderProps) => (
  <div className={cn("mv4", "tc")}>{props.children}</div>
);

export const StyledTitle = () => (
  <h1 className={cn("f2", "normal", "mb2", "tc", "near-black")}>Sign in</h1>
);

type StyledRegisterLinkProps = {|
  path: string
|};

export const StyledRegisterLink = (props: StyledRegisterLinkProps) => (
  <Link
    to={props.path}
    className={cn("f6", "link", "green", "underline-hover")}
  >
    Need an account?
  </Link>
);

type StyledFormContainerProps = {|
  children: React.Node
|};

export const StyledFormContainer = (props: StyledFormContainerProps) => (
  <div className={cn("w-50", "mh-auto")}>{props.children}</div>
);
