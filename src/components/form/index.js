// @flow

import * as React from "react";
import cn from "classnames";
import Button from "../button";

type FormProps = {|
  onSubmit?: () => void,
  testId?: string,
  children: React.Node
|};

export const Form = ({ onSubmit, testId, children }: FormProps) => (
  <form
    data-testid={testId}
    onSubmit={
      onSubmit
        ? (event: SyntheticEvent<*>) => {
            event.preventDefault();
            onSubmit();
          }
        : undefined
    }
  >
    {children}
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
  value?: string,
  onChange?: string => void,
  disabled?: boolean,
  error?: string,
  testId?: string,
  inputRef?: { current: null | HTMLInputElement }
|};

export const TextInput = ({
  id,
  type,
  label,
  value,
  onChange,
  disabled,
  error,
  testId,
  inputRef
}: TextInputProps) => (
  <div className={cn("mv3")}>
    <label htmlFor={id} className={cn("f6", "dark-gray", "b", "db", "mb1")}>
      {label}
    </label>
    <input
      ref={inputRef}
      type={type}
      id={id}
      disabled={disabled}
      data-testid={testId}
      aria-describedby={`${id}-error`}
      className={cn(
        "input-reset",
        "ba",
        "br2",
        "b--moon-gray",
        disabled ? "bg-moon-gray" : null,
        "db",
        "w-100",
        "pa2",
        "mb1"
      )}
      value={value}
      onChange={
        onChange
          ? (event: SyntheticEvent<HTMLInputElement>) =>
              onChange(event.currentTarget.value)
          : undefined
      }
    />
    <div
      id={`${id}-error`}
      data-testid={testId ? `${testId}-error` : undefined}
      className={cn("dark-red")}
    >
      {error}
    </div>
  </div>
);

type TextAreaProps = {|
  id: string,
  label: string,
  value?: string,
  onChange?: string => void,
  disabled?: boolean,
  error?: string,
  testId?: string,
  textAreaRef?: { current: null | HTMLTextAreaElement }
|};

export const TextArea = ({
  id,
  label,
  value,
  onChange,
  disabled,
  error,
  testId,
  textAreaRef
}: TextAreaProps) => (
  <div className={cn("mv3")}>
    <label htmlFor={id} className={cn("f6", "dark-gray", "b", "db", "mb1")}>
      {label}
    </label>
    <textarea
      ref={textAreaRef}
      id={id}
      disabled={disabled}
      data-testid={testId}
      aria-describedby={`${id}-error`}
      className={cn(
        "ba",
        "br2",
        "b--moon-gray",
        disabled ? "bg-moon-gray" : null,
        "db",
        "w-100",
        "pa2",
        "mb1"
      )}
      rows="8"
      value={value}
      onChange={
        onChange
          ? (event: SyntheticEvent<HTMLTextAreaElement>) =>
              onChange(event.currentTarget.value)
          : undefined
      }
    />
    <div
      id={`${id}-error`}
      data-testid={testId ? `${testId}-error` : undefined}
      className={cn("dark-red")}
    >
      {error}
    </div>
  </div>
);

type SubmitProps = {|
  text: string,
  disabled?: boolean
|};

export const Submit = (props: SubmitProps) => (
  <div className={cn("tr", "mv4")}>
    <Button type="submit" color="green" big disabled={props.disabled}>
      {props.text}
    </Button>
  </div>
);
