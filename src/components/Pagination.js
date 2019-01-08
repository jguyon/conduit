// @flow

import * as React from "react";
import cn from "classnames";

type PageProps = {|
  page: number,
  setPage: number => void,
  current?: boolean,
  testIdPrefix?: string,
  className?: string
|};

const Page = (props: PageProps) => (
  <button
    type="button"
    data-testid={
      props.testIdPrefix
        ? `${props.testIdPrefix}-page-${props.page}`
        : undefined
    }
    onClick={() => props.setPage(props.page)}
    disabled={props.current}
    className={cn(
      props.className,
      "button",
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

type PaginationProps = {
  currentPage: number,
  pageCount: number,
  setPage: number => void,
  testIdPrefix?: string,
  className?: string
};

const Pagination = ({
  currentPage,
  pageCount,
  setPage,
  testIdPrefix,
  className,
  ...props
}: PaginationProps) => (
  <div {...props} className={cn(className, "flex", "justify-center")}>
    {pageCount > 1 ? (
      <>
        {currentPage > 2 ? (
          <Page
            className="mr3"
            page={1}
            setPage={setPage}
            testIdPrefix={testIdPrefix}
          />
        ) : null}

        {currentPage > 1 ? (
          <Page
            className="mr1"
            page={currentPage - 1}
            setPage={setPage}
            testIdPrefix={testIdPrefix}
          />
        ) : null}

        <Page
          current
          page={currentPage}
          setPage={setPage}
          testIdPrefix={testIdPrefix}
        />

        {currentPage < pageCount ? (
          <Page
            className="ml1"
            page={currentPage + 1}
            setPage={setPage}
            testIdPrefix={testIdPrefix}
          />
        ) : null}

        {currentPage < pageCount - 1 ? (
          <Page
            className="ml3"
            page={pageCount}
            setPage={setPage}
            testIdPrefix={testIdPrefix}
          />
        ) : null}
      </>
    ) : null}
  </div>
);

export default Pagination;
