import welcome from "./welcome";

window.App = {
  index() {
    import("./welcome").then((welcome) => welcome.default());
  },
};
