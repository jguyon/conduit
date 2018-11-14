// @flow

import * as React from "react";
import * as testing from "react-testing-library";
import "jest-dom/extend-expect";
import Request from "./Request";
import type { RequestData } from "./Request";

afterEach(testing.cleanup);

const delay = ms => new Promise(resolve => setTimeout(() => resolve(), ms));

test("renders with data", async () => {
  const sleep = delay(10);

  const rendered = testing.render(
    <Request load={() => sleep.then(() => "data")}>
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
  await sleep;
  expect(rendered.container).toHaveTextContent("data");
});

test("renders with error", async () => {
  const sleep = delay(10);

  const rendered = testing.render(
    <Request load={() => sleep.then(() => Promise.reject("error"))}>
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
  await sleep;
  expect(rendered.container).toHaveTextContent("error");
});

test("updates correctly", async () => {
  const sleep1 = delay(10);
  const sleep2 = delay(20);

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
    <Request load={() => sleep1.then(() => "one")}>{render}</Request>
  );

  rendered.rerender(
    <Request load={() => sleep2.then(() => "two")}>{render}</Request>
  );

  await sleep1;
  expect(rendered.container).toHaveTextContent("pending");
  await sleep2;
  expect(rendered.container).toHaveTextContent("two");
});
