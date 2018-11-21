// @flow

import * as React from "react";
import * as testing from "react-testing-library";
import "jest-dom/extend-expect";
import Login from "./Login";
import type { User } from "./api";

const user: User = {
  email: "john@doe.com",
  token: "abcd",
  username: "johndoe",
  bio: null,
  image: ""
};

afterEach(testing.cleanup);

test("sets current user with valid credentials", async () => {
  const setCurrentUser = jest.fn(() => {});

  const loginUser = jest.fn(() =>
    Promise.resolve({
      isOk: true,
      user
    })
  );

  const rendered = testing.render(
    <Login loginUser={loginUser} setCurrentUser={setCurrentUser} />
  );

  testing.fireEvent.change(rendered.getByTestId("sign-in-email"), {
    target: { value: "john@doe.com" }
  });

  testing.fireEvent.change(rendered.getByTestId("sign-in-password"), {
    target: { value: "password" }
  });

  testing.fireEvent.submit(rendered.getByTestId("sign-in-form"));

  await testing.wait(() => expect(window.location.pathname).toBe("/"));

  expect(loginUser.mock.calls.length).toBe(1);
  expect(loginUser.mock.calls[0]).toEqual([
    { email: "john@doe.com", password: "password" }
  ]);

  expect(setCurrentUser.mock.calls.length).toBe(1);
  expect(setCurrentUser.mock.calls[0]).toEqual([user]);
});

test("displays error with invalid credentials", async () => {
  const setCurrentUser = jest.fn(() => {});

  const loginUser = jest.fn(() =>
    Promise.resolve({
      isOk: false
    })
  );

  const rendered = testing.render(
    <Login loginUser={loginUser} setCurrentUser={setCurrentUser} />
  );

  testing.fireEvent.change(rendered.getByTestId("sign-in-email"), {
    target: { value: "john@doe.com" }
  });

  testing.fireEvent.change(rendered.getByTestId("sign-in-password"), {
    target: { value: "password" }
  });

  testing.fireEvent.submit(rendered.getByTestId("sign-in-form"));

  expect(loginUser.mock.calls.length).toBe(1);
  expect(loginUser.mock.calls[0]).toEqual([
    { email: "john@doe.com", password: "password" }
  ]);

  await testing.wait(() => {
    rendered.getByText("Invalid email or password");
  });

  expect(setCurrentUser.mock.calls.length).toBe(0);
});
