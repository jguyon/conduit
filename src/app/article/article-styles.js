// @flow

import * as React from "react";
import cn from "classnames";
import Banner from "../banner";
import PlaceholderText from "../placeholder-text";
import ArticleInfo from "../article-info";
import Button from "../button";
import Separator from "../separator";
import type { Article } from "../../lib/api";

type StyledBannerProps = {|
  children: React.Node
|};

export const StyledBanner = (props: StyledBannerProps) => (
  <Banner bg="dark-gray" fg="white">
    {props.children}
  </Banner>
);

type StyledBannerTitleProps =
  | {|
      placeholder: true
    |}
  | {|
      placeholder?: false,
      children: React.Node
    |};

export const StyledBannerTitle = (props: StyledBannerTitleProps) => {
  if (props.placeholder) {
    return (
      <div className={cn("f1", "mt0", "mb3")}>
        <PlaceholderText className={cn("w-40")} />
      </div>
    );
  } else {
    return (
      <h1 className={cn("f1", "mt0", "mb3", "text-shadow-1")}>
        {props.children}
      </h1>
    );
  }
};

type StyledBannerBottomProps = {|
  children: React.Node
|};

export const StyledBannerBottom = (props: StyledBannerBottomProps) => (
  <div className={cn("flex", "items-center")}>{props.children}</div>
);

type StyledContainerProps = {|
  children: React.Node
|};

export const StyledContainer = (props: StyledContainerProps) => (
  <div className={cn("container", "mh-auto", "mv4")}>{props.children}</div>
);

type StyledContainerBottomProps = {|
  children: React.Node
|};

export const StyledContainerBottom = (props: StyledContainerBottomProps) => (
  <div className={cn("flex", "justify-center", "items-center", "mv4")}>
    {props.children}
  </div>
);

type StyledInfoProps =
  | {|
      placeholder: true,
      banner?: boolean
    |}
  | {|
      placeholder?: false,
      banner?: boolean,
      article: Article,
      pubdate?: boolean
    |};

export const StyledInfo = (props: StyledInfoProps) => {
  const color = props.banner ? "white" : "green";

  if (props.placeholder) {
    return <ArticleInfo placeholder className={cn("mr4")} color={color} />;
  } else {
    return (
      <ArticleInfo
        className={cn("mr4")}
        color={color}
        article={props.article}
        pubdate={props.pubdate}
      />
    );
  }
};

type StyledEditProps = {|
  path: string,
  testId?: string
|};

export const StyledEdit = (props: StyledEditProps) => (
  <Button
    type="link"
    color="light-silver"
    outline
    to={props.path}
    testId={props.testId}
  >
    Edit Article
  </Button>
);

type StyledDeleteProps = {|
  loading: boolean,
  testId?: string,
  onClick: () => void
|};

export const StyledDelete = (props: StyledDeleteProps) => (
  <Button
    type="button"
    color="light-red"
    className={cn("ml2")}
    outline
    disabled={props.loading}
    testId={props.testId}
    onClick={props.onClick}
  >
    Delete Article
  </Button>
);

type StyledFollowProps = {|
  following: boolean,
  loading: boolean,
  username: string,
  testId?: string,
  onClick: () => void
|};

export const StyledFollow = (props: StyledFollowProps) => (
  <Button
    type="button"
    color="light-silver"
    outline={!props.following}
    disabled={props.loading}
    testId={props.testId}
    onClick={props.onClick}
  >
    {props.following ? "Unfollow" : "Follow"} {props.username}
  </Button>
);

type StyledFavoriteProps = {|
  favorited: boolean,
  favoritesCount: number,
  loading: boolean,
  testId?: string,
  onClick: () => void
|};

export const StyledFavorite = (props: StyledFavoriteProps) => (
  <Button
    type="button"
    color="green"
    className={cn("ml2")}
    outline={!props.favorited}
    disabled={props.loading}
    testId={props.testId}
    onClick={props.onClick}
  >
    {props.favorited ? "Unfavorite" : "Favorite"} Article (
    {props.favoritesCount})
  </Button>
);

type StyledTagsProps = {|
  tags: string[]
|};

export const StyledTags = (props: StyledTagsProps) => (
  <div className={cn("mv4", "light-silver", "f6")}>
    {props.tags.map(tag => (
      <span
        key={tag}
        className={cn("dib", "br-pill", "ba", "pv1", "ph2", "mr1")}
      >
        {tag}
      </span>
    ))}
  </div>
);

export const StyledSeparator = () => <Separator className={cn("mv4")} />;

type StyledBodyProps = {|
  children: React.Node
|};

export const StyledBody = (props: StyledBodyProps) => (
  <div className={cn("f4", "dark-gray", "lh-copy", "mv4")}>
    {props.children}
  </div>
);

type StyledBodyHrProps = {};

export const StyledBodyHr = (props: StyledBodyHrProps) => (
  <hr {...props} className={cn("light-gray", "bt", "bl-0", "br-0", "bb-0")} />
);

type StyledBodyLinkProps = {
  children?: React.Node
};

export const StyledBodyLink = ({ children, ...props }: StyledBodyLinkProps) => (
  <a {...props} className={cn("link", "green", "underline-hover")}>
    {children}
  </a>
);
