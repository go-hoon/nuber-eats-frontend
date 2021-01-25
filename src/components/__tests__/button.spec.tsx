import { render } from "@testing-library/react";
import React from "react";
import { Button } from "../button";

describe("<Button />", () => {
  it("should render OK with props", () => {
    const { getByText } = render(
      <Button canClick={true} loading={false} actionText={"testing"} />
    );
    getByText("testing");
  });
  it("should display loading", () => {
    const { container, getByText, debug } = render(
      <Button canClick={false} loading={true} actionText={"testing"} />
    );
    getByText("Loading...");
    debug();
    expect(container.firstChild).toHaveClass("pointer-events-none");
  });
});
