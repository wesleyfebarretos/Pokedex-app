import { useState } from "react";
import { SelectTypes } from "../select-types/select-types";
import "./pokedex.scss";

export interface stateParameter {
  updateRequestState: (searchBarValue: string) => void;
  updateFilterState: (filterByTypeValue: string) => void;
  updateLoadingInResetButton: (filterByTypeValue: boolean) => void;
  updateHeaderHeight: (isDexOpen: boolean) => void;
}

export function Pokedex({ updateRequestState, updateFilterState, updateLoadingInResetButton, updateHeaderHeight }: stateParameter) {
  let [dexDisplay, setDexDisplay] = useState(true);
  let [display, setDisplay] = useState({ display: "" });
  let [opacity, setOpacity] = useState("");
  let [isDexOpen, setIsDexOpen] = useState(true);

  function removeAndAddClassToOpacityTransition() {
    setDexDisplay(() => {
      if (!dexDisplay) {
        return true;
      }
      return false;
    });

    if (dexDisplay) {
      setOpacity("dex-appear");
      setTimeout(() => {
        setDisplayBlockOrNone();
        updateHeaderHeight(isDexOpen);
        setIsDexOpen(!isDexOpen);
      }, 450);
    } else {
      setOpacity("dex-desappear");
      setTimeout(() => {
        setDisplayBlockOrNone();
        updateHeaderHeight(isDexOpen);
        setIsDexOpen(!isDexOpen);
      }, 900);
    }
  }

  function setDisplayBlockOrNone() {
    return dexDisplay ? setDisplay({ display: "block" }) : setDisplay({ display: "none" });
  }

  return (
    <div id="dex-container">
      <div className="dex-header">
        <div className="greater-ball">
          <div
            data-testid="ball-button"
            className="greater-ball-inside"
            onClick={() => {
              removeAndAddClassToOpacityTransition();
            }}
          >
            <div className="greater-ball-inside-shadow" />
          </div>
          <div className="greater-ball-light" />
        </div>
        <div className="three-small-balls">
          <div className="small-red-ball">
            <div className="small-red-ball-inside" />
          </div>
          <div className="small-yellow-ball">
            <div className="small-yellow-ball-inside" />
          </div>
          <div className="small-green-ball">
            <div className="small-green-ball-inside" />
          </div>
        </div>
        <img
          src="https://raw.githubusercontent.com/sleduardo20/pokedex/0671af442dff1d8f7141e49eb83b438885bbc9e9/public/img/logo.svg"
          alt=""
          className="logo-dex"
        />
      </div>

      <div data-testid="dex-middle" className={`dex-middle ${opacity}`} style={display}>
        <nav className="search-type">
          <SelectTypes updateFilterState={updateFilterState} updateLoadingInResetButton={updateLoadingInResetButton} />
        </nav>
        <nav className="search-bar">
          <input
            data-testid="search-bar"
            type="text"
            placeholder="Enter Pokémon Name"
            className="inputsize"
            id="searchbar"
            onChange={event => {
              updateRequestState(event.target.value);
            }}
          />
        </nav>
        <div className="middle-normal-line" />
        <div className="middle-deg-line" />
        <div className="middle-normal-line-2" />
        <div className="line-light-1" />
        <div className="line-light-2" />
        <div className="line-shadow" />
        <div className="triangle" />
      </div>

      <div data-testid="dex-aside" className={`dex-aside ${opacity}`} style={display}>
        <div className="aside-line" />
        <div className="aside-line2" />
      </div>
    </div>
  );
}
