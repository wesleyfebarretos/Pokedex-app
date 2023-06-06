import "@testing-library/jest-dom";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, it, vi } from "vitest";
import { Pokedex } from "./pokedex";

const updateRequestState = vi.fn();
const updateFilterState = vi.fn();
const updateLoadingInResetButton = vi.fn();
const updateHeaderHeight = vi.fn();

describe("Pokedex Component", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render a pokedex", async () => {
    const { getByTestId } = render(
      <Pokedex
        updateRequestState={updateRequestState}
        updateFilterState={updateFilterState}
        updateLoadingInResetButton={updateLoadingInResetButton}
        updateHeaderHeight={updateHeaderHeight}
      />
    );

    const ballButton = getByTestId("ball-button");
    const dexMiddle = getByTestId("dex-middle");
    const dexAside = getByTestId("dex-aside");

    fireEvent.click(ballButton);

    expect(dexMiddle).toHaveStyle("display: block");
    expect(dexMiddle).toHaveAttribute("class", "dex-middle dex-appear");
    expect(dexAside).toHaveStyle("display: block");
    expect(dexAside).toHaveAttribute("class", "dex-aside dex-appear");
    await waitFor(() => expect(updateHeaderHeight).toBeCalledTimes(1));
  });

  it("should set display none", async () => {
    const { getByTestId } = render(
      <Pokedex
        updateRequestState={updateRequestState}
        updateFilterState={updateFilterState}
        updateLoadingInResetButton={updateLoadingInResetButton}
        updateHeaderHeight={updateHeaderHeight}
      />
    );

    const ballButton = getByTestId("ball-button");
    const dexMiddle = getByTestId("dex-middle");
    const dexAside = getByTestId("dex-aside");

    fireEvent.click(ballButton);

    expect(dexMiddle).toHaveStyle("display: block");
    expect(dexMiddle).toHaveAttribute("class", "dex-middle dex-appear");
    expect(dexAside).toHaveStyle("display: block");
    expect(dexAside).toHaveAttribute("class", "dex-aside dex-appear");

    fireEvent.click(ballButton);

    expect(dexMiddle).toHaveAttribute("class", "dex-middle dex-desappear");
    expect(dexAside).toHaveAttribute("class", "dex-aside dex-desappear");
    await waitFor(() => {
      expect(dexMiddle).toHaveStyle("display: none");
      expect(dexAside).toHaveStyle("display: none");
    });
    expect(updateHeaderHeight).toBeCalledTimes(2);
  });

  it("should call a filter function ", () => {
    const { getByTestId } = render(
      <Pokedex
        updateRequestState={updateRequestState}
        updateFilterState={updateFilterState}
        updateLoadingInResetButton={updateLoadingInResetButton}
        updateHeaderHeight={updateHeaderHeight}
      />
    );

    const searchBar = getByTestId("search-bar");

    fireEvent.change(searchBar, { target: { value: "charizard" } });

    expect(updateRequestState).toBeCalledTimes(1);
    expect(updateRequestState).toBeCalledWith("charizard");
  });
});
