import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it } from "vitest";
import { Pokemon } from "../../shared/models/pokemon";
import { Card } from "./card";

describe("Card Component", () => {
  it("should render a Card", () => {
    const pokemon: Pokemon = {
      id: 1,
      name: "test",
      sprites: [
        { id: 1, name: "front_default", img: "aaa.com.br" },
        { id: 2, name: "back_default", img: "bbb.com.br" }
      ],
      types: [
        { id: 1, name: "fire" },
        { id: 2, name: "water" }
      ]
    };
    const { getAllByText, getByText, queryByText } = render(<Card {...pokemon} />, { wrapper: MemoryRouter });

    const name = getAllByText(`${pokemon.name}`);
    const id = getAllByText(1);
    const frontImg = screen.getByAltText("front img not found");
    const backImg = screen.getByAltText("back img not found");
    const type1 = getByText(`${pokemon.types[0].name.toUpperCase()}`);
    const type2 = queryByText(`${pokemon.types[1].name.toUpperCase()}`);

    expect(id[0]).toHaveTextContent(`${pokemon.id}`);
    expect(name[0]).toBeInTheDocument();
    expect(name[0]).toHaveTextContent(`${pokemon.name}`);
    expect(frontImg).toHaveAttribute("src", `${pokemon.sprites[0].img}`);
    expect(type1).toHaveClass("card-type");
    expect(type2).toHaveClass("card-second-type");
    // back-card
    expect(id[1]).toHaveClass("id-pokemon");
    expect(backImg).toHaveAttribute("src", `${pokemon.sprites[1].img}`);
  });
});
