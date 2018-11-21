// @flow

import * as React from "react";
import * as testing from "react-testing-library";
import "jest-dom/extend-expect";
import CurrentUser from "./CurrentUser";
import type { User } from "./api";

afterEach(testing.cleanup);

const user: User = {
  email: "john@doe.com",
  token: "abcd",
  username: "johndoe",
  bio: null,
  image: ""
};

test("inits empty currentUser with no token", async () => {
  const getCurrentUser = jest.fn(() =>
    Promise.reject(new Error("getCurrentUser should not be called"))
  );

  const getToken = jest.fn(() => null);

  const rendered = testing.render(
    <CurrentUser
      getCurrentUser={getCurrentUser}
      getToken={getToken}
      setToken={() => {}}
      removeToken={() => {}}
    >
      {({ currentUser }) => (currentUser ? currentUser.username : "no user")}
    </CurrentUser>
  );

  expect(getToken).toHaveBeenCalledTimes(1);
  expect(getCurrentUser).not.toHaveBeenCalled();
  expect(rendered.container).toHaveTextContent("no user");
});

test("inits empty currentUser with invalid token", async () => {
  const getCurrentUser = jest.fn(() =>
    Promise.reject(new Error("invalid token"))
  );

  const getToken = jest.fn(() => "abcd");

  const rendered = testing.render(
    <CurrentUser
      getCurrentUser={getCurrentUser}
      getToken={getToken}
      setToken={() => {}}
      removeToken={() => {}}
    >
      {({ currentUser }) => (currentUser ? currentUser.username : "no user")}
    </CurrentUser>
  );

  expect(getToken).toHaveBeenCalledTimes(1);
  expect(getCurrentUser).toHaveBeenCalledTimes(1);
  expect(getCurrentUser).toHaveBeenLastCalledWith("abcd");

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
  const getCurrentUser = jest.fn(() => Promise.resolve({ user }));

  const getToken = jest.fn(() => "abcd");

  const rendered = testing.render(
    <CurrentUser
      getCurrentUser={getCurrentUser}
      getToken={getToken}
      setToken={() => {}}
      removeToken={() => {}}
    >
      {({ currentUser }) => (currentUser ? currentUser.username : "no user")}
    </CurrentUser>
  );

  expect(getToken).toHaveBeenCalledTimes(1);
  expect(getCurrentUser).toHaveBeenCalledTimes(1);
  expect(getCurrentUser).toHaveBeenLastCalledWith("abcd");
  expect(rendered.container).toHaveTextContent("no user");

  await testing.wait(() => {
    expect(rendered.container).toHaveTextContent(user.username);
  });
});

test("sets current user", async () => {
  class Username extends React.Component<{|
    currentUser: ?User,
    setCurrentUser: User => void
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

  const setToken = jest.fn(() => {});
  const removeToken = jest.fn(() => {});

  const rendered = testing.render(
    <CurrentUser
      getCurrentUser={() =>
        Promise.reject(new Error("getCurrentUser should not be called"))
      }
      getToken={() => null}
      setToken={setToken}
      removeToken={removeToken}
    >
      {({ currentUser, setCurrentUser }) => (
        <Username currentUser={currentUser} setCurrentUser={setCurrentUser} />
      )}
    </CurrentUser>
  );

  expect(rendered.container).toHaveTextContent("no user");

  await testing.wait(() => {
    expect(rendered.container).toHaveTextContent(user.username);
  });

  expect(setToken).toHaveBeenCalledTimes(1);
  expect(setToken).toHaveBeenLastCalledWith("abcd");
  expect(removeToken).not.toHaveBeenCalled();
});

test("unsets current user", async () => {
  class Username extends React.Component<{|
    currentUser: ?User,
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

  const setToken = jest.fn(() => {});
  const removeToken = jest.fn(() => {});

  const rendered = testing.render(
    <CurrentUser
      getCurrentUser={() => Promise.resolve({ user })}
      getToken={() => "abcd"}
      setToken={setToken}
      removeToken={removeToken}
    >
      {({ currentUser, setCurrentUser }) => (
        <Username currentUser={currentUser} unsetCurrentUser={setCurrentUser} />
      )}
    </CurrentUser>
  );

  await testing.wait(() => {
    expect(rendered.container).toHaveTextContent(user.username);
  });

  await testing.wait(() => {
    expect(rendered.container).toHaveTextContent("no user");
  });

  expect(setToken).not.toHaveBeenCalled();
  expect(removeToken).toHaveBeenCalledTimes(1);
});
