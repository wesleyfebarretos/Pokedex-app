import "@testing-library/jest-dom";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, vi } from "vitest";
import { Pokemon } from "../../shared/models/pokemon";
import App from "./home";

let pokemon: Pokemon = {
  id: 1,
  name: "test",
  sprites: [
    { id: 1, name: "front_default", img: "a.com.br" },
    { id: 2, name: "back_default", img: "b.com.br" }
  ],
  types: [
    { id: 1, name: "grass" },
    { id: 2, name: "poison" }
  ]
};

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ next: "", results: [pokemon, { ...pokemon, id: 2 }, { ...pokemon, id: 3 }] })
  })
) as jest.Mock;

describe("Home Page", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render a card", async () => {
    const { findAllByTestId } = render(<App />, { wrapper: MemoryRouter });
    const totalCards = await findAllByTestId("id-pokemon");

    expect(fetch).toBeCalledTimes(1);
    expect(totalCards.length).toBe(3);
    expect(totalCards[0].textContent).toBe("1");
    expect(totalCards[1].textContent).toBe("2");
    expect(totalCards[2].textContent).toBe("3");
  });

  it("should update header height when the button is clicked", async () => {
    const { getByTestId } = render(<App />, { wrapper: MemoryRouter });

    const button = getByTestId("ball-button");
    const header = getByTestId("header");

    expect(header).toHaveStyle("height: 20vh");

    fireEvent.click(button);

    await waitFor(() => expect(header).toHaveStyle("height: 45vh"));
  });

  it("should render a loader until the fetch ends", async () => {
    const { queryByTestId } = render(<App />, { wrapper: MemoryRouter });
    const loader = queryByTestId("loader");

    expect(loader).toBeInTheDocument();

    await waitFor(() => expect(loader).not.toBeInTheDocument());
  });
});
