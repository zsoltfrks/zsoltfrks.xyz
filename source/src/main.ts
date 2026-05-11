import { mount } from "svelte";
import "./app.css";
import "./font-loader";
import App from "./App.svelte";

const target = document.getElementById("app");

if (!target) {
  throw new Error("App mount target #app was not found");
}

mount(App, { target });
