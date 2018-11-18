// @flow

import * as React from "react";
import * as testing from "react-testing-library";
import "jest-dom/extend-expect";
import * as api from "../api";
import Profile from ".";

afterEach(testing.cleanup);

const profile: api.Profile = {
  username: "johndoe",
  bio: null,
  image: "",
  following: false
};

test("renders the profile", async () => {
  const rendered = testing.render(
    <Profile
      username="johndoe"
      getProfile={slug => {
        expect(slug).toBe("johndoe");
        return Promise.resolve({ profile });
      }}
    />
  );

  await testing.wait(() => {
    rendered.getByText("johndoe");
  });
});
