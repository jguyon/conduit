// @flow

import * as React from "react";
import * as testing from "react-testing-library";
import "jest-dom/extend-expect";
import Settings from "./Settings";
import * as api from "./api";

const updateCurrentUser = jest.spyOn(api, "updateCurrentUser");

const user: api.User = {
  email: "john@doe.com",
  token: "abcd",
  username: "johndoe",
  bio: null,
  image: null
};

beforeEach(() => {
  window.history.pushState(null, "", "/settings");
});

afterEach(() => {
  testing.cleanup();
  updateCurrentUser.mockReset();
});

test("updates current user with valid fields", async () => {
  const setCurrentUser = jest.fn(() => {});

  const updatedUser = {
    ...user,
    username: "newjohndoe",
    email: "newjohn@doe.com",
    image: "newimage",
    bio: "newbio"
  };

  updateCurrentUser.mockReturnValue(
    Promise.resolve({
      isOk: true,
      user: updatedUser
    })
  );

  const rendered = testing.render(
    <Settings
      currentUser={user}
      setCurrentUser={setCurrentUser}
      unsetCurrentUser={() => {}}
    />
  );

  testing.fireEvent.change(rendered.getByTestId("settings-username"), {
    target: { value: "newjohndoe" }
  });

  testing.fireEvent.change(rendered.getByTestId("settings-email"), {
    target: { value: "newjohn@doe.com" }
  });

  testing.fireEvent.change(rendered.getByTestId("settings-password"), {
    target: { value: "newpassword" }
  });

  testing.fireEvent.change(rendered.getByTestId("settings-image"), {
    target: { value: "newimage" }
  });

  testing.fireEvent.change(rendered.getByTestId("settings-bio"), {
    target: { value: "newbio" }
  });

  testing.fireEvent.submit(rendered.getByTestId("settings-form"));

  await testing.wait(() =>
    expect(window.location.pathname).toBe("/profile/newjohndoe")
  );

  expect(updateCurrentUser).toHaveBeenCalledTimes(1);
  expect(updateCurrentUser).toHaveBeenLastCalledWith({
    token: "abcd",
    username: "newjohndoe",
    email: "newjohn@doe.com",
    password: "newpassword",
    image: "newimage",
    bio: "newbio"
  });

  expect(setCurrentUser).toHaveBeenCalledTimes(1);
  expect(setCurrentUser).toHaveBeenLastCalledWith(updatedUser);
});

test("displays errors with invalid fields", async () => {
  const setCurrentUser = jest.fn(() => {});

  updateCurrentUser.mockReturnValue(
    Promise.resolve({
      isOk: false,
      errors: {
        username: ["is invalid"],
        email: ["is invalid"],
        password: ["is invalid"],
        image: ["is invalid"],
        bio: ["is invalid"]
      }
    })
  );

  const rendered = testing.render(
    <Settings
      currentUser={user}
      setCurrentUser={setCurrentUser}
      unsetCurrentUser={() => {}}
    />
  );

  testing.fireEvent.change(rendered.getByTestId("settings-username"), {
    target: { value: "newjohndoe" }
  });

  testing.fireEvent.change(rendered.getByTestId("settings-email"), {
    target: { value: "newjohn@doe.com" }
  });

  testing.fireEvent.change(rendered.getByTestId("settings-password"), {
    target: { value: "newpassword" }
  });

  testing.fireEvent.change(rendered.getByTestId("settings-image"), {
    target: { value: "newimage" }
  });

  testing.fireEvent.change(rendered.getByTestId("settings-bio"), {
    target: { value: "newbio" }
  });

  testing.fireEvent.submit(rendered.getByTestId("settings-form"));

  expect(updateCurrentUser).toHaveBeenCalledTimes(1);
  expect(updateCurrentUser).toHaveBeenLastCalledWith({
    token: "abcd",
    username: "newjohndoe",
    email: "newjohn@doe.com",
    password: "newpassword",
    image: "newimage",
    bio: "newbio"
  });

  await testing.wait(() => {
    expect(rendered.getByTestId("settings-username-error")).toHaveTextContent(
      "is invalid"
    );
    expect(rendered.getByTestId("settings-email-error")).toHaveTextContent(
      "is invalid"
    );
    expect(rendered.getByTestId("settings-password-error")).toHaveTextContent(
      "is invalid"
    );
    expect(rendered.getByTestId("settings-image-error")).toHaveTextContent(
      "is invalid"
    );
    expect(rendered.getByTestId("settings-bio-error")).toHaveTextContent(
      "is invalid"
    );
  });

  expect(setCurrentUser).not.toHaveBeenCalled();
});

test("logs out user", async () => {
  const unsetCurrentUser = jest.fn(() => {});

  const rendered = testing.render(
    <Settings
      currentUser={user}
      setCurrentUser={() => {}}
      unsetCurrentUser={unsetCurrentUser}
    />
  );

  testing.fireEvent.click(rendered.getByTestId("settings-log-out"));

  await testing.wait(() => expect(window.location.pathname).toBe("/"));

  expect(unsetCurrentUser).toHaveBeenCalledTimes(1);
});
