// @flow

import * as React from "react";
import cn from "classnames";
import Separator from "../separator";
import Button from "../button";

type StyledContainerProps = {|
  children: React.Node
|};

export const StyledContainer = (props: StyledContainerProps) => (
  <div className={cn("container", "mh-auto")}>{props.children}</div>
);

export const StyledTitle = () => (
  <h1 className={cn("f2", "normal", "near-black", "tc", "mv4")}>
    Your Settings
  </h1>
);

type StyledFormContainerProps = {|
  children: React.Node
|};

export const StyledFormContainer = (props: StyledFormContainerProps) => (
  <div className={cn("w-50", "mh-auto")}>{props.children}</div>
);

export const StyledSeparator = () => <Separator className={cn("mv4")} />;

type StyledLogOutButtonProps = {|
  testId?: string,
  onClick: () => void
|};

export const StyledLogOutButton = (props: StyledLogOutButtonProps) => (
  <Button
    type="button"
    color="red"
    outline
    big
    testId={props.testId}
    onClick={props.onClick}
  >
    Or click here to log out
  </Button>
);
