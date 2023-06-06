import { Link } from "react-router-dom";
import { Pokemon } from "../../shared/models/pokemon";
import { colorByType } from "../../util/types-object";
import "./card.scss";

export function Card(pokemon: Pokemon) {
  function pokemonSprite(pokemon: Pokemon, name: string) {
    return pokemon.sprites.find(sprite => sprite.name == name)!.img;
  }

  function colorForTypeDiv(type: string) {
    return { background: colorByType[type.toUpperCase()] };
  }

  function linearBackgroundValue() {
    return `linear-gradient(45deg,${colorByType[pokemon.types[0].name.toUpperCase()]},${colorByType[pokemon.types[1].name.toUpperCase()]})`;
  }

  function normalBackgroundValue(type: string) {
    return colorByType[type.toUpperCase()];
  }

  function colorOrLinearColorForCard() {
    if (pokemon.types.length == 2) {
      return { background: linearBackgroundValue() };
    }

    return { background: normalBackgroundValue(pokemon.types[0].name) };
  }

  return (
    <Link className="link-container-1" to={`/shiny-home/${pokemon.id}`}>
      <div style={colorOrLinearColorForCard()} className="card">
        <div className="front-card">
          <div data-testid="id-pokemon" className="id-pokemon">
            {pokemon.id}
          </div>
          <div className="card-image">
            <span className="img-light" />
            <img src={pokemonSprite(pokemon, "front_default")} alt="front img not found" className="card-img" />
          </div>
          <h2>{pokemon.name}</h2>
          <div className="types-container">
            {pokemon.types.map((type, index) => (
              <div style={colorForTypeDiv(type.name)} key={index} className={`card${index == 1 ? "-second-type" : "-type"}`}>
                {type.name.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
        <div className="back-card">
          <div className="id-pokemon">{pokemon.id}</div>
          <div className="card-image">
            <span className="img-light" />
            <img src={pokemonSprite(pokemon, "back_default")} alt="back img not found" />
          </div>
          <h2>{pokemon.name}</h2>
        </div>
      </div>
    </Link>
  );
}
