import { useEffect, useState } from "react";
import { Card } from "../../components/card/card";
import { PokeballLoader } from "../../components/pokeball-loader/pokeball-loader";
import { Pokedex } from "../../components/pokedex/pokedex";
import { Pokemon } from "../../shared/models/pokemon";
import { Request } from "../../shared/models/request";
import "./home.scss";

export interface PokemonHomeRequest extends Request<Pokemon[]> {
  next: string;
  search: string;
}
export interface PokemonAppState {
  pokemonRequest: PokemonHomeRequest;
  filterValue: string;
}

function App() {
  const [request, setRequest] = useState<PokemonAppState>({
    pokemonRequest: {
      next: "http://localhost:8080/pokemon",
      value: [],
      isLoading: true,
      search: ""
    },
    filterValue: "NONE"
  });
  const [scrolling, setScrolling] = useState(1);

  const [headerHeight, setHeaderHeight] = useState({ height: "20vh" });

  function updateHeaderHeight(isDexOpen: boolean) {
    if (isDexOpen) {
      setHeaderHeight({ height: "45vh" });
    } else {
      setHeaderHeight({ height: "20vh" });
    }
  }

  function updateRequestState(searchBarValue: string) {
    setRequest(prevState => ({
      pokemonRequest: {
        isLoading: prevState.pokemonRequest.isLoading,
        next: prevState.pokemonRequest.next,
        search: searchBarValue,
        value: prevState.pokemonRequest.value
      },
      filterValue: prevState.filterValue
    }));
  }

  function updateLoading(loading: boolean) {
    setRequest(prevState => ({
      filterValue: prevState.filterValue,
      pokemonRequest: {
        isLoading: loading,
        next: prevState.pokemonRequest.next,
        search: prevState.pokemonRequest.search,
        value: prevState.pokemonRequest.value
      }
    }));
  }

  function updateLoadingInResetButton(loading: boolean) {
    if (!loading) {
      return setTimeout(() => {
        updateLoading(loading);
      }, 1000);
    }

    return updateLoading(loading);
  }

  function updateFilterState(filterByTypeValue: string) {
    setRequest(prevState => ({
      pokemonRequest: prevState.pokemonRequest,
      filterValue: filterByTypeValue
    }));
  }

  function maximumPokemonHasBeenReached(results: Pokemon[]) {
    return (
      (request.pokemonRequest.search == "" && request.filterValue == "NONE" && results.length == 0) ||
      (request.pokemonRequest.search == "" && results.length == 0) ||
      (request.filterValue == "NONE" && results.length == 0)
    );
  }

  function updateRequestToFetchFunction(next: string, results: Pokemon[]) {
    return setRequest(prevState => ({
      pokemonRequest: {
        next,
        value: [...prevState.pokemonRequest.value, ...results],
        isLoading: false,
        search: prevState.pokemonRequest.search
      },
      filterValue: prevState.filterValue
    }));
  }

  async function fetchPokemon(): Promise<void> {
    updateLoadingToTrue();
    const result = await fetch(request.pokemonRequest.next);
    const { next, results } = await result.json();

    if (maximumPokemonHasBeenReached(results)) {
      alert("the maximum number of pokemons has been reached");
    }

    updateRequestToFetchFunction(next, results);
  }

  function searchHasPokemonName(pokemon: Pokemon) {
    return pokemon.name.toLowerCase().includes(request.pokemonRequest.search.toLowerCase());
  }

  function searchHasPokemonType(pokemon: Pokemon) {
    return pokemon.types.map(type => type.name.toLowerCase()).includes(request.filterValue.toLowerCase());
  }

  function pokemonLoader() {
    return request.pokemonRequest.value
      .filter(pokemon => {
        if (request.filterValue != "NONE" && request.pokemonRequest.search != "") {
          return searchHasPokemonName(pokemon) && searchHasPokemonType(pokemon);
        }

        if (request.pokemonRequest.search != "") {
          return searchHasPokemonName(pokemon);
        }

        if (request.filterValue != "NONE") {
          return searchHasPokemonType(pokemon);
        }

        return true;
      })
      .map((pokemon: Pokemon) => <Card key={pokemon.id} {...pokemon} />);
  }

  function updateScrolling(currentScrolling: number) {
    setTimeout(() => {
      if (window.scrollY + window.innerHeight + 1 >= document.documentElement.scrollHeight) {
        setScrolling(currentScrolling + 1);
      }
    }, 250);
  }

  function updateLoadingToTrue() {
    setRequest(prevState => ({
      filterValue: prevState.filterValue,
      pokemonRequest: {
        isLoading: true,
        next: prevState.pokemonRequest.next,
        search: prevState.pokemonRequest.search,
        value: prevState.pokemonRequest.value
      }
    }));
  }

  function checkIfHasFilter() {
    return request.pokemonRequest.search != "" || request.filterValue != "NONE" || (request.pokemonRequest.search != "" && request.filterValue != "NONE");
  }

  useEffect(() => {
    if (!checkIfHasFilter()) {
      fetchPokemon();
    }

    const scrollHandler = () => {
      updateScrolling(scrolling);
    };

    window.addEventListener("scroll", scrollHandler);

    return () => window.removeEventListener("scroll", scrollHandler);
  }, [scrolling]);

  return (
    <div className="App">
      <header data-testid="header" style={headerHeight}>
        <Pokedex
          updateRequestState={updateRequestState}
          updateFilterState={updateFilterState}
          updateLoadingInResetButton={updateLoadingInResetButton}
          updateHeaderHeight={updateHeaderHeight}
        />
      </header>

      <main data-testid="card-place" id="card-place">
        {pokemonLoader()}
        {request.pokemonRequest.isLoading ? <PokeballLoader /> : undefined}
      </main>
    </div>
  );
}

export default App;
