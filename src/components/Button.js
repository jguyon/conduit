// @flow

import * as React from "react";
import cn from "classnames";
import { Link } from "@reach/router";

type ButtonButtonProps = {|
  type: "button",
  onClick: () => void,
  color: string,
  outline?: boolean,
  big?: boolean,
  disabled?: boolean,
  className?: string,
  testId?: string,
  children: React.Node
|};

type ButtonSubmitProps = {|
  type: "submit",
  color: string,
  outline?: boolean,
  big?: boolean,
  disabled?: boolean,
  className?: string,
  testId?: string,
  children: React.Node
|};

type ButtonLinkProps = {|
  type: "link",
  to: string,
  color: string,
  outline?: boolean,
  big?: boolean,
  disabled?: boolean,
  className?: string,
  testId?: string,
  children: React.Node
|};

type ButtonProps = ButtonButtonProps | ButtonSubmitProps | ButtonLinkProps;

const Button = (props: ButtonProps) => {
  const baseClassName = cn(
    props.className,
    props.big ? ["f5", "pv2", "ph3"] : ["f6", "pv1", "ph2"],
    `b--${props.color}`,
    props.outline
      ? ["bg-transparent", props.color]
      : [`bg-${props.color}`, "white"],
    props.disabled ? "o-20" : ["pointer", "dim"],
    "ba",
    "br2"
  );

  switch (props.type) {
    case "button":
      return (
        <button
          type="button"
          data-testid={props.testId}
          disabled={props.disabled}
          onClick={props.onClick}
          className={cn(baseClassName, "button-reset")}
        >
          {props.children}
        </button>
      );

    case "submit":
      return (
        <button
          type="submit"
          data-testid={props.testId}
          disabled={props.disabled}
          className={cn(baseClassName, "button-reset")}
        >
          {props.children}
        </button>
      );

    case "link":
      if (props.disabled) {
        return (
          <span data-testid={props.testId} className={cn(baseClassName)}>
            {props.children}
          </span>
        );
      } else {
        return (
          <Link
            to={props.to}
            data-testid={props.testId}
            className={cn(baseClassName, "no-underline")}
          >
            {props.children}
          </Link>
        );
      }

    default:
      throw new Error("invalid type");
  }
};

export default Button;
