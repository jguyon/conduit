// @flow

import * as React from "react";
import cn from "classnames";

type PageProps = {|
  page: number,
  setPage: number => void,
  current?: boolean,
  className?: string
|};

const Page = (props: PageProps) => (
  <button
    type="button"
    data-testid={`articles-page-${props.page}`}
    onClick={() => props.setPage(props.page)}
    disabled={props.current}
    className={cn(
      props.className,
      "br-pill",
      "ba",
      "pv1",
      "ph2",
      "b--green",
      props.current
        ? ["white", "bg-green"]
        : [
            "green",
            "bg-white",
            "bg-animate",
            "hover-white",
            "hover-bg-green",
            "pointer"
          ]
    )}
  >
    {props.page}
  </button>
);

type PaginationProps = {|
  currentPage: number,
  pageCount: number,
  setPage: number => void
|};

const Pagination = (props: PaginationProps) => (
  <div className={cn("mv4", "flex", "justify-center")}>
    {props.currentPage > 2 ? (
      <Page className="mr3" page={1} setPage={props.setPage} />
    ) : null}

    {props.currentPage > 1 ? (
      <Page
        className="mr1"
        page={props.currentPage - 1}
        setPage={props.setPage}
      />
    ) : null}

    <Page current page={props.currentPage} setPage={props.setPage} />

    {props.currentPage < props.pageCount ? (
      <Page
        className="ml1"
        page={props.currentPage + 1}
        setPage={props.setPage}
      />
    ) : null}

    {props.currentPage < props.pageCount - 1 ? (
      <Page className="ml3" page={props.pageCount} setPage={props.setPage} />
    ) : null}
  </div>
);

export default Pagination;
