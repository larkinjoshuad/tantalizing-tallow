import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// If the root already has server-rendered content (pre-rendered HTML),
// use hydrateRoot to attach event listeners without re-rendering the DOM.
// Otherwise (dev mode or if pre-rendering is bypassed), use createRoot.
const rootEl = document.getElementById("root");
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

if (rootEl.hasChildNodes()) {
  hydrateRoot(rootEl, app);
} else {
  createRoot(rootEl).render(app);
}