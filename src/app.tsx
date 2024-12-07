import * as React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { RouterView as Main } from "./pages/router";

const App = () => {
  return (
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  );
};

const root = createRoot(document.body.querySelector("#app"));
root.render(<App />);
