import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import { Pokemon } from "../../shared/models/pokemon";
import { colorByType } from "../../util/types-object";
import { ShinyCard } from "./shiny-card";

const pokemon: Pokemon = {
  id: 1,
  name: "test",
  types: [
    { id: 1, name: "grass" },
    { id: 2, name: "poison" }
  ],
  sprites: [
    { id: 1, name: "front_shiny", img: "aaa.com.br" },
    { id: 1, name: "back_shiny", img: "bbb.com.br" }
  ]
};

describe("Shiny Card Component", () => {
  it("should render a Shiny Card", () => {
    const { getByTestId } = render(<ShinyCard {...pokemon} />);

    const shinyCard = getByTestId("shiny-card");
    const id = getByTestId("card-id");
    const name = getByTestId("card-name");
    const frontImg = getByTestId("card-img-front");
    const backImg = getByTestId("card-img-back");

    expect(shinyCard).toHaveStyle(
      pokemon.types.length === 2
        ? `background: linear-gradient(45deg,${colorByType[pokemon.types[0].name.toUpperCase()]},${colorByType[pokemon.types[1].name.toUpperCase()]})`
        : `background: ${colorByType[pokemon.types[0].name.toUpperCase()]}`
    );
    expect(id).toHaveTextContent(`${pokemon.id}`);
    expect(name).toHaveTextContent(`SHINY ${pokemon.name.toUpperCase()}`);
    expect(frontImg).toHaveAttribute("src", `${pokemon.sprites[0].img}`);
    expect(backImg).toHaveAttribute("src", `${pokemon.sprites[1].img}`);
  });
});
