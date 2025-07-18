import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./index.css";  // <- DODAJ TĘ LINIJKĘ!

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);