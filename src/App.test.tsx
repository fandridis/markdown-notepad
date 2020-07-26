import React from "react";
import { render } from "@testing-library/react";
import { App } from "./App";
import { AppStateContext, INITIAL_STATE } from "./context";

const userMock = {
  username: "George",
  email: "george@email.com",
  isAuthorized: true,
};

const dispatchMock = jest.fn();

test("renders a greeting by username", () => {
  const stateMock = { ...INITIAL_STATE, user: userMock };
  const { getByText } = render(
    <AppStateContext.Provider
      value={{ state: stateMock, dispatch: dispatchMock }}
    >
      <App user={userMock} />
    </AppStateContext.Provider>
  );
  const greetingElement = getByText(/George/i);

  expect(greetingElement).toBeInTheDocument();
});
