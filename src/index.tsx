import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Application } from "./Application";
import { initStore } from "./store";

import "./index.css";

const PROD_BUILD = process?.env?.PROD_BUILD;
const GH_REPO = process?.env?.GH_REPO || "/";
const basename = PROD_BUILD ? GH_REPO.split("/")[1] : "";

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);

  const store = initStore();

  root.render(
    <BrowserRouter basename={basename}>
      <Provider store={store}>
        <Application />
      </Provider>
    </BrowserRouter>
  );
}
