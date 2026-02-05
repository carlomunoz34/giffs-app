import AppHeader from "@/shared/components/AppHeader";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

describe('AppHeader', () => {
  test('should render the messages', () => {
    const title = "Test 1";
    const subtitle = "Test 2";
    render(<AppHeader title={title} subtitle={subtitle} />);
    expect(screen.getByText(title)).toBeDefined();
    expect(screen.getByRole("paragraph").innerHTML).toBe(subtitle);
  });

  test('should not show subtitle if its not received', () => {
    const title = "Test 1";
    const { container } = render(<AppHeader title={title} />);
    expect(container.getElementsByTagName("p").length).toBe(0);
  });
});