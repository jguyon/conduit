// @flow

import * as React from "react";
import * as testing from "react-testing-library";
import App from "./App";

afterEach(testing.cleanup);

test("renders without crashing", () => {
  testing.render(<App />);
});
