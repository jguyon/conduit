// @flow

import * as React from "react";
import cn from "classnames";

type AvatarProps =
  | {|
      placeholder: true,
      size: 1 | 2 | 3 | 4 | 5,
      className?: string
    |}
  | {|
      placeholder?: false,
      size: 1 | 2 | 3 | 4 | 5,
      className?: string,
      username: string,
      image: ?string
    |};

const Avatar = (props: AvatarProps) => (
  <img
    alt={
      props.placeholder ? "placeholder avatar" : `${props.username}'s avatar'`
    }
    src={
      props.placeholder || !props.image
        ? "https://static.productionready.io/images/smiley-cyrus.jpg"
        : props.image
    }
    className={cn(
      props.className,
      "br-100",
      `w${props.size}`,
      `h${props.size}`,
      "dib",
      "overflow-hidden",
      props.placeholder ? "o-20" : null
    )}
  />
);

export default Avatar;
