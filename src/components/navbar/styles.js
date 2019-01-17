// @flow

import * as React from "react";
import { Link } from "@reach/router";
import cn from "classnames";

type StyledNavbarProps = {|
  children: React.Node
|};

export const StyledNavbar = (props: StyledNavbarProps) => (
  <nav className={cn("flex", "justify-between", "container", "mh-auto")}>
    {props.children}
  </nav>
);

type StyledNavbarBrandProps = {|
  path: string
|};

export const StyledNavbarBrand = (props: StyledNavbarBrandProps) => (
  <Link
    to={props.path}
    className={cn("f4", "link", "green", "b", "flex", "items-center", "pa3")}
  >
    conduit
  </Link>
);

type StyledNavbarLinkGroupProps = {|
  children: React.Node
|};

export const StyledNavbarLinkGroup = (props: StyledNavbarLinkGroupProps) => (
  <div className={cn("flex-grow", "flex", "items-center", "pa3")}>
    {props.children}
  </div>
);

type StyledNavbarLinkProps = {|
  path: string,
  children: React.Node
|};

export const StyledNavbarLink = (props: StyledNavbarLinkProps) => (
  <Link
    to={props.path}
    className={cn("f6", "link", "light-silver", "hover-gray", "ml3")}
  >
    {props.children}
  </Link>
);
