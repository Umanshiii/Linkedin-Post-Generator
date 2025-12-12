import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import favicon from "../assets/logo.jpeg";

// set favicon from src/assets
let link = document.querySelector(
  "link[rel~='icon']"
) as HTMLLinkElement | null;

if (!link) {
  link = document.createElement("link") as HTMLLinkElement;
  document.head.appendChild(link);
}

link.rel = "icon";
link.href = favicon;

const rootElement = document.getElementById("root") as HTMLElement;
createRoot(rootElement).render(<App />);
