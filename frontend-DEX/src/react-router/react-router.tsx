import { createBrowserRouter } from "react-router-dom";
import App from "../pages/home/home";
import { ShinyHome } from "../pages/shiny-home/shiny-home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "shiny-home/:id",
    element: <ShinyHome />
  }
]);
