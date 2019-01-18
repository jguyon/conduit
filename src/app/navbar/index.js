// @flow

import * as React from "react";
import {
  StyledNavbar,
  StyledNavbarBrand,
  StyledNavbarLinkGroup,
  StyledNavbarLink
} from "./styles";
import type { User } from "../../lib/api";

type NavbarLinksProps = {|
  currentUser: ?User
|};

const NavbarLinks = ({ currentUser }: NavbarLinksProps) => (
  <StyledNavbarLinkGroup>
    <StyledNavbarLink path="/">Home</StyledNavbarLink>

    {currentUser ? (
      <>
        <StyledNavbarLink path="/editor">New Article</StyledNavbarLink>
        <StyledNavbarLink path="/settings">Settings</StyledNavbarLink>
        <StyledNavbarLink
          path={`/profile/${encodeURIComponent(currentUser.username)}`}
        >
          {currentUser.username}
        </StyledNavbarLink>
      </>
    ) : (
      <>
        <StyledNavbarLink path="/login">Sign in</StyledNavbarLink>
        <StyledNavbarLink path="/register">Sign up</StyledNavbarLink>
      </>
    )}
  </StyledNavbarLinkGroup>
);

type NavbarProps =
  | {|
      placeholder: true
    |}
  | {|
      placeholder?: false,
      currentUser: ?User
    |};

const Navbar = (props: NavbarProps) => (
  <StyledNavbar>
    <StyledNavbarBrand path="/" />
    {props.placeholder ? null : <NavbarLinks currentUser={props.currentUser} />}
  </StyledNavbar>
);

export default Navbar;
