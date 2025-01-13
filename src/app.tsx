import * as React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router";
import { RouterView as Main } from "./pages/router";

const App = () => {
  return (
    <HashRouter>
      <Main />
    </HashRouter>
  );
};

const root = createRoot(document.body.querySelector("#app"));
root.render(<App />);
