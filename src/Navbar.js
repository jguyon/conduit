// @flow

import * as React from "react";
import { Link } from "@reach/router";
import cn from "classnames";
import * as api from "./api";

type NavbarLinksProps = {|
  currentUser: ?api.User
|};

const NavbarLinks = ({ currentUser }: NavbarLinksProps) => (
  <div className={cn("flex-grow", "flex", "items-center", "pa3")}>
    <Link
      className={cn("f6", "link", "light-silver", "hover-gray", "mr3")}
      to="/"
    >
      Home
    </Link>

    {currentUser ? (
      <>
        <Link
          className={cn("f6", "link", "light-silver", "hover-gray", "mr3")}
          to="/editor"
        >
          New Article
        </Link>
        <Link
          className={cn("f6", "link", "light-silver", "hover-gray", "mr3")}
          to="/settings"
        >
          Settings
        </Link>
        <Link
          className={cn("f6", "link", "light-silver", "hover-gray")}
          to={`/profile/${encodeURIComponent(currentUser.username)}`}
        >
          {currentUser.username}
        </Link>
      </>
    ) : (
      <>
        <Link
          className={cn("f6", "link", "light-silver", "hover-gray", "mr3")}
          to="/login"
        >
          Sign in
        </Link>
        <Link
          className={cn("f6", "link", "light-silver", "hover-gray")}
          to="/register"
        >
          Sign up
        </Link>
      </>
    )}
  </div>
);

type NavbarProps =
  | {|
      placeholder: true
    |}
  | {|
      placeholder?: false,
      currentUser: ?api.User
    |};

const Navbar = (props: NavbarProps) => (
  <nav className={cn("flex", "justify-between", "container", "mh-auto")}>
    <Link
      className={cn("f4", "link", "green", "b", "flex", "items-center", "pa3")}
      to="/"
    >
      conduit
    </Link>

    {props.placeholder ? null : <NavbarLinks currentUser={props.currentUser} />}
  </nav>
);

export default Navbar;
