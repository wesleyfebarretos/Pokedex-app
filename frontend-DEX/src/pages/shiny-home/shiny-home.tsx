import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PokeballLoader } from "../../components/pokeball-loader/pokeball-loader";
import { ShinyCard } from "../../components/shiny-card/shiny-card";
import { Pokemon } from "../../shared/models/pokemon";
import "./shiny-home.scss";

export interface ShinyHomeRequest {
  pokemon: Pokemon;
  isLoading: boolean;
}

export function ShinyHome() {
  const { id } = useParams();
  const url = `http://localhost:8080/pokemon/${id}`;

  let [request, setRequest] = useState<ShinyHomeRequest>({
    pokemon: {
      id: 0,
      name: "",
      sprites: [],
      types: []
    },
    isLoading: true
  });

  let [previousBorder, setPreviousBorder] = useState({
    borderBottomColor: "gold",
    borderLeftColor: "transparent",
    borderRightColor: "transparent"
  });
  let [nextBorder, setNextBorder] = useState({
    borderBottomColor: "gold",
    borderLeftColor: "transparent",
    borderRightColor: "transparent"
  });

  function updateLoadingToTrue() {
    setRequest(prevState => {
      return {
        pokemon: prevState.pokemon,
        isLoading: true
      };
    });
  }

  function updateLoadingToFalse() {
    setRequest(prevState => {
      return {
        pokemon: prevState.pokemon,
        isLoading: false
      };
    });
  }

  async function fetchPokemonShiny(): Promise<void> {
    updateLoadingToTrue();
    const data = await fetch(url);
    const result = await data.json();

    if (!result) {
      throw new Error("Pokemon does not exist");
    }

    setRequest({
      pokemon: result,
      isLoading: false
    });
    updateLoadingToFalse();
  }

  function fetchPreviousPokemon() {
    if (Number(id) - 1 <= 0) {
      return 1;
    }
    return Number(id) - 1;
  }

  function fetchNextPokemon() {
    if (Number(id) + 1 >= 1155) {
      return 1154;
    }
    return Number(id) + 1;
  }

  function noMorePokemonsPreviousBorder() {
    if (Number(id) - 1 <= 0) {
      setPreviousBorder(prevState => {
        return {
          borderBottomColor: "red",
          borderLeftColor: prevState.borderLeftColor,
          borderRightColor: prevState.borderRightColor
        };
      });
    } else {
      setPreviousBorder(prevState => {
        return {
          borderBottomColor: "gold",
          borderLeftColor: prevState.borderLeftColor,
          borderRightColor: prevState.borderRightColor
        };
      });
    }
  }

  function noMorePokemonsNextBorder() {
    if (Number(id) + 1 >= 1155) {
      setNextBorder(prevState => {
        return {
          borderBottomColor: "red",
          borderLeftColor: prevState.borderLeftColor,
          borderRightColor: prevState.borderRightColor
        };
      });
    } else {
      setNextBorder(prevState => {
        return {
          borderBottomColor: "gold",
          borderLeftColor: prevState.borderLeftColor,
          borderRightColor: prevState.borderRightColor
        };
      });
    }
  }

  useEffect(() => {
    fetchPokemonShiny();
    noMorePokemonsPreviousBorder();
    noMorePokemonsNextBorder();
  }, [id]);

  return (
    <div id="card-place-link">
      {request.isLoading ? <PokeballLoader /> : <ShinyCard {...request.pokemon} />}
      <div className="previous-next-container">
        <Link data-testid="previous-pokemon" id="previous-link" to={`/shiny-home/${fetchPreviousPokemon()}`} className="link-container">
          <div data-testid="previous-pokemon-content" className="previous" style={previousBorder} />
        </Link>

        <Link data-testid="next-pokemon" id="next-link" to={`/shiny-home/${fetchNextPokemon()}`} className="link-container">
          <div data-testid="next-pokemon-content" className="next" style={nextBorder} />
        </Link>
      </div>
    </div>
  );
}
