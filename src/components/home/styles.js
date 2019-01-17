// @flow

import * as React from "react";
import cn from "classnames";
import Banner from "../banner";
import { Tabs, TabItem } from "../tabs";
import Separator from "../separator";
import Pagination from "../pagination";

export const StyledBanner = () => (
  <Banner bg="green" fg="white" className={cn("tc")}>
    <h1 className={cn("f1", "mt0", "mb3", "text-shadow-1")}>conduit</h1>

    <h2 className={cn("f4", "normal", "ma0")}>
      A place to share your knowledge.
    </h2>
  </Banner>
);

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
    {props.children}
  </div>
));

type StyledContainerMainProps = {|
  children: React.Node
|};

export const StyledContainerMain = (props: StyledContainerMainProps) => (
  <div className={cn("fl", "pr3", "w-70")}>{props.children}</div>
);

type StyledContainerAsideProps = {|
  children: React.Node
|};

export const StyledContainerAside = (props: StyledContainerAsideProps) => (
  <div className={cn("fl", "pl3", "w-30")}>{props.children}</div>
);

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

export const StyledArticlesLoadingError = () => (
  <div className={cn("red")}>Error loading articles!</div>
);

export const StyledArticleSeparator = () => <Separator className={cn("mv4")} />;

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

export const StyledTagLoadingError = () => (
  <div className={cn("f6", "red")}>Error loading tags!</div>
);

type StyledTagsProps = {|
  children: React.Node
|};

export const StyledTags = (props: StyledTagsProps) => (
  <div className={cn("bg-light-gray", "br2", "pa3")}>
    <h3 className={cn("f5", "normal", "mid-gray", "mt0", "mb2")}>
      Popular Tags
    </h3>

    <div>{props.children}</div>
  </div>
);

type StyledTagItemProps =
  | {|
      placeholder: true,
      size: 1 | 2 | 3 | 4 | 5
    |}
  | {|
      placeholder?: false,
      name: string,
      testId?: string,
      active: boolean,
      onClick: () => void
    |};

export const StyledTagItem = (props: StyledTagItemProps) => (
  <button
    type="button"
    disabled={props.placeholder ? undefined : props.active}
    data-testid={props.placeholder ? undefined : props.testId}
    onClick={props.placeholder ? undefined : props.onClick}
    className={cn(
      props.placeholder
        ? [`w${props.size}`, "o-20"]
        : props.active
        ? "o-50"
        : "dim",
      "button",
      "f6",
      "white",
      "bg-gray",
      "pointer",
      "br-pill",
      "bn",
      "pv1",
      "ph2",
      "mr1",
      "mb1"
    )}
  >
    {props.placeholder ? <>&nbsp;</> : props.name}
  </button>
);
