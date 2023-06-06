import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./global.scss";
import { router } from "./react-router/react-router";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<RouterProvider router={router} />);
