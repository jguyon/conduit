// @flow

import * as React from "react";
import cn from "classnames";

type StyledContainerProps = {|
  children: React.Node
|};

export const StyledContainer = (props: StyledContainerProps) => (
  <div className={cn("container", "mh-auto")}>{props.children}</div>
);

type StyledTitleProps = {|
  children: React.Node
|};

export const StyledTitle = (props: StyledTitleProps) => (
  <h1 className={cn("f2", "normal", "near-black", "tc", "mv4")}>
    {props.children}
  </h1>
);

type StyledFormContainerProps = {|
  children: React.Node
|};

export const StyledFormContainer = (props: StyledFormContainerProps) => (
  <div className={cn("w-80", "mh-auto")}>{props.children}</div>
);
