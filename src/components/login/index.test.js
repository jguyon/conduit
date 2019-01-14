// @flow

import * as React from "react";
import * as testing from "react-testing-library";
import "jest-dom/extend-expect";
import Login from ".";
import * as api from "../../lib/api";

const loginUser = jest.spyOn(api, "loginUser");

const user: api.User = {
  email: "john@doe.com",
  token: "abcd",
  username: "johndoe",
  bio: null,
  image: null
};

beforeEach(() => {
  window.history.pushState(null, "", "/login");
});

afterEach(() => {
  testing.cleanup();
  loginUser.mockReset();
});

test("sets current user with valid credentials", async () => {
  const setCurrentUser = jest.fn(() => {});

  loginUser.mockReturnValue(
    Promise.resolve({
      isOk: true,
      user
    })
  );

  const rendered = testing.render(<Login setCurrentUser={setCurrentUser} />);

  testing.fireEvent.change(rendered.getByTestId("sign-in-email"), {
    target: { value: "john@doe.com" }
  });

  testing.fireEvent.change(rendered.getByTestId("sign-in-password"), {
    target: { value: "password" }
  });

  testing.fireEvent.submit(rendered.getByTestId("sign-in-form"));

  await testing.wait(() => expect(window.location.pathname).toBe("/"));

  expect(loginUser).toHaveBeenCalledTimes(1);
  expect(loginUser).toHaveBeenLastCalledWith({
    email: "john@doe.com",
    password: "password"
  });

  expect(setCurrentUser).toHaveBeenCalledTimes(1);
  expect(setCurrentUser).toHaveBeenLastCalledWith(user);
});

test("displays error with invalid credentials", async () => {
  const setCurrentUser = jest.fn(() => {});

  loginUser.mockReturnValue(
    Promise.resolve({
      isOk: false
    })
  );

  const rendered = testing.render(<Login setCurrentUser={setCurrentUser} />);

  testing.fireEvent.change(rendered.getByTestId("sign-in-email"), {
    target: { value: "john@doe.com" }
  });

  testing.fireEvent.change(rendered.getByTestId("sign-in-password"), {
    target: { value: "password" }
  });

  testing.fireEvent.submit(rendered.getByTestId("sign-in-form"));

  expect(loginUser).toHaveBeenCalledTimes(1);
  expect(loginUser).toHaveBeenLastCalledWith({
    email: "john@doe.com",
    password: "password"
  });

  await testing.wait(() => {
    rendered.getByText("Invalid email or password");
  });

  expect(setCurrentUser).not.toHaveBeenCalled();
});
