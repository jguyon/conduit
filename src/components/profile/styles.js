// @flow

import * as React from "react";
import cn from "classnames";
import Banner from "../banner";
import Avatar from "../avatar";
import PlaceholderText from "../placeholder-text";
import Button from "../button";
import { Tabs, TabItem } from "../tabs";
import Separator from "../separator";
import Pagination from "../pagination";

type StyledBannerProps = {|
  children: React.Node
|};

export const StyledBanner = (props: StyledBannerProps) => (
  <Banner bg="near-white" fg="dark-gray" className={cn("tc")}>
    {props.children}
  </Banner>
);

type StyledBannerAvatarProps =
  | {|
      placeholder: true
    |}
  | {|
      placeholder?: false,
      username: string,
      image: ?string
    |};

export const StyledBannerAvatar = (props: StyledBannerAvatarProps) => {
  const className = cn("shadow-1", "mb3");
  const size = 3;

  if (props.placeholder) {
    return <Avatar placeholder size={size} className={className} />;
  } else {
    return (
      <Avatar
        size={size}
        className={className}
        username={props.username}
        image={props.image}
      />
    );
  }
};

type StyledBannerUsernameProps =
  | {|
      placeholder: true
    |}
  | {|
      placeholder?: false,
      username: string
    |};

export const StyledBannerUsername = (props: StyledBannerUsernameProps) => {
  if (props.placeholder) {
    return (
      <div className={cn("f4")}>
        <PlaceholderText className={cn("w4", "shadow-1")} />
      </div>
    );
  } else {
    return (
      <h1 className={cn("f4", "ma0", "text-shadow-1")}>{props.username}</h1>
    );
  }
};

type StyledBannerBioProps =
  | {|
      placeholder: true
    |}
  | {|
      placeholder?: false,
      bio: ?string
    |};

export const StyledBannerBio = (props: StyledBannerBioProps) => {
  if (props.placeholder) {
    return (
      <div className={cn("f5", "light-silver", "mv2")}>
        <PlaceholderText className={cn("w5")} />
      </div>
    );
  } else {
    return (
      <h2 className={cn("f5", "normal", "light-silver", "mv2")}>
        {props.bio || "I'm new here, be gentle!"}
      </h2>
    );
  }
};

type StyledBannerFollowProps =
  | {|
      placeholder: true
    |}
  | {|
      placeholder?: false,
      following: boolean,
      loading: boolean,
      username: string,
      testId?: string,
      onClick: () => void
    |};

export const StyledBannerFollow = (props: StyledBannerFollowProps) => {
  if (props.placeholder) {
    return (
      <div className={cn("f6", "ba", "b--transparent", "pv1", "ph2")}>
        &nbsp;
      </div>
    );
  } else {
    return (
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
  }
};

type StyledContainerProps = {|
  children: React.Node
|};

export const StyledContainer = React.forwardRef<
  StyledContainerProps,
  HTMLDivElement
>((props, ref) => (
  <div
    ref={ref}
    tabIndex="-1"
    role="group"
    className={cn("outline-0", "container", "mh-auto", "mv4")}
  >
    <div className={cn("w-80", "mh-auto")}>{props.children}</div>
  </div>
));

type StyledTabsProps = {|
  children: React.Node
|};

export const StyledTabs = (props: StyledTabsProps) => (
  <Tabs className={cn("mb4")}>{props.children}</Tabs>
);

type StyledTabItemProps = {|
  testId?: string,
  current?: boolean,
  onClick?: () => void,
  children: React.Node
|};

export const StyledTabItem = (props: StyledTabItemProps) => (
  <TabItem
    data-testid={props.testId}
    current={props.current}
    onClick={props.onClick}
  >
    {props.children}
  </TabItem>
);

export const StyledArticleSeparator = () => <Separator className={cn("mv4")} />;

export const StyledArticlesLoadingError = () => (
  <div className={cn("red")}>Error loading articles!</div>
);

type StyledPaginationProps = {|
  testIdPrefix: string,
  setPage: number => void,
  currentPage: number,
  pageCount: number
|};

export const StyledPagination = (props: StyledPaginationProps) => (
  <Pagination
    className={cn("mv4")}
    testIdPrefix={props.testIdPrefix}
    setPage={props.setPage}
    currentPage={props.currentPage}
    pageCount={props.pageCount}
  />
);
