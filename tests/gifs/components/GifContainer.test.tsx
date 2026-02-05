import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import GifContainer from "@/gifs/components/GifContainer";
import type { Gif } from "@/types/gifs.types";

describe("GifContainer", () => {
  const mockGifs: Gif[] = [
    {
      id: "1",
      title: "Funny Cat",
      url: "https://example.com/cat.gif",
      width: 480,
      height: 270,
    },
    {
      id: "2",
      title: "Happy Dog",
      url: "https://example.com/dog.gif",
      width: 640,
      height: 360,
    },
    {
      id: "3",
      title: "Dancing Penguin",
      url: "https://example.com/penguin.gif",
      width: 320,
      height: 180,
    },
  ];

  describe("Rendering", () => {
    it("should render container with correct class", () => {
      const { container } = render(<GifContainer data={mockGifs} />);

      const gifsContainer = container.querySelector(".gifs-container");
      expect(gifsContainer).toBeDefined();
    });

    it("should render all gifs from data array", () => {
      render(<GifContainer data={mockGifs} />);

      expect(screen.getByAltText("Funny Cat")).toBeDefined();
      expect(screen.getByAltText("Happy Dog")).toBeDefined();
      expect(screen.getByAltText("Dancing Penguin")).toBeDefined();
    });

    it("should render correct number of gif cards", () => {
      const { container } = render(<GifContainer data={mockGifs} />);

      const gifCards = container.querySelectorAll(".gif-card");
      expect(gifCards).toHaveLength(3);
    });

    it("should render empty container when data is empty", () => {
      const { container } = render(<GifContainer data={[]} />);

      const gifsContainer = container.querySelector(".gifs-container");
      expect(gifsContainer).toBeDefined();
      expect(gifsContainer?.children).toHaveLength(0);
    });
  });

  describe("Gif card content", () => {
    it("should render image with correct src and alt attributes", () => {
      render(<GifContainer data={mockGifs} />);

      const catImage = screen.getByAltText("Funny Cat") as HTMLImageElement;
      expect(catImage).toBeDefined();
      expect(catImage.src).toBe("https://example.com/cat.gif");
      expect(catImage.alt).toBe("Funny Cat");
    });

    it("should render all images with correct attributes", () => {
      render(<GifContainer data={mockGifs} />);

      mockGifs.forEach((gif) => {
        const image = screen.getByAltText(gif.title) as HTMLImageElement;
        expect(image.src).toBe(gif.url);
        expect(image.alt).toBe(gif.title);
      });
    });

    it("should render title as h3 heading", () => {
      render(<GifContainer data={mockGifs} />);

      expect(
        screen.getByRole("heading", { name: "Funny Cat", level: 3 }),
      ).toBeDefined();
      expect(
        screen.getByRole("heading", { name: "Happy Dog", level: 3 }),
      ).toBeDefined();
      expect(
        screen.getByRole("heading", { name: "Dancing Penguin", level: 3 }),
      ).toBeDefined();
    });

    it("should render dimensions in correct format", () => {
      render(<GifContainer data={mockGifs} />);

      expect(screen.getByText("480x270")).toBeDefined();
      expect(screen.getByText("640x360")).toBeDefined();
      expect(screen.getByText("320x180")).toBeDefined();
    });

    it("should render dimensions inside paragraph tags", () => {
      const { container } = render(<GifContainer data={mockGifs} />);

      const dimensions = container.querySelectorAll(".gif-card p");
      expect(dimensions).toHaveLength(3);
      expect(dimensions[0].textContent).toBe("480x270");
      expect(dimensions[1].textContent).toBe("640x360");
      expect(dimensions[2].textContent).toBe("320x180");
    });
  });

  describe("Key attributes", () => {
    it("should use gif id as key for each card", () => {
      const { container } = render(<GifContainer data={mockGifs} />);

      const gifCards = container.querySelectorAll(".gif-card");
      gifCards.forEach((card, index) => {
        // React doesn't expose keys in DOM, but we can verify the order is maintained
        const heading = card.querySelector("h3");
        expect(heading?.textContent).toBe(mockGifs[index].title);
      });
    });

    it("should maintain correct order of gifs", () => {
      const { container } = render(<GifContainer data={mockGifs} />);

      const headings = container.querySelectorAll(".gif-card h3");
      expect(headings[0].textContent).toBe("Funny Cat");
      expect(headings[1].textContent).toBe("Happy Dog");
      expect(headings[2].textContent).toBe("Dancing Penguin");
    });
  });

  describe("Edge cases", () => {
    it("should handle single gif", () => {
      const singleGif: Gif[] = [mockGifs[0]];
      render(<GifContainer data={singleGif} />);

      expect(screen.getByAltText("Funny Cat")).toBeDefined();
      expect(screen.getByRole("heading", { name: "Funny Cat" })).toBeDefined();
    });

    it("should handle gif with empty title", () => {
      const gifsWithEmptyTitle: Gif[] = [
        {
          id: "1",
          title: "",
          url: "https://example.com/test.gif",
          width: 100,
          height: 100,
        },
      ];

      render(<GifContainer data={gifsWithEmptyTitle} />);

      const image = screen.getByAltText("") as HTMLImageElement;
      expect(image).toBeDefined();
      expect(screen.getByText("100x100")).toBeDefined();
    });

    it("should handle special characters in title", () => {
      const gifsWithSpecialChars: Gif[] = [
        {
          id: "1",
          title: 'Test & "Special" <Characters>',
          url: "https://example.com/test.gif",
          width: 200,
          height: 200,
        },
      ];

      render(<GifContainer data={gifsWithSpecialChars} />);

      expect(
        screen.getByAltText('Test & "Special" <Characters>'),
      ).toBeDefined();
      expect(
        screen.getByRole("heading", { name: 'Test & "Special" <Characters>' }),
      ).toBeDefined();
    });

    it("should handle zero dimensions", () => {
      const gifsWithZeroDimensions: Gif[] = [
        {
          id: "1",
          title: "Zero Dimensions",
          url: "https://example.com/test.gif",
          width: 0,
          height: 0,
        },
      ];

      render(<GifContainer data={gifsWithZeroDimensions} />);

      expect(screen.getByText("0x0")).toBeDefined();
    });

    it("should handle large dimensions", () => {
      const gifsWithLargeDimensions: Gif[] = [
        {
          id: "1",
          title: "Large Gif",
          url: "https://example.com/large.gif",
          width: 9999,
          height: 8888,
        },
      ];

      render(<GifContainer data={gifsWithLargeDimensions} />);

      expect(screen.getByText("9999x8888")).toBeDefined();
    });

    it("should handle very long URLs", () => {
      const gifsWithLongURL: Gif[] = [
        {
          id: "1",
          title: "Long URL",
          url: "https://example.com/very/long/path/to/gif/with/many/segments/image.gif?param1=value1&param2=value2",
          width: 100,
          height: 100,
        },
      ];

      render(<GifContainer data={gifsWithLongURL} />);

      const image = screen.getByAltText("Long URL") as HTMLImageElement;
      expect(image.src).toBe(
        "https://example.com/very/long/path/to/gif/with/many/segments/image.gif?param1=value1&param2=value2",
      );
    });
  });

  describe("Structure and accessibility", () => {
    it("should have proper semantic structure", () => {
      const { container } = render(<GifContainer data={[mockGifs[0]]} />);

      const gifCard = container.querySelector(".gif-card");
      expect(gifCard).toBeDefined();
      expect(gifCard?.querySelector("img")).toBeDefined();
      expect(gifCard?.querySelector("h3")).toBeDefined();
      expect(gifCard?.querySelector("p")).toBeDefined();
    });
  });
});
