import { page } from "./page";

window.App = {
  index(root: string = "app") {
    const rootElement = document.getElementById(root);
    rootElement.innerText = "hello world";

    page();
  },
};
