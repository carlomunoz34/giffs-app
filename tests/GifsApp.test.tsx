import { describe, expect, test } from "vitest";
import GifsApp from "@/GifsApp";
import { renderWithProviders } from "./test-utils";


describe("GifsApp", () => {
  test("should render component properly", () => {
    const { container } = renderWithProviders(<GifsApp />);
    expect(container).toMatchSnapshot();
  });
});