// @flow

import * as React from "react";
import * as testing from "react-testing-library";
import "jest-dom/extend-expect";
import CurrentUser from "./CurrentUser";
import * as api from "./api";

const USER_TOKEN_KEY = "userToken";

const getCurrentUser = jest.spyOn(api, "getCurrentUser");

afterEach(() => {
  testing.cleanup();
  localStorage.clear();
  getCurrentUser.mockReset();
});

const user: api.User = {
  email: "john@doe.com",
  token: "abcd",
  username: "johndoe",
  bio: null,
  image: null
};

test("inits empty currentUser with no token", async () => {
  const rendered = testing.render(
    <CurrentUser>
      {data => {
        switch (data.status) {
          case "pending":
            return "pending";
          case "ready":
            return data.currentUser ? data.currentUser.username : "no user";
          default:
            throw new Error("invalid status");
        }
      }}
    </CurrentUser>
  );

  expect(getCurrentUser).not.toHaveBeenCalled();
  expect(rendered.container).toHaveTextContent("no user");
});

test("inits empty currentUser with invalid token", async () => {
  getCurrentUser.mockReturnValue(Promise.reject(new Error("invalid token")));
  localStorage.setItem(USER_TOKEN_KEY, "abcd");

  const rendered = testing.render(
    <CurrentUser>
      {data => {
        switch (data.status) {
          case "pending":
            return "pending";
          case "ready":
            return data.currentUser ? data.currentUser.username : "no user";
          default:
            throw new Error("invalid status");
        }
      }}
    </CurrentUser>
  );

  expect(getCurrentUser).toHaveBeenCalledTimes(1);
  expect(getCurrentUser).toHaveBeenLastCalledWith({ token: "abcd" });

  await expect(
    testing.wait(
      () => {
        expect(rendered.container).not.toHaveTextContent("no user");
      },
      { timeout: 10 }
    )
  ).rejects.toThrow();
});

test("inits non-empty currentUser with valid token", async () => {
  getCurrentUser.mockReturnValue(Promise.resolve(user));
  localStorage.setItem(USER_TOKEN_KEY, "abcd");

  const rendered = testing.render(
    <CurrentUser>
      {data => {
        switch (data.status) {
          case "pending":
            return "pending";
          case "ready":
            return data.currentUser ? data.currentUser.username : "no user";
          default:
            throw new Error("invalid status");
        }
      }}
    </CurrentUser>
  );

  expect(getCurrentUser).toHaveBeenCalledTimes(1);
  expect(getCurrentUser).toHaveBeenLastCalledWith({ token: "abcd" });
  expect(rendered.container).toHaveTextContent("pending");

  await testing.wait(() => {
    expect(rendered.container).toHaveTextContent(user.username);
  });
});

test("sets current user", async () => {
  class Username extends React.Component<{|
    currentUser: ?api.User,
    setCurrentUser: api.User => void
  |}> {
    componentDidMount() {
      setTimeout(() => this.props.setCurrentUser(user), 10);
    }

    render() {
      return this.props.currentUser
        ? this.props.currentUser.username
        : "no user";
    }
  }

  const rendered = testing.render(
    <CurrentUser>
      {data => {
        switch (data.status) {
          case "pending":
            return "pending";
          case "ready":
            return (
              <Username
                currentUser={data.currentUser}
                setCurrentUser={data.setCurrentUser}
              />
            );
          default:
            throw new Error("invalid status");
        }
      }}
    </CurrentUser>
  );

  await testing.wait(() => {
    expect(rendered.container).toHaveTextContent(user.username);
  });

  expect(localStorage.getItem(USER_TOKEN_KEY)).toBe("abcd");
});

test("unsets current user", async () => {
  getCurrentUser.mockReturnValue(Promise.resolve(user));
  localStorage.setItem(USER_TOKEN_KEY, "abcd");

  class Username extends React.Component<{|
    currentUser: ?api.User,
    unsetCurrentUser: () => void
  |}> {
    componentDidMount() {
      setTimeout(() => this.props.unsetCurrentUser(), 10);
    }

    render() {
      return this.props.currentUser
        ? this.props.currentUser.username
        : "no user";
    }
  }

  const rendered = testing.render(
    <CurrentUser>
      {data => {
        switch (data.status) {
          case "pending":
            return "pending";
          case "ready":
            return (
              <Username
                currentUser={data.currentUser}
                unsetCurrentUser={data.setCurrentUser}
              />
            );
          default:
            throw new Error("invalid status");
        }
      }}
    </CurrentUser>
  );

  await testing.wait(() => {
    expect(rendered.container).toHaveTextContent(user.username);
  });

  await testing.wait(() => {
    expect(rendered.container).toHaveTextContent("no user");
  });

  expect(localStorage.getItem(USER_TOKEN_KEY)).toBe(null);
});
