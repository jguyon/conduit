// @flow

import * as React from "react";
import * as testing from "react-testing-library";
import "jest-dom/extend-expect";
import Register from "../Register";
import * as api from "../../lib/api";

const registerUser = jest.spyOn(api, "registerUser");

const user: api.User = {
  email: "john@doe.com",
  token: "abcd",
  username: "johndoe",
  bio: null,
  image: null
};

beforeEach(() => {
  window.history.pushState(null, "", "/register");
});

afterEach(() => {
  testing.cleanup();
  registerUser.mockReset();
});

test("sets current user with valid fields", async () => {
  const setCurrentUser = jest.fn(() => {});

  registerUser.mockReturnValue(
    Promise.resolve({
      isOk: true,
      user
    })
  );

  const rendered = testing.render(<Register setCurrentUser={setCurrentUser} />);

  testing.fireEvent.change(rendered.getByTestId("sign-up-username"), {
    target: { value: "johndoe" }
  });

  testing.fireEvent.change(rendered.getByTestId("sign-up-email"), {
    target: { value: "john@doe.com" }
  });

  testing.fireEvent.change(rendered.getByTestId("sign-up-password"), {
    target: { value: "password" }
  });

  testing.fireEvent.submit(rendered.getByTestId("sign-up-form"));

  await testing.wait(() => expect(window.location.pathname).toBe("/"));

  expect(registerUser).toHaveBeenCalledTimes(1);
  expect(registerUser).toHaveBeenLastCalledWith({
    username: "johndoe",
    email: "john@doe.com",
    password: "password"
  });

  expect(setCurrentUser).toHaveBeenCalledTimes(1);
  expect(setCurrentUser).toHaveBeenLastCalledWith(user);
});

test("displays errors with invalid fields", async () => {
  const setCurrentUser = jest.fn(() => {});

  registerUser.mockReturnValue(
    Promise.resolve({
      isOk: false,
      errors: {
        username: ["is invalid"],
        email: ["is invalid"],
        password: ["is invalid"]
      }
    })
  );

  const rendered = testing.render(<Register setCurrentUser={setCurrentUser} />);

  testing.fireEvent.change(rendered.getByTestId("sign-up-username"), {
    target: { value: "johndoe" }
  });

  testing.fireEvent.change(rendered.getByTestId("sign-up-email"), {
    target: { value: "john@doe.com" }
  });

  testing.fireEvent.change(rendered.getByTestId("sign-up-password"), {
    target: { value: "password" }
  });

  testing.fireEvent.submit(rendered.getByTestId("sign-up-form"));

  expect(registerUser).toHaveBeenCalledTimes(1);
  expect(registerUser).toHaveBeenLastCalledWith({
    username: "johndoe",
    email: "john@doe.com",
    password: "password"
  });

  await testing.wait(() => {
    expect(rendered.getByTestId("sign-up-username-error")).toHaveTextContent(
      "is invalid"
    );
    expect(rendered.getByTestId("sign-up-email-error")).toHaveTextContent(
      "is invalid"
    );
    expect(rendered.getByTestId("sign-up-password-error")).toHaveTextContent(
      "is invalid"
    );
  });

  expect(setCurrentUser).not.toHaveBeenCalled();
});
