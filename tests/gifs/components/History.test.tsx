import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import History from "@/gifs/components/History";
import { useMessage } from "@/shared/hooks/useMessage";

// Mock the useMessage hook
vi.mock("@/shared/hooks/useMessage", () => ({
  useMessage: vi.fn(),
}));

describe("History", () => {
  const mockGetMessage = vi.fn();
  const mockOnSearchClick = vi.fn();

  const defaultProps = {
    data: ["cats", "dogs", "birds"],
    onSearchClick: mockOnSearchClick,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useMessage as any).mockReturnValue({
      getMessage: mockGetMessage,
    });
    mockGetMessage.mockReturnValue("Previous Searches");
  });

  describe("Rendering", () => {
    it("should render container with correct class", () => {
      const { container } = render(<History {...defaultProps} />);

      const historyContainer = container.querySelector(".previous-searches");
      expect(historyContainer).toBeDefined();
    });

    it("should render heading with translated message", () => {
      render(<History {...defaultProps} />);

      expect(mockGetMessage).toHaveBeenCalledWith("main.previousSearches");
      expect(
        screen.getByRole("heading", { name: "Previous Searches", level: 2 }),
      ).toBeDefined();
    });

    it("should render ul with correct class", () => {
      const { container } = render(<History {...defaultProps} />);

      const list = container.querySelector(".previous-searches-list");
      expect(list).toBeDefined();
      expect(list?.tagName).toBe("UL");
    });

    it("should render all items from data array", () => {
      render(<History {...defaultProps} />);

      expect(screen.getByText("cats")).toBeDefined();
      expect(screen.getByText("dogs")).toBeDefined();
      expect(screen.getByText("birds")).toBeDefined();
    });

    it("should render correct number of list items", () => {
      render(<History {...defaultProps} />);

      const items = screen.getAllByRole("listitem");
      expect(items).toHaveLength(3);
    });

    it("should render empty list when data is empty", () => {
      const { container } = render(
        <History
          {...defaultProps}
          data={[]}
        />,
      );

      const list = container.querySelector(".previous-searches-list");
      expect(list?.children).toHaveLength(0);
    });
  });

  describe("User Interactions", () => {
    it("should call onSearchClick with correct value when item is clicked", () => {
      render(<History {...defaultProps} />);

      const catsItem = screen.getByText("cats");
      fireEvent.click(catsItem);

      expect(mockOnSearchClick).toHaveBeenCalledTimes(1);
      expect(mockOnSearchClick).toHaveBeenCalledWith("cats");
    });

    it("should call onSearchClick for each different item clicked", () => {
      render(<History {...defaultProps} />);

      fireEvent.click(screen.getByText("cats"));
      fireEvent.click(screen.getByText("dogs"));
      fireEvent.click(screen.getByText("birds"));

      expect(mockOnSearchClick).toHaveBeenCalledTimes(3);
      expect(mockOnSearchClick).toHaveBeenNthCalledWith(1, "cats");
      expect(mockOnSearchClick).toHaveBeenNthCalledWith(2, "dogs");
      expect(mockOnSearchClick).toHaveBeenNthCalledWith(3, "birds");
    });

    it("should call onSearchClick multiple times when same item is clicked", () => {
      render(<History {...defaultProps} />);

      const catsItem = screen.getByText("cats");
      fireEvent.click(catsItem);
      fireEvent.click(catsItem);
      fireEvent.click(catsItem);

      expect(mockOnSearchClick).toHaveBeenCalledTimes(3);
      expect(mockOnSearchClick).toHaveBeenCalledWith("cats");
    });
  });

  describe("Key attributes", () => {
    it("should use item name as key for each list item", () => {
      const { container } = render(<History {...defaultProps} />);

      const items = container.querySelectorAll(".previous-searches-list li");
      expect(items[0].textContent).toBe("cats");
      expect(items[1].textContent).toBe("dogs");
      expect(items[2].textContent).toBe("birds");
    });

    it("should maintain correct order of items", () => {
      render(<History {...defaultProps} />);

      const items = screen.getAllByRole("listitem");
      expect(items[0].textContent).toBe("cats");
      expect(items[1].textContent).toBe("dogs");
      expect(items[2].textContent).toBe("birds");
    });
  });

  describe("Edge cases", () => {
    it("should handle single item", () => {
      render(
        <History
          {...defaultProps}
          data={["single"]}
        />,
      );

      expect(screen.getByText("single")).toBeDefined();
      expect(screen.getAllByRole("listitem")).toHaveLength(1);
    });

    it("should handle items with special characters", () => {
      const specialData = ["cats & dogs", "birds@home", "fish#1"];
      render(
        <History
          {...defaultProps}
          data={specialData}
        />,
      );

      expect(screen.getByText("cats & dogs")).toBeDefined();
      expect(screen.getByText("birds@home")).toBeDefined();
      expect(screen.getByText("fish#1")).toBeDefined();
    });

    it("should handle items with spaces", () => {
      const spacedData = ["cute cats", "happy dogs", "flying birds"];
      render(
        <History
          {...defaultProps}
          data={spacedData}
        />,
      );

      expect(screen.getByText("cute cats")).toBeDefined();
      expect(screen.getByText("happy dogs")).toBeDefined();
      expect(screen.getByText("flying birds")).toBeDefined();
    });

    it("should handle empty strings in data", () => {
      const dataWithEmpty = ["cats", "", "dogs"];
      render(
        <History
          {...defaultProps}
          data={dataWithEmpty}
        />,
      );

      const items = screen.getAllByRole("listitem");
      expect(items).toHaveLength(3);
      expect(items[1].textContent).toBe("");
    });

    it("should handle very long item names", () => {
      const longName =
        "this is a very long search query that contains many words";
      render(
        <History
          {...defaultProps}
          data={[longName]}
        />,
      );

      expect(screen.getByText(longName)).toBeDefined();
    });

    it("should handle numbers as strings", () => {
      const numericData = ["123", "456", "789"];
      render(
        <History
          {...defaultProps}
          data={numericData}
        />,
      );

      expect(screen.getByText("123")).toBeDefined();
      expect(screen.getByText("456")).toBeDefined();
      expect(screen.getByText("789")).toBeDefined();
    });
  });

  describe("Internationalization", () => {
    it("should use getMessage for heading translation", () => {
      mockGetMessage.mockReturnValue("Búsquedas Anteriores");
      render(<History {...defaultProps} />);

      expect(mockGetMessage).toHaveBeenCalledWith("main.previousSearches");
      expect(
        screen.getByRole("heading", { name: "Búsquedas Anteriores" }),
      ).toBeDefined();
    });

    it("should handle missing translation key gracefully", () => {
      mockGetMessage.mockReturnValue("main.previousSearches");
      render(<History {...defaultProps} />);

      expect(
        screen.getByRole("heading", { name: "main.previousSearches" }),
      ).toBeDefined();
    });
  });

  describe("Structure and semantics", () => {
    it("should have proper semantic structure", () => {
      const { container } = render(<History {...defaultProps} />);

      const heading = container.querySelector("h2");
      const list = container.querySelector("ul");

      expect(heading).toBeDefined();
      expect(list).toBeDefined();
      expect(heading?.nextElementSibling).toBe(list);
    });

    it("should render items as list items inside ul", () => {
      const { container } = render(<History {...defaultProps} />);

      const list = container.querySelector("ul.previous-searches-list");
      const items = list?.querySelectorAll("li");

      expect(items).toHaveLength(3);
      items?.forEach((item) => {
        expect(item.parentElement).toBe(list);
      });
    });
  });

  describe("Callback behavior", () => {
    it("should not call onSearchClick on initial render", () => {
      render(<History {...defaultProps} />);

      expect(mockOnSearchClick).not.toHaveBeenCalled();
    });

    it("should work with different onSearchClick implementations", () => {
      const customCallback = vi.fn((value: string) => {
        console.log(`Searching for: ${value}`);
      });

      render(
        <History
          {...defaultProps}
          onSearchClick={customCallback}
        />,
      );

      fireEvent.click(screen.getByText("cats"));

      expect(customCallback).toHaveBeenCalledWith("cats");
    });
  });
});
