import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, vi } from "vitest";
import { Pokemon } from "../../shared/models/pokemon";
import { ShinyHome } from "./shiny-home";

const pokemon: Pokemon = {
  id: 1,
  name: "test",
  sprites: [
    { id: 1, name: "front_shiny", img: "a.com.br" },
    { id: 2, name: "back_shiny", img: "b.com.br" }
  ],
  types: [
    { id: 1, name: "grass" },
    { id: 2, name: "poison" }
  ]
};

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(pokemon)
  })
) as jest.Mock;

describe("Shiny Home Page", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render a Shiny Pokemon", async () => {
    const { findByTestId } = render(<ShinyHome />, { wrapper: MemoryRouter });

    const id = await findByTestId("card-id");
    const name = await findByTestId("card-name");
    const imgFront = await findByTestId("card-img-front");
    const imgBack = await findByTestId("card-img-back");

    expect(fetch).toBeCalledTimes(1);
    expect(id.textContent).toBe(`${pokemon.id}`);
    expect(name.textContent).toBe(`SHINY ${pokemon.name.toUpperCase()}`);
    expect(imgFront).toHaveAttribute("src", `${pokemon.sprites[0].img}`);
    expect(imgBack).toHaveAttribute("src", `${pokemon.sprites[1].img}`);
  });

  it("should have href of next pokemon", async () => {
    const { findByTestId } = await waitFor(() =>
      render(
        <MemoryRouter initialEntries={["/4"]}>
          <Routes>
            <Route path="/:id" element={<ShinyHome />} />
          </Routes>
        </MemoryRouter>
      )
    );

    const nextPokemon = await waitFor(() => findByTestId("next-pokemon"));

    expect(nextPokemon).toHaveAttribute("href", "/shiny-home/5");
  });

  it("should have href of previous pokemon", async () => {
    const { findByTestId } = await waitFor(() =>
      render(
        <MemoryRouter initialEntries={["/3"]}>
          <Routes>
            <Route path="/:id" element={<ShinyHome />} />
          </Routes>
        </MemoryRouter>
      )
    );

    const previousPokemon = await waitFor(() => findByTestId("previous-pokemon"));

    expect(previousPokemon).toHaveAttribute("href", "/shiny-home/2");
  });

  it("should have color red in fetch next pokemon", async () => {
    const { findByTestId } = await waitFor(() =>
      render(
        <MemoryRouter initialEntries={["/1554"]}>
          <Routes>
            <Route path="/:id" element={<ShinyHome />} />
          </Routes>
        </MemoryRouter>
      )
    );

    const nextPokemon = await waitFor(() => findByTestId("next-pokemon-content"));

    expect(nextPokemon).toHaveStyle("border-bottom-color: red");
  });

  it("should have color red in fetch previous pokemon", async () => {
    const { findByTestId } = await waitFor(() =>
      render(
        <MemoryRouter initialEntries={["/1"]}>
          <Routes>
            <Route path="/:id" element={<ShinyHome />} />
          </Routes>
        </MemoryRouter>
      )
    );

    const previousPokemon = await waitFor(() => findByTestId("previous-pokemon-content"));

    expect(previousPokemon).toHaveStyle("border-bottom-color: red");
  });
});
