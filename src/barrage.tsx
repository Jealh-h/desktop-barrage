import * as React from "react";
import { createRoot } from "react-dom/client";
import { Barrage } from "./pages/barrage/index";

const root = createRoot(document.body.querySelector("#barrage-root"));
root.render(<Barrage />);
