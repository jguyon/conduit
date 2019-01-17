// @flow

import * as React from "react";
import cn from "classnames";
import Button from "../button";

type StyledGlobalErrorProps = {|
  children?: React.Node
|};

export const StyledGlobalError = (props: StyledGlobalErrorProps) => {
  if (props.children) {
    return (
      <div role="alert" className={cn("mv3", "dark-red", "tc")}>
        {props.children}
      </div>
    );
  } else {
    return <div role="alert" />;
  }
};

type StyledInputContainerProps = {|
  children: React.Node
|};

export const StyledInputContainer = (props: StyledInputContainerProps) => (
  <div className={cn("mv3")}>{props.children}</div>
);

type StyledInputLabelProps = {|
  htmlFor: string,
  children: React.Node
|};

export const StyledInputLabel = (props: StyledInputLabelProps) => (
  <label
    htmlFor={props.htmlFor}
    className={cn("f6", "dark-gray", "b", "db", "mb1")}
  >
    {props.children}
  </label>
);

type StyledInputErrorProps = {|
  id?: string,
  testId?: string,
  children?: React.Node
|};

export const StyledInputError = (props: StyledInputErrorProps) => (
  <div id={props.id} data-testid={props.testId} className={cn("dark-red")}>
    {props.children}
  </div>
);

type StyledInputTextProps = {|
  type: "text" | "password",
  id?: string,
  disabled?: boolean,
  testId?: string,
  describedBy?: string,
  value?: string,
  onChange?: (SyntheticEvent<HTMLInputElement>) => void
|};

export const StyledInputText = React.forwardRef<
  StyledInputTextProps,
  HTMLInputElement
>((props, ref) => (
  <input
    ref={ref}
    type={props.type}
    id={props.id}
    disabled={props.disabled}
    data-testid={props.testId}
    aria-describedby={props.describedBy}
    value={props.value}
    onChange={props.onChange}
    className={cn(
      "input-reset",
      "ba",
      "br2",
      "b--moon-gray",
      props.disabled ? "bg-light-gray" : "bg-white",
      "db",
      "w-100",
      "pa2",
      "mb1"
    )}
  />
));

type StyledInputTextAreaProps = {|
  id?: string,
  disabled?: boolean,
  testId?: string,
  describedBy?: string,
  value?: string,
  onChange?: (SyntheticEvent<HTMLTextAreaElement>) => void
|};

export const StyledInputTextArea = React.forwardRef<
  StyledInputTextAreaProps,
  HTMLTextAreaElement
>((props, ref) => (
  <textarea
    ref={ref}
    id={props.id}
    disabled={props.disabled}
    data-testid={props.testId}
    aria-describedby={props.describedBy}
    value={props.value}
    onChange={props.onChange}
    rows="8"
    className={cn(
      "ba",
      "br2",
      "b--moon-gray",
      props.disabled ? "bg-light-gray" : "bg-white",
      "db",
      "w-100",
      "pa2",
      "mb1"
    )}
  />
));

type StyledSubmitContainerProps = {|
  children: React.Node
|};

export const StyledSubmitContainer = (props: StyledSubmitContainerProps) => (
  <div className={cn("tr", "mv4")}>{props.children}</div>
);

type StyledSubmitButtonProps = {|
  disabled?: boolean,
  children: React.Node
|};

export const StyledSubmitButton = (props: StyledSubmitButtonProps) => (
  <Button type="submit" color="green" big disabled={props.disabled}>
    {props.children}
  </Button>
);
