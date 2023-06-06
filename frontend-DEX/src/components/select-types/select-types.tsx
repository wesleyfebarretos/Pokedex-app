import { useState } from "react";
import { colorByType } from "../../util/types-object";
// eslint-disable-next-line import/newline-after-import
import "./select-types.scss";
interface FilterTypeChange {
  updateFilterState: (filterByTypeValue: string) => void;
  updateLoadingInResetButton: (filterByTypeValue: boolean) => void;
}

interface SelectFilter {
  filterProperty: string;
  filterColor: string;
}

export function SelectTypes({ updateFilterState, updateLoadingInResetButton }: FilterTypeChange) {
  let [filterState, setFilterState] = useState<SelectFilter>({
    filterProperty: "",
    filterColor: ""
  });

  function options() {
    return Object.entries(colorByType).map(([key, value]) => {
      return (
        <option
          data-testid="options"
          className="option"
          key={key}
          value={key}
          style={key == "NONE" ? { backgroundColor: "white" } : { backgroundColor: value }}
        >
          {key}
        </option>
      );
    });
  }

  return (
    <div id="filter-select">
      <select
        data-testid="types"
        id="type"
        className="types"
        required
        value={filterState.filterProperty}
        style={{ background: filterState.filterColor }}
        onChange={event => {
          if (event.target.value == "NONE") {
            updateLoadingInResetButton(true);
          }
          setFilterState({
            filterProperty: event.target.value,
            filterColor: colorByType[event.target.value]
          });
          updateFilterState(event.target.value);
          if (event.target.value == "NONE") {
            updateLoadingInResetButton(false);
          }
        }}
      >
        {options()}
      </select>

      <button
        data-testid="reset-button"
        className="stylebutton"
        id="reset-button"
        onClick={() => {
          updateLoadingInResetButton(true);
          setFilterState({
            filterProperty: "NONE",
            filterColor: colorByType.NONE
          });
          updateFilterState("NONE");
          updateLoadingInResetButton(false);
        }}
      >
        Reset
      </button>
    </div>
  );
}
