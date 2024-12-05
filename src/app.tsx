import * as React from "react";
import { createRoot } from "react-dom/client";
import { Main } from "./pages/main/index";

const root = createRoot(document.body.querySelector("#app"));
root.render(<Main />);
