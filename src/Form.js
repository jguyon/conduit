// @flow

import * as React from "react";
import cn from "classnames";

type FormProps = {|
  onSubmit: () => void,
  testId?: string,
  children: React.Node
|};

export const Form = (props: FormProps) => (
  <form
    data-testid={props.testId}
    onSubmit={(event: SyntheticEvent<*>) => {
      event.preventDefault();
      props.onSubmit();
    }}
  >
    {props.children}
  </form>
);

type GlobalErrorProps = {|
  children?: React.Node
|};

export const GlobalError = (props: GlobalErrorProps) =>
  props.children ? (
    <div role="alert" className={cn("mv3", "dark-red", "tc")}>
      {props.children}
    </div>
  ) : (
    <div role="alert" />
  );

type TextInputProps = {|
  id: string,
  type: "text" | "password",
  label: string,
  value: string,
  onChange: string => void,
  disabled?: boolean,
  error?: string,
  testId?: string,
  inputRef?: { current: null | HTMLInputElement }
|};

export const TextInput = (props: TextInputProps) => (
  <div className={cn("mv3")}>
    <label
      htmlFor={props.id}
      className={cn("f6", "dark-gray", "b", "db", "mb1")}
    >
      {props.label}
    </label>
    <input
      ref={props.inputRef}
      type={props.type}
      id={props.id}
      disabled={props.disabled}
      data-testid={props.testId}
      aria-describedby={`${props.id}-error`}
      className={cn(
        "input-reset",
        "ba",
        "br2",
        "b--moon-gray",
        props.disabled ? "bg-moon-gray" : null,
        "db",
        "w-100",
        "pa2",
        "mb1"
      )}
      value={props.value}
      onChange={(event: SyntheticEvent<HTMLInputElement>) =>
        props.onChange(event.currentTarget.value)
      }
    />
    <div
      id={`${props.id}-error`}
      data-testid={props.testId ? `${props.testId}-error` : undefined}
      className={cn("dark-red")}
    >
      {props.error}
    </div>
  </div>
);

type SubmitProps = {|
  text: string,
  disabled?: boolean
|};

export const Submit = (props: SubmitProps) => (
  <div className={cn("tr", "mv4")}>
    <input
      type="submit"
      value={props.text}
      disabled={props.disabled}
      className={cn(
        "input-reset",
        "bg-green",
        "white",
        "bn",
        "br2",
        "pv2",
        "ph3",
        props.disabled ? "o-50" : ["pointer", "dim"]
      )}
    />
  </div>
);
