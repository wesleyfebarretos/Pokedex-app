export {};
describe("Visit my Shiny Home Page", () => {
  it("should render a shiny card", () => {
    cy.intercept("http://localhost:3000/pokemon/1").as("fetch");

    cy.visit("/shiny-home/1");

    cy.get("#card-place-link").find(".wrapper").should("exist");

    cy.wait("@fetch").then(() => {
      cy.get(".shiny-card").should("have.attr", "style", "background: linear-gradient(45deg, lightgreen, rgb(171, 143, 199));");
      cy.get(".shiny-card").find(".card-id").should("have.text", 1);
      cy.get(".shiny-card").find(".card-name").should("have.text", "SHINY BULBASAUR");
    });

    cy.get("#card-place-link").find(".wrapper").should("not.exist");
  });

  it("should fetch next pokemon", () => {
    cy.intercept("http://localhost:3000/pokemon/1").as("fetch");
    cy.intercept("http://localhost:3000/pokemon/2").as("fetch2");

    cy.visit("/shiny-home/1");

    cy.wait("@fetch").then(() => {
      cy.get("#next-link").should("have.attr", "href", "/shiny-home/2");
      cy.get(".next").click();
      cy.wait("@fetch2").then(() => {
        cy.get(".shiny-card").should("have.attr", "style", "background: linear-gradient(45deg, lightgreen, rgb(171, 143, 199));");
        cy.get(".shiny-card").find(".card-id").should("have.text", 2);
        cy.get(".shiny-card").find(".card-name").should("have.text", "SHINY IVYSAUR");
      });
    });
  });

  it("should fetch previous pokemon", () => {
    cy.intercept("http://localhost:3000/pokemon/5").as("fetch");
    cy.intercept("http://localhost:3000/pokemon/4").as("fetch2");

    cy.visit("/shiny-home/5");

    cy.wait("@fetch").then(() => {
      cy.get("#previous-link").should("have.attr", "href", "/shiny-home/4");
      cy.get(".previous").click();
      cy.wait("@fetch2").then(() => {
        cy.get(".shiny-card").should("have.attr", "style", "background: orange;");
        cy.get(".shiny-card").find(".card-id").should("have.text", 4);
        cy.get(".shiny-card").find(".card-name").should("have.text", "SHINY CHARMANDER");
      });
    });
  });

  it("should be not possible to fetch previous pokemon if id = 1", () => {
    cy.intercept("http://localhost:3000/pokemon/1").as("fetch");

    cy.visit("/shiny-home/1");

    cy.wait("@fetch").then(() => {
      cy.get(".previous").should("have.attr", "style", "border-bottom-color: red; border-left-color: transparent; border-right-color: transparent;");
      cy.get("#previous-link").should("have.attr", "href", "/shiny-home/1");
    });
  });

  it("should be not possible to fetch next pokemon if id = 1554", () => {
    cy.intercept("http://localhost:3000/pokemon/1154").as("fetch");

    cy.visit("/shiny-home/1154");

    cy.wait("@fetch").then(() => {
      cy.get(".next").should("have.attr", "style", "border-bottom-color: red; border-left-color: transparent; border-right-color: transparent;");
      cy.get("#next-link").should("have.attr", "href", "/shiny-home/1154");
    });
  });
});
