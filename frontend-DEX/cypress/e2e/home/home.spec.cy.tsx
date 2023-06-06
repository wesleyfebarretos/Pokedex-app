export {};
describe("Visit my home page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should open and close the dex", () => {
    // OPEN
    cy.get(".dex-middle").should("not.be.visible").and("have.css", "display", "none");
    cy.get(".dex-aside").should("not.be.visible").and("have.css", "display", "none");

    cy.get(".greater-ball-inside").click();

    cy.get(".dex-middle").should("be.visible").and("have.class", "dex-appear").and("have.css", "display", "block");
    cy.get(".dex-aside").should("be.visible").and("have.class", "dex-appear").and("have.css", "display", "block");

    // CLOSE

    cy.get(".greater-ball-inside").click();
    cy.get(".dex-middle").should("not.be.visible").and("have.class", "dex-desappear").and("have.css", "display", "none");
    cy.get(".dex-aside").should("not.be.visible").and("have.class", "dex-desappear").and("have.css", "display", "none");
  });

  it("should check if the filter by types is working and finally reset it", () => {
    cy.get(".greater-ball-inside").click();

    cy.get("#type").select("WATER");

    const cardLength = document.querySelectorAll(".card").length;
    const cardArray = Array.from({ length: cardLength });

    cy.wrap([cardArray]).each((index: number) =>
      cy.get(".card").eq(index).should("have.class", "card").and("have.css", "background-color", "rgb(102, 217, 255)")
    );

    const typesContainer = document.querySelectorAll(".types-container").length;
    const typeArray = Array.from({ length: typesContainer });

    cy.wrap([typeArray]).each((index: number) => cy.get(".types-container").eq(index).filter(":contains(WATER)"));

    cy.get("#reset-button").click();

    cy.get("#card-place")
      .find(".card")
      .its("length")
      .then(len => expect(len).to.equal(24));
  });

  it("should check if the filter by name is working and finally reset it", () => {
    cy.get(".greater-ball-inside").click();

    cy.get("#searchbar").type("charizard");

    cy.get("#card-place")
      .find(".card")
      .its("length")
      .then(len => expect(len).to.equal(1));
    cy.get("#card-place").find(".card").filter(":contains(charizard)");

    cy.get("#searchbar").clear();

    cy.get("#card-place")
      .find(".card")
      .its("length")
      .then(len => expect(len).to.equal(24));
  });

  it("should check if the both filters are working and finally reset it", () => {
    cy.get(".greater-ball-inside").click();

    cy.get("#type").select("WATER");
    cy.get("#searchbar").type("BL");

    cy.get("#card-place")
      .find(".card")
      .its("length")
      .then(len => expect(len).to.equal(1));
    cy.get("#card-place").find(".card").filter(":contains(blastoise)");

    cy.get("#reset-button").click();
    cy.get("#searchbar").clear();

    cy.get("#card-place")
      .find(".card")
      .its("length")
      .then(len => expect(len).to.equal(24));
  });

  it("should not be possible to find if the pokemon does not have the chosen type", () => {
    cy.get(".greater-ball-inside").click();

    cy.get("#type").select("WATER");
    cy.get("#searchbar").type("CHARIZARD");

    cy.get("#card-place").should("be.empty");
  });

  it("should check if infinite scrolling to fetch more cards is working", () => {
    const inicialLength = 24;

    cy.intercept("http://localhost:3000/pokemon").as("fetch");
    cy.wait("@fetch").then(() => {
      cy.window().its("scrollY").should("equal", 0);
      cy.get("#card-place")
        .find(".card")
        .its("length")
        .then(len => {
          expect(len).to.equal(inicialLength);
        });
      cy.window().scrollTo("bottom");
    });

    cy.intercept("http://localhost:3000/pokemon?offset=24&limit=24").as("fetch2");
    cy.wait("@fetch2").then(() => {
      cy.wait(500);
      cy.get("#card-place")
        .find(".card")
        .its("length")
        .then(len => {
          expect(len).to.equal(inicialLength * 2);
        });
      cy.window().scrollTo("bottom");
    });

    cy.intercept("http://localhost:3000/pokemon?offset=48&limit=24").as("fetch3");
    cy.wait("@fetch3").then(() => {
      cy.wait(500);
      cy.get("#card-place")
        .find(".card")
        .its("length")
        .then(len => {
          expect(len).to.equal(inicialLength * 3);
        });
      cy.window().scrollTo("bottom");
    });

    cy.intercept("http://localhost:3000/pokemon?offset=72&limit=24").as("fetch4");
    cy.wait("@fetch4").then(() => {
      cy.wait(500);
      cy.get("#card-place")
        .find(".card")
        .its("length")
        .then(len => {
          expect(len).to.equal(inicialLength * 4);
        });
    });

    cy.window().its("scrollY").should("be.greaterThan", 0);
  });

  it("should be able to click in card and go to shiny version", () => {
    cy.get(".link-container-1").eq(0).should("have.attr", "href", "/shiny-home/1").click();

    cy.visit("/");

    cy.get(".link-container-1").eq(2).should("have.attr", "href", "/shiny-home/3").click();
  });
});
