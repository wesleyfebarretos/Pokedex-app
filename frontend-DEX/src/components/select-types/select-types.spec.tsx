import "@testing-library/jest-dom";
import { fireEvent, render } from "@testing-library/react";
import { describe, it, vi } from "vitest";
import { colorByType } from "../../util/types-object";
import { SelectTypes } from "./select-types";

const updateFilterState = vi.fn();
const updateLoadingInResetButton = vi.fn();

describe("Select Types Component", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render a select", () => {
    const { getByTestId } = render(<SelectTypes updateFilterState={updateFilterState} updateLoadingInResetButton={updateLoadingInResetButton} />);

    const select = getByTestId("types");
    // eslint-disable-next-line no-restricted-syntax
    for (let [key, value] of Object.entries(colorByType)) {
      expect(select.textContent?.includes(key)).toBeTruthy();

      fireEvent.change(select, { target: { value: key } });

      if (key === "NONE") {
        expect(select).toHaveStyle("background: white");
      } else {
        expect(select).toHaveStyle(`background: ${value}`);
      }
    }
    expect(updateFilterState).toBeCalledTimes(Object.keys(colorByType).length);
    expect(updateLoadingInResetButton).toBeCalledTimes(2);
  });

  it("should render the select options", () => {
    const { getAllByTestId } = render(<SelectTypes updateFilterState={updateFilterState} updateLoadingInResetButton={updateLoadingInResetButton} />);

    const options = getAllByTestId("options");

    // eslint-disable-next-line no-restricted-syntax, no-empty
    for (let [index, [key, value]] of Object.entries(Object.entries(colorByType))) {
      expect(options[Number(index)].textContent).toBe(key);
      expect(options[Number(index)]).toHaveStyle(`${Number(index) == 0 ? "background-color: white" : `background-color:${value}`}`);
    }
  });

  it("should render the reset button", () => {
    const { getByTestId } = render(<SelectTypes updateFilterState={updateFilterState} updateLoadingInResetButton={updateLoadingInResetButton} />);

    const resetButton = getByTestId("reset-button");

    expect(resetButton).toBeInTheDocument();
    expect(resetButton).toHaveTextContent("Reset");
    expect(resetButton).toHaveClass("stylebutton");

    fireEvent.click(resetButton);

    expect(updateLoadingInResetButton).toBeCalledTimes(2);
    expect(updateFilterState).toBeCalledTimes(1);
  });
});
