// @flow

import * as React from "react";
import * as testing from "react-testing-library";
import "jest-dom/extend-expect";
import Request from "./Request";
import type { RequestData } from "./Request";

afterEach(testing.cleanup);

const delay = ms => new Promise(resolve => setTimeout(() => resolve(), ms));

test("renders with data", async () => {
  const rendered = testing.render(
    <Request load={() => delay(10).then(() => "data")}>
      {request => {
        switch (request.status) {
          case "pending":
            return "pending";
          case "success":
            return request.data;
          default:
            throw new Error("invalid status");
        }
      }}
    </Request>
  );

  expect(rendered.container).toHaveTextContent("pending");
  await testing.wait(() =>
    expect(rendered.container).toHaveTextContent("data")
  );
});

test("renders with error", async () => {
  const rendered = testing.render(
    <Request load={() => delay(10).then(() => Promise.reject("error"))}>
      {request => {
        switch (request.status) {
          case "pending":
            return "pending";
          case "error":
            return request.error;
          default:
            throw new Error("invalid status");
        }
      }}
    </Request>
  );

  expect(rendered.container).toHaveTextContent("pending");
  await testing.wait(() =>
    expect(rendered.container).toHaveTextContent("error")
  );
});

test("updates correctly", async () => {
  const render = (request: RequestData<string>) => {
    switch (request.status) {
      case "pending":
        return "pending";
      case "success":
        return request.data;
      default:
        throw new Error("invalid status");
    }
  };

  const rendered = testing.render(
    <Request load={() => delay(10).then(() => "one")}>{render}</Request>
  );

  rendered.rerender(
    <Request load={() => delay(20).then(() => "two")}>{render}</Request>
  );

  expect(rendered.container).toHaveTextContent("pending");
  await testing.wait(() =>
    expect(rendered.container).not.toHaveTextContent("pending")
  );
  expect(rendered.container).toHaveTextContent("two");
});
