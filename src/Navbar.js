// @flow

import * as React from "react";
import { Link } from "@reach/router";
import cn from "classnames";
import * as api from "./api";

type NavbarProps = {|
  currentUser: ?api.User
|};

const Navbar = ({ currentUser }: NavbarProps) => (
  <nav className={cn("flex", "justify-between", "container", "mh-auto")}>
    <Link
      className={cn("f4", "link", "green", "b", "flex", "items-center", "pa3")}
      to="/"
    >
      conduit
    </Link>

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
            New article
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
  </nav>
);

export default Navbar;
