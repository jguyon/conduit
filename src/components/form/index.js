// @flow

import * as React from "react";
import {
  StyledGlobalError,
  StyledInputContainer,
  StyledInputLabel,
  StyledInputError,
  StyledInputText,
  StyledInputTextArea,
  StyledSubmitContainer,
  StyledSubmitButton
} from "./styles";

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

export const GlobalError = (props: GlobalErrorProps) => (
  <StyledGlobalError>{props.children}</StyledGlobalError>
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
  <StyledInputContainer>
    <StyledInputLabel htmlFor={id}>{label}</StyledInputLabel>
    <StyledInputText
      ref={inputRef}
      type={type}
      id={id}
      disabled={disabled}
      testId={testId}
      describedBy={`${id}-error`}
      value={value}
      onChange={
        onChange ? event => onChange(event.currentTarget.value) : undefined
      }
    />
    <StyledInputError
      id={`${id}-error`}
      testId={testId ? `${testId}-error` : undefined}
    >
      {error}
    </StyledInputError>
  </StyledInputContainer>
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
  <StyledInputContainer>
    <StyledInputLabel htmlFor={id}>{label}</StyledInputLabel>
    <StyledInputTextArea
      ref={textAreaRef}
      id={id}
      disabled={disabled}
      testId={testId}
      describedBy={`${id}-error`}
      value={value}
      onChange={
        onChange ? event => onChange(event.currentTarget.value) : undefined
      }
    />
    <StyledInputError
      id={`${id}-error`}
      testId={testId ? `${testId}-error` : undefined}
    >
      {error}
    </StyledInputError>
  </StyledInputContainer>
);

type SubmitProps = {|
  text: string,
  disabled?: boolean
|};

export const Submit = (props: SubmitProps) => (
  <StyledSubmitContainer>
    <StyledSubmitButton disabled={props.disabled}>
      {props.text}
    </StyledSubmitButton>
  </StyledSubmitContainer>
);
