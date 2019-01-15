// @flow

import * as React from "react";
import { Link } from "@reach/router";
import cn from "classnames";
import ArticleInfo from "../article-info";
import Button from "../button";
import PlaceholderText from "../placeholder-text";
import type { Article } from "../../lib/api";

type StyledHeadProps = {|
  children: React.Node
|};

export const StyledHead = (props: StyledHeadProps) => (
  <div className={cn("flex", "mv3")}>{props.children}</div>
);

type StyledHeadInfoProps =
  | {|
      placeholder: true
    |}
  | {|
      placeholder?: false,
      article: Article,
      pubdate?: boolean
    |};

export const StyledHeadInfo = (props: StyledHeadInfoProps) => {
  if (props.placeholder) {
    return <ArticleInfo placeholder color="green" />;
  } else {
    return (
      <ArticleInfo
        color="green"
        article={props.article}
        pubdate={props.pubdate}
      />
    );
  }
};

type StyledHeadFavoriteProps = {|
  favorited?: boolean,
  favoritesCount: number,
  loading?: boolean,
  testId?: string,
  onClick: () => void
|};

export const StyledHeadFavorite = (props: StyledHeadFavoriteProps) => (
  <div className={cn("flex-auto", "tr")}>
    <Button
      type="button"
      color="green"
      outline={!props.favorited}
      disabled={props.loading}
      testId={props.testId}
      onClick={props.onClick}
    >
      <strong>+</strong> {props.favoritesCount}
    </Button>
  </div>
);

type StyledBodyProps =
  | {|
      placeholder: true,
      children: React.Node
    |}
  | {|
      placeholder?: false,
      path: string,
      children: React.Node
    |};

export const StyledBody = (props: StyledBodyProps) => {
  if (props.placeholder) {
    return <div className={cn("moon-gray")}>{props.children}</div>;
  } else {
    return (
      <Link to={props.path} className={cn("link", "moon-gray", "hover-gray")}>
        {props.children}
      </Link>
    );
  }
};

type StyledTitleProps =
  | {|
      placeholder: true
    |}
  | {|
      placeholder?: false,
      children: React.Node
    |};

export const StyledTitle = (props: StyledTitleProps) => {
  if (props.placeholder) {
    return (
      <div className={cn("f4", "dark-gray", "mv1")}>
        <PlaceholderText className={cn("w4")} />
      </div>
    );
  } else {
    return <h3 className={cn("f4", "dark-gray", "mv1")}>{props.children}</h3>;
  }
};

type StyledDescriptionProps =
  | {|
      placeholder: true
    |}
  | {|
      placeholder?: false,
      children: React.Node
    |};

export const StyledDescription = (props: StyledDescriptionProps) => {
  if (props.placeholder) {
    return (
      <div className={cn("f5", "light-silver", "mv1")}>
        <PlaceholderText className={cn("w5")} />
      </div>
    );
  } else {
    return (
      <h4 className={cn("f5", "normal", "light-silver", "mv1")}>
        {props.children}
      </h4>
    );
  }
};

type StyledBottomProps = {|
  children: React.Node
|};

export const StyledBottom = (props: StyledBottomProps) => (
  <div
    className={cn("f6", "mv3", "h2", "flex", "justify-between", "items-center")}
  >
    {props.children}
  </div>
);

type StyledReadMoreProps = {|
  placeholder?: boolean
|};

export const StyledReadMore = (props: StyledReadMoreProps) => {
  if (props.placeholder) {
    return (
      <div>
        <PlaceholderText className={cn("w3")} />
      </div>
    );
  } else {
    return <div>Read more...</div>;
  }
};

type StyledTagsProps =
  | {|
      placeholder: true
    |}
  | {|
      placeholder?: false,
      tags: string[]
    |};

export const StyledTags = (props: StyledTagsProps) => {
  const tagBaseClassName = cn(
    "dib",
    "light-silver",
    "br-pill",
    "ba",
    "pv1",
    "ph2",
    "ml1"
  );

  if (props.placeholder) {
    const placeholderBaseClassName = cn(tagBaseClassName, "bg-current", "o-20");

    return (
      <div>
        <span className={cn(placeholderBaseClassName, "w2")}>&nbsp;</span>
        <span className={cn(placeholderBaseClassName, "w3")}>&nbsp;</span>
      </div>
    );
  } else {
    return (
      <div>
        {props.tags.map(tag => (
          <span key={tag} className={tagBaseClassName}>
            {tag}
          </span>
        ))}
      </div>
    );
  }
};
